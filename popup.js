// For buyers on @Pay2GPTBot: read the Session, then copy it and open the bot, copy it, or save it as a .txt the bot
// takes as a file. On the pay2gpt.com order page none of this is needed: the page asks for the Session itself.
const t = (key) => chrome.i18n.getMessage(key);
const $ = (id) => document.getElementById(id);
const BOT = "https://t.me/Pay2GPTBot";
let session = null;

document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = t(node.dataset.i18n); });

$("get").addEventListener("click", async () => {
  const button = $("get");
  button.disabled = true;
  button.textContent = t("getting");
  $("error").hidden = true;
  const answer = await chrome.runtime.sendMessage({ type: "session:get" }).catch(() => ({ ok: false, error: "failed" }));
  button.disabled = false;
  button.textContent = t("get");
  if (!answer?.ok) {
    $("error").textContent = t(`error_${answer?.error || "failed"}`) || t("error_failed");
    $("error").hidden = false;
    return;
  }
  session = answer.session;
  $("account").textContent = answer.email;
  $("account").hidden = false;
  button.hidden = true;
  $("done").hidden = false;
});

async function copy() {
  await navigator.clipboard.writeText(session);
}

$("bot").addEventListener("click", async () => {
  await copy();
  chrome.tabs.create({ url: BOT });
});

$("copy").addEventListener("click", async () => {
  await copy();
  $("copy").textContent = t("copied");
  setTimeout(() => { $("copy").textContent = t("copy"); }, 1500);
});

$("download").addEventListener("click", () => {
  const url = URL.createObjectURL(new Blob([session], { type: "text/plain" }));
  const link = Object.assign(document.createElement("a"), { href: url, download: "chatgpt-session.txt" });
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
