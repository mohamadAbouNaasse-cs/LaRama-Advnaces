/**
 * MediaStreamView Component - LaRama Frontend
 * Renders a MediaStream inside a styled video element.
 */

import { useEffect, useRef } from 'react';

const MediaStreamView = ({ stream, label, mirrored = false, muted = false }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="live-video-tile">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        style={{ transform: mirrored ? 'scaleX(-1)' : 'none' }}
      />
      <span className="live-video-label">{label}</span>
    </div>
  );
};

export default MediaStreamView;
