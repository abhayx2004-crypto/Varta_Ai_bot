import React, { useState, useEffect } from 'react';
import WidgetChat from './WidgetChat';

export default function FloatingWidget() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const closeHandler = (e) => {
      if (e.data === 'varta-close-chat') {
        setOpen(false);
      }
    };
    window.addEventListener('message', closeHandler);
    return () => window.removeEventListener('message', closeHandler);
  }, []);

  return (
    <>
      {open && (
        <div className="floating-chat-panel">
          <WidgetChat />
        </div>
      )}

      <button
        type="button"
        className="floating-chat-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat widget' : 'Open chat widget'}
      >
        {open ? (
          <i className="bi bi-x-lg"></i>
        ) : (
          <i className="bi bi-chat-dots-fill"></i>
        )}
      </button>
    </>
  );
}