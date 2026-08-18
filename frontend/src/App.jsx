import React from 'react';
import WidgetChat from './components/WidgetChat';

function App() {
  const path = window.location.pathname;

  // =====================================================
  // CONTEXTA AI CHATBOT
  // =====================================================
  // This route is used internally by widget.js.
  //
  // You normally DO NOT open this URL yourself.
  //
  // EventEase
  //    ↓
  // Floating 💬 button
  //    ↓
  // widget.js
  //    ↓
  // /widget-frame
  //    ↓
  // WidgetChat
  // =====================================================

  if (path === '/widget-frame') {
    return <WidgetChat />;
  }

  // =====================================================
  // DEFAULT
  // =====================================================
  //
  // EventEase itself is your main website.
  // It is served by the Node/Express server from index.html.
  //
  // If React is accidentally opened at another route,
  // show a simple message instead of Admin/Hub pages.
  // =====================================================

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
        background: '#f8fafc',
        padding: '20px',
        textAlign: 'center'
      }}
    >
      <div>
        <h1
          style={{
            color: '#0f172a',
            marginBottom: '10px'
          }}
        >
          EventEase
        </h1>

        <p
          style={{
            color: '#64748b'
          }}
        >
          Discover events and chat with the EventEase AI assistant.
        </p>
      </div>
    </div>
  );
}

export default App;