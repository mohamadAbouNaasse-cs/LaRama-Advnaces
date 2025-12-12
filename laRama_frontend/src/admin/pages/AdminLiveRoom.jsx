/**
 * AdminLiveRoom Page - Administrator WebRTC View
 * Enables Rama to join a buyer's live session directly from the admin panel.
 */

import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useWebRTCSession from '../../live/hooks/useWebRTCSession';
import MediaStreamView from '../../live/components/MediaStreamView';
import '../styles/admin.css';
import '../../live/styles/live.css';

const AdminLiveRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const productId = location.state?.productId || roomId;

  const {
    status,
    error,
    localStream,
    remoteStream,
    joinSession,
    leaveSession,
  } = useWebRTCSession({
    roomId,
    productId,
    role: 'admin',
    displayName: 'LaRama Admin',
  });

  return (
    <div className="admin-card" style={{ padding: 0 }}>
      <div className="live-session-container" style={{ border: 'none', boxShadow: 'none' }}>
        <div className="live-session-header">
          <div>
            <h1>Session Room: {roomId}</h1>
            <p>Showcase product <strong>{productId}</strong> and guide the customer.</p>
          </div>
          <div className="live-session-controls" style={{ gap: '0.75rem' }}>
            <button
              type="button"
              className="join"
              onClick={joinSession}
              disabled={status === 'connecting' || status === 'connected'}
            >
              {status === 'connected' ? 'Connected' : 'Join Session'}
            </button>
            <button
              type="button"
              className="leave"
              onClick={() => {
                leaveSession();
                navigate('/admin/live-sessions');
              }}
              disabled={status === 'idle'}
            >
              Leave Session
            </button>
          </div>
        </div>

        <div className="live-session-videos">
          <MediaStreamView stream={localStream} label="LaRama Admin" mirrored muted={false} />
          <MediaStreamView stream={remoteStream} label="Customer" />
        </div>

        <div className="live-session-status">
          <strong>Status:</strong> {status}
          {error && <p style={{ marginTop: '0.75rem', color: '#e74c3c' }}>{error}</p>}
          {!remoteStream && status !== 'connected' && (
            <p>Waiting for customer media feed. Engage when ready.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLiveRoom;
