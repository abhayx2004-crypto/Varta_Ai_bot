(function () {
  // Prevent loading the widget more than once
  if (window.ContextaWidgetInitialized) return;
  window.ContextaWidgetInitialized = true;

  // Find the script that loaded widget.js
  const scriptTag =
    document.currentScript ||
    document.querySelector('script[src*="widget.js"]');

  // Automatically detect backend URL
  const backendUrl = scriptTag
    ? new URL(scriptTag.src).origin
    : "http://localhost:5000";

  // Chatbot UI is still served by your backend.
  // It opens INSIDE the widget, not as a separate page.
  const iframeUrl = `${backendUrl}/widget-frame`;

  // ==============================
  // CSS
  // ==============================

  const style = document.createElement("style");

  style.textContent = `
    #contexta-launcher {
      position: fixed;
      right: 24px;
      bottom: 24px;

      width: 62px;
      height: 62px;

      border: none;
      border-radius: 50%;

      background: linear-gradient(
        135deg,
        #38bdf8,
        #0284c7
      );

      color: white;

      cursor: pointer;

      z-index: 999999;

      display: flex;
      align-items: center;
      justify-content: center;

      font-size: 28px;

      box-shadow:
        0 8px 25px rgba(2, 132, 199, 0.35);

      transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
    }

    #contexta-launcher:hover {
      transform: scale(1.08);

      box-shadow:
        0 10px 30px rgba(2, 132, 199, 0.45);
    }

    #contexta-launcher:active {
      transform: scale(0.96);
    }

    #contexta-container {
      position: fixed;

      right: 24px;
      bottom: 100px;

      width: 390px;
      height: 590px;

      background: white;

      border-radius: 18px;

      overflow: hidden;

      box-shadow:
        0 15px 50px rgba(15, 23, 42, 0.25);

      border: 1px solid #e0f2fe;

      z-index: 999998;

      display: none;
    }

    #contexta-iframe {
      width: 100%;
      height: 100%;

      border: none;

      display: block;

      background: white;
    }

    @media (max-width: 600px) {

      #contexta-container {
        width: calc(100vw - 20px);
        height: calc(100vh - 100px);

        right: 10px;
        bottom: 85px;

        border-radius: 16px;
      }

      #contexta-launcher {
        right: 15px;
        bottom: 15px;

        width: 58px;
        height: 58px;
      }
    }

    @media (max-width: 400px) {

      #contexta-container {
        width: 100vw;
        height: 100vh;

        right: 0;
        bottom: 0;

        border-radius: 0;
      }
    }
  `;

  document.head.appendChild(style);

  // ==============================
  // CREATE CHAT BUTTON
  // ==============================

  const launcher = document.createElement("button");

  launcher.id = "contexta-launcher";
  launcher.type = "button";
  launcher.title = "Chat with Contexta AI";
  launcher.setAttribute(
    "aria-label",
    "Open Contexta AI chatbot"
  );

  launcher.innerHTML = "💬";

  document.body.appendChild(launcher);

  // ==============================
  // CREATE CHAT CONTAINER
  // ==============================

  const container = document.createElement("div");

  container.id = "contexta-container";

  const iframe = document.createElement("iframe");

  iframe.id = "contexta-iframe";

  iframe.src = iframeUrl;

  iframe.title = "Contexta AI Chatbot";

  iframe.allow = "clipboard-write";

  container.appendChild(iframe);

  document.body.appendChild(container);

  // ==============================
  // OPEN / CLOSE CHAT
  // ==============================

  let isOpen = false;

  function openChat() {
    isOpen = true;

    container.style.display = "block";

    launcher.innerHTML = "✕";

    launcher.setAttribute(
      "aria-label",
      "Close Contexta AI chatbot"
    );

    console.log("Contexta AI opened");
  }

  function closeChat() {
    isOpen = false;

    container.style.display = "none";

    launcher.innerHTML = "💬";

    launcher.setAttribute(
      "aria-label",
      "Open Contexta AI chatbot"
    );

    console.log("Contexta AI closed");
  }

  launcher.addEventListener("click", function () {

    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }

  });

  // ==============================
  // CLOSE CHAT FROM IFRAME
  // ==============================

  window.addEventListener("message", function (event) {

    if (event.data === "contexta-close-chat") {
      closeChat();
    }

  });

  // ==============================
  // DEBUG
  // ==============================

  console.log("=================================");
  console.log("Contexta AI Widget Loaded");
  console.log("Backend:", backendUrl);
  console.log("Chatbot:", iframeUrl);
  console.log("=================================");

})();