/**
 * useWebRTCSession Hook - LaRama Frontend
 * Encapsulates WebRTC peer connection state and Socket.IO signaling logic.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createSignalingClient } from '../services/signalingClient';

const ICE_CONFIGURATION = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    // Twilio's STUN service requires the transport query to be omitted for browser compatibility
    { urls: 'stun:global.stun.twilio.com:3478' },
  ],
};

export const useWebRTCSession = ({ roomId, role, productId, displayName }) => {
  const signalingRef = useRef(null);
  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const offerMadeRef = useRef(false);

  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const safeRole = role === 'admin' ? 'admin' : 'buyer';

  const ensurePeerConnection = useCallback(() => {
    if (peerConnectionRef.current) {
      return peerConnectionRef.current;
    }

    const peer = new RTCPeerConnection(ICE_CONFIGURATION);

    peer.onicecandidate = (event) => {
      if (event.candidate && socketRef.current?.connected) {
        socketRef.current.emit('signal:ice-candidate', {
          roomId,
          candidate: event.candidate,
        });
      }
    };

    peer.ontrack = (event) => {
      const [stream] = event.streams;
      if (!stream) return;
      remoteStreamRef.current = stream;
      setRemoteStream(stream);
    };

    peer.onconnectionstatechange = () => {
      if (['connected', 'completed'].includes(peer.connectionState)) {
        setStatus('connected');
      }

      if (peer.connectionState === 'failed') {
        setStatus('error');
        setError('Connection failed. Please try again.');
      }
    };

    peerConnectionRef.current = peer;
    return peer;
  }, [roomId]);

  const attachLocalTracks = useCallback((stream) => {
    const peer = ensurePeerConnection();
    const existingSenders = peer.getSenders();

    stream.getTracks().forEach((track) => {
      const sender = existingSenders.find((s) => s.track && s.track.kind === track.kind);
      if (sender) {
        sender.replaceTrack(track);
      } else {
        peer.addTrack(track, stream);
      }
    });
  }, [ensurePeerConnection]);

  const createOffer = useCallback(async () => {
    try {
      const peer = ensurePeerConnection();
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      offerMadeRef.current = true;
      socketRef.current?.emit('signal:offer', { roomId, sdp: offer });
      setStatus('connecting');
    } catch (offerError) {
      setError('Unable to create offer, please retry.');
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Offer error:', offerError);
      }
    }
  }, [ensurePeerConnection, roomId]);

  const createAnswer = useCallback(async () => {
    try {
      const peer = ensurePeerConnection();
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      socketRef.current?.emit('signal:answer', { roomId, sdp: answer });
      setStatus('connecting');
    } catch (answerError) {
      setError('Unable to create answer, please retry.');
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Answer error:', answerError);
      }
    }
  }, [ensurePeerConnection, roomId]);

  const initializeMedia = useCallback(async () => {
    if (localStreamRef.current) {
      return localStreamRef.current;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      setLocalStream(stream);
      attachLocalTracks(stream);
      return stream;
    } catch (mediaError) {
      setError('Camera or microphone access was blocked.');
      throw mediaError;
    }
  }, [attachLocalTracks]);

  const teardownStreams = useCallback(() => {
    offerMadeRef.current = false;

    if (peerConnectionRef.current) {
      peerConnectionRef.current.getSenders().forEach((sender) => {
        try {
          sender.track?.stop();
        } catch (err) {
          if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.warn('Failed stopping sender track', err);
          }
        }
      });
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    remoteStreamRef.current = null;

    setLocalStream(null);
    setRemoteStream(null);
  }, []);

  useEffect(() => {
    const { socket, connect, disconnect } = createSignalingClient();
    socketRef.current = socket;
    signalingRef.current = { connect, disconnect };

    const handleConnect = () => {
      socket.emit('joinRoom', {
        roomId,
        productId,
        role: safeRole,
        userName: displayName,
      });
    };

    const handlePartnerLeft = () => {
      setStatus('waiting');
      setRemoteStream(null);
      remoteStreamRef.current = null;
      offerMadeRef.current = false;
    };

    socket.on('connect', handleConnect);

    socket.on('session:joined', ({ role: joinedRole }) => {
      if (joinedRole === 'buyer') {
        setStatus('waiting');
      } else {
        setStatus('ready');
      }
    });

    socket.on('session:waiting', () => {
      setStatus('waiting');
    });

    socket.on('session:admin-ready', () => {
      if (safeRole === 'buyer' && !offerMadeRef.current) {
        createOffer();
      }
      setStatus('connecting');
    });

    socket.on('session:buyer-ready', () => {
      if (safeRole === 'admin') {
        setStatus('connecting');
      }
    });

    socket.on('signal:offer', async ({ sdp }) => {
      if (safeRole !== 'admin') return;
      try {
        const peer = ensurePeerConnection();
        await peer.setRemoteDescription(sdp);
        await createAnswer();
      } catch (offerError) {
        setError('Could not process incoming offer.');
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.error('Handle offer error:', offerError);
        }
      }
    });

    socket.on('signal:answer', async ({ sdp }) => {
      if (safeRole !== 'buyer') return;
      try {
        const peer = ensurePeerConnection();
        await peer.setRemoteDescription(sdp);
        setStatus('connected');
      } catch (answerError) {
        setError('Could not finalize the call.');
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.error('Handle answer error:', answerError);
        }
      }
    });

    socket.on('signal:ice-candidate', async ({ candidate }) => {
      try {
        const peer = ensurePeerConnection();
        await peer.addIceCandidate(candidate);
      } catch (iceError) {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.error('Failed to add ICE candidate:', iceError);
        }
      }
    });

    socket.on('session:partner-left', handlePartnerLeft);

    socket.on('disconnect', () => {
      setStatus('idle');
      offerMadeRef.current = false;
    });

    return () => {
      socket.off('connect', handleConnect);
      socket.off('session:joined');
      socket.off('session:waiting');
      socket.off('session:admin-ready');
      socket.off('session:buyer-ready');
      socket.off('signal:offer');
      socket.off('signal:answer');
      socket.off('signal:ice-candidate');
      socket.off('session:partner-left', handlePartnerLeft);
      disconnect();
      teardownStreams();
    };
  }, [roomId, productId, safeRole, displayName, createOffer, createAnswer, ensurePeerConnection, teardownStreams]);

  const joinSession = useCallback(async () => {
    if (status === 'connected' || status === 'connecting') return;

    try {
      setStatus('initializing');
      await initializeMedia();
      signalingRef.current?.connect();
      setStatus(safeRole === 'admin' ? 'ready' : 'waiting');
    } catch (joinError) {
      setStatus('error');
      setError(joinError.message || 'Unable to join live session.');
    }
  }, [initializeMedia, safeRole, status]);

  const leaveSession = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('leaveRoom', { roomId });
      signalingRef.current?.disconnect();
    }
    teardownStreams();
    setStatus('idle');
  }, [roomId, teardownStreams]);

  const state = useMemo(() => ({
    status,
    error,
    localStream,
    remoteStream,
    isConnected: status === 'connected',
  }), [status, error, localStream, remoteStream]);

  return {
    ...state,
    joinSession,
    leaveSession,
  };
};

export default useWebRTCSession;
