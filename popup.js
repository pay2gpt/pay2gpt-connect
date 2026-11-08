// For buyers on @Pay2GPTBot: read the Session, then send it to the bot (copy and open the chat), save it as a .txt the
// bot takes as a file, or copy it. On a pay2gpt.com order page none of this is needed: the page's own button asks.
// Steps light up in turn: 1 sign in to chatgpt.com, 2 get the Session, 3 send it.
const t = (key, ...subs) => chrome.i18n.getMessage(key, subs);
const $ = (id) => document.getElementById(id);
const BOT = "https://t.me/Pay2GPTBot";
const SITE = t("site") || "https://pay2gpt.com";
let session = null;

const ICONS = {
  loading: '<span class="spin" aria-hidden="true"></span>',
  success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5v.01"/></svg>'
};

document.documentElement.lang = chrome.i18n.getUILanguage();
document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = t(node.dataset.i18n); });
document.querySelectorAll("[data-site]").forEach((link) => { link.href = SITE; });
document.querySelectorAll("[data-host]").forEach((node) => { node.textContent = new URL(SITE).host; });
document.querySelectorAll("[data-orders]").forEach((link) => { link.href = `${SITE}/orders`; });

function steps(active) {
  ["s1", "s2", "s3"].forEach((id, index) => {
    $(id).classList.toggle("done", index + 1 < active);
    $(id).classList.toggle("active", index + 1 === active);
  });
}

function status(kind, text) {
  $("status").className = kind ? `status show ${kind}` : "status";
  $("statusIcon").innerHTML = kind ? ICONS[kind] : "";
  $("statusText").textContent = text || "";
}

steps(1);

$("get").addEventListener("click", async () => {
  $("get").disabled = true;
  status("loading", t("getting"));
  const answer = await chrome.runtime.sendMessage({ type: "session:get" }).catch(() => ({ ok: false, error: "failed" }));
  $("get").disabled = false;
  if (!answer?.ok) {
    steps(answer?.error === "signed_out" ? 1 : 2);
    status("error", t(`error_${answer?.error || "failed"}`) || t("error_failed"));
    return;
  }
  session = answer.session;
  steps(3);
  status("success", t("got", answer.email));
  $("keyValue").textContent = "•".repeat(48);
  $("key").classList.add("show");
  $("get").hidden = true;
  $("after").classList.add("show");
});

$("reveal").addEventListener("click", () => {
  const shown = $("reveal").getAttribute("aria-pressed") !== "true";
  $("reveal").setAttribute("aria-pressed", String(shown));
  $("revealText").textContent = t(shown ? "hide" : "show");
  $("keyValue").classList.toggle("masked", !shown);
  $("keyValue").textContent = shown ? session : "•".repeat(48);
});

async function copy() {
  await navigator.clipboard.writeText(session);
}

$("bot").addEventListener("click", async () => {
  await copy();
  status("success", t("copiedForBot"));
  chrome.tabs.create({ url: BOT });
});

$("copy").addEventListener("click", async () => {
  await copy();
  status("success", t("copied"));
});

$("download").addEventListener("click", () => {
  const url = URL.createObjectURL(new Blob([session], { type: "text/plain" }));
  Object.assign(document.createElement("a"), { href: url, download: "chatgpt-session.txt" }).click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  status("success", t("saved"));
});
