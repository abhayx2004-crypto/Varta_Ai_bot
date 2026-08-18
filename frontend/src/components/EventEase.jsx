import React, { useEffect } from 'react';
import initEventease from '../eventease';
import siteHtml from '../eventease-site.html?raw';
import '../eventease.css';
import FloatingWidget from './FloatingWidget';

export default function EventEase() {
  useEffect(() => {
    initEventease();
  }, []);

  return (
    <>
      <div
        id="eventease-site"
        dangerouslySetInnerHTML={{ __html: siteHtml }}
      />
      <FloatingWidget />
    </>
  );
}