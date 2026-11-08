// The bridge between a pay2gpt.com page and this extension. It marks the page so the order page can offer the one-click
// connection, and answers the page's request for the Session with what background.js reads from chatgpt.com.
// It runs only on pay2gpt.com (manifest content_scripts) and only answers messages from the page's own window.
(() => {
  const VERSION = chrome.runtime.getManifest().version;
  const root = document.documentElement;
  root.setAttribute("data-pay2gpt-connect", VERSION);
  window.dispatchEvent(new CustomEvent("pay2gpt-connect:ready", { detail: { version: VERSION } }));

  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== location.origin) return;
    const message = event.data;
    if (message?.source !== "pay2gpt-page" || message.type !== "session:get") return;

    chrome.runtime.sendMessage({ type: "session:get" }, (answer) => {
      const reply = chrome.runtime.lastError ? { ok: false, error: "failed" } : answer;
      window.postMessage({ source: "pay2gpt-connect", type: "session:result", id: message.id, ...reply }, location.origin);
    });
  });
})();
