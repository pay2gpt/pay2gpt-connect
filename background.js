// Reads the signed-in account's ChatGPT Session for the order page (through content.js) and for the popup.
// The request runs inside a chatgpt.com tab, so the browser sends its own cookies and passes Cloudflare as a page
// would. Nothing is stored: the Session goes back to the asking page or popup and is gone when they are.

const CHATGPT = "https://chatgpt.com/";
const LOAD_TIMEOUT_MS = 20000;

// Content scripts reach only pages loaded after install, so an order page open while the extension is installed or
// updated gets content.js now; its one-click button then shows without a reload. After an update the copy already in
// the page has lost its runtime and stays silent (content.js). A browser update leaves that copy working: no second one.
chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason !== "install" && reason !== "update") return;
  const matches = chrome.runtime.getManifest().content_scripts[0].matches;
  const tabs = await chrome.tabs.query({ url: matches });
  await Promise.all(tabs.map((tab) => chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["content.js"] }).catch(() => {})));
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== "session:get") return false;
  // Only our own popup and the pay2gpt.com pages content.js runs on may ask.
  if (sender.id !== chrome.runtime.id) return false;

  getSession().then(sendResponse);
  return true; // answered asynchronously
});

// { ok: true, session: "<JSON>", email } or { ok: false, error: "signed_out" | "incomplete" | "challenge" | "failed" }.
async function getSession() {
  const { tab, created } = await chatgptTab();
  try {
    const answer = await readSession(tab.id);
    if (answer.error === "challenge" || answer.error === "signed_out") {
      // The buyer has to do something on chatgpt.com: pass the check or sign in. Show them the page.
      await showChatgpt(tab);
      return answer;
    }
    if (created) await chrome.tabs.remove(tab.id).catch(() => {});
    return answer;
  } catch (error) {
    if (created) await chrome.tabs.remove(tab.id).catch(() => {});
    return { ok: false, error: "failed", detail: String(error?.message || error) };
  }
}

// An open chatgpt.com tab when there is one; otherwise one opened in the background for this read.
async function chatgptTab() {
  const tabs = await chrome.tabs.query({ url: "https://chatgpt.com/*" });
  const ready = tabs.find((tab) => tab.status === "complete") || tabs[0];
  if (ready) return { tab: ready, created: false };

  const tab = await chrome.tabs.create({ url: CHATGPT, active: false });
  await loaded(tab.id);
  return { tab, created: true };
}

function loaded(tabId) {
  return new Promise((resolve) => {
    const done = () => {
      chrome.tabs.onUpdated.removeListener(listener);
      clearTimeout(timer);
      resolve();
    };
    const listener = (id, info) => { if (id === tabId && info.status === "complete") done(); };
    const timer = setTimeout(done, LOAD_TIMEOUT_MS);
    chrome.tabs.onUpdated.addListener(listener);
  });
}

async function readSession(tabId) {
  const [result] = await chrome.scripting.executeScript({
    target: { tabId },
    func: async () => {
      try {
        const response = await fetch("/api/auth/session", { credentials: "include", cache: "no-store", headers: { accept: "application/json" } });
        return { status: response.status, text: await response.text() };
      } catch (error) {
        return { error: String(error?.message || error) };
      }
    }
  });
  const read = result?.result;
  if (!read || read.error) return { ok: false, error: "failed", detail: read?.error };

  const text = read.text.trim();
  // A Cloudflare check answers with a page, not JSON.
  if (!text.startsWith("{")) return { ok: false, error: "challenge" };

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, error: "failed" };
  }
  const email = data?.user?.email;
  if (!data.accessToken || !email) return { ok: false, error: "signed_out" };
  if (!data.sessionToken) return { ok: false, error: "incomplete" };

  delete data.WARNING_BANNER;
  return { ok: true, session: JSON.stringify(data), email };
}

// Brings the chatgpt.com tab forward as it is, so a conversation the buyer has open stays put.
async function showChatgpt(tab) {
  await chrome.tabs.update(tab.id, { active: true });
  if (tab.windowId !== undefined) await chrome.windows.update(tab.windowId, { focused: true }).catch(() => {});
}
