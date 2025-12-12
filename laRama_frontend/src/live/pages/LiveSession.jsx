/**
 * LiveSession Page - Buyer View
 * Enables LaRama customers to join a live WebRTC session for a product.
 */

import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import useWebRTCSession from '../hooks/useWebRTCSession';
import MediaStreamView from '../components/MediaStreamView';
import '../styles/live.css';

const LiveSession = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth', { replace: true, state: { from: { pathname: `/live/${productId}` } } });
    }
  }, [isAuthenticated, navigate, productId]);

  const displayName = user?.name || user?.email || 'LaRama Customer';

  const {
    status,
    error,
    localStream,
    remoteStream,
    joinSession,
    leaveSession,
  } = useWebRTCSession({
    roomId: productId,
    role: 'buyer',
    productId,
    displayName,
  });

  return (
    <div className="page-container">
      <div className="live-session-container">
        <div className="live-session-header">
          <div>
            <h1>Live Preview for {productId}</h1>
            <p>Connect with Rama to see handcrafted details and progress for this item.</p>
          </div>
        </div>

        <div className="live-session-videos">
          <MediaStreamView stream={localStream} label="You" mirrored muted />
          <MediaStreamView stream={remoteStream} label="LaRama Studio" />
        </div>

        <div className="live-session-controls">
          <button
            type="button"
            className="join"
            onClick={joinSession}
            disabled={status === 'connecting' || status === 'connected' || !isAuthenticated}
          >
            {status === 'connected' ? 'Connected' : 'Join Session'}
          </button>
          <button
            type="button"
            className="leave"
            onClick={leaveSession}
            disabled={status === 'idle'}
          >
            Leave Session
          </button>
        </div>

        <div className="live-session-status">
          <strong>Status:</strong> {status}
          {error && <p style={{ marginTop: '0.75rem', color: '#e74c3c' }}>{error}</p>}
          {!remoteStream && status === 'waiting' && (
            <p>Waiting for LaRama to join. We will notify the workshop immediately.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveSession;
