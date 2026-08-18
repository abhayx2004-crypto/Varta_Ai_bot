import React from 'react';
import WidgetChat from './components/WidgetChat';
import EventEase from './components/EventEase';

function App() {
  const path = window.location.pathname;

  // =====================================================
  // CONTEXTA AI CHATBOT
  // =====================================================
  // This route is used internally by widget.js (the old
  // script-tag embedding approach). Keep it so existing
  // embeds keep working.
  // =====================================================

  if (path === '/widget-frame') {
    return <WidgetChat />;
  }

  // =====================================================
  // DEFAULT (HOME ROUTE)
  // =====================================================
  // The EventEase website now lives inside the React app.
  // The chat widget (FloatingWidget + WidgetChat) is
  // rendered directly as a component, no iframe needed.
  // =====================================================

  return <EventEase />;
}

export default App;