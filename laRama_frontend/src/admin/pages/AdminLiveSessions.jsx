/**
 * Admin Live Sessions Page - LaRama Frontend
 * Displays a real-time queue of incoming buyer WebRTC session requests.
 */

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { createSignalingClient } from '../../live/services/signalingClient';

const AdminLiveSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  useEffect(() => {
    const { socket, connect, disconnect } = createSignalingClient();

    const handleSessionsUpdate = (payload) => {
      setSessions(Array.isArray(payload) ? payload : []);
    };

    socket.on('connect', () => {
      setConnectionStatus('connected');
      socket.emit('registerAdminWatcher');
    });

    socket.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });

    socket.on('sessions:update', handleSessionsUpdate);

    connect();

    return () => {
      if (socket.connected) {
        socket.emit('unregisterAdminWatcher');
      }
      socket.off('sessions:update', handleSessionsUpdate);
      disconnect();
    };
  }, []);

  const waitingSessions = useMemo(
    () => sessions.filter((session) => session.status !== 'active'),
    [sessions],
  );

  return (
    <div>
      <div className="admin-card">
        <h2>Live Shopping Sessions</h2>
        <p>
          Monitor and join customer video requests in real-time. This list updates
          automatically when a buyer opens a live preview for a handcrafted item.
        </p>
        <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
          Signaling server: <strong>{connectionStatus}</strong>
        </p>
      </div>

      {waitingSessions.length === 0 ? (
        <div className="admin-empty-state">
          <p>No buyers are waiting at the moment.</p>
          <p>Invite customers to request a live preview from their dashboard or contact page.</p>
        </div>
      ) : (
        <table className="admin-table" aria-label="Live session queue">
          <thead>
            <tr>
              <th scope="col">Room ID</th>
              <th scope="col">Product Reference</th>
              <th scope="col">Requested</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {waitingSessions.map((session) => (
              <tr key={session.roomId}>
                <td>{session.roomId}</td>
                <td>{session.productId}</td>
                <td>{new Date(session.createdAt).toLocaleTimeString()}</td>
                <td>
                  <Link
                    className="admin-nav-link"
                    style={{ display: 'inline-flex', padding: '0.5rem 1rem' }}
                    to={`/admin/live-sessions/room/${session.roomId}`}
                    state={{ productId: session.productId }}
                  >
                    Join Session
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminLiveSessions;
