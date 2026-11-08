# Chrome Web Store submission

Upload `dist/pay2gpt-connect-<version>.zip` from `scripts/build.sh` (never `dist/dev`).

## Store listing

- **Name**: from `_locales` (`Pay2GPT — Connect ChatGPT`, `Pay2GPT — 一键连接 ChatGPT`, …)
- **Category**: Productivity
- **Language**: English (default), plus Chinese (Simplified), Chinese (Traditional), Russian from `_locales`
- **Homepage**: https://pay2gpt.com/
- **Support**: https://pay2gpt.com/help
- **Privacy policy**: https://github.com/pay2gpt/pay2gpt-connect/blob/main/PRIVACY.md
- **Screenshots** (1280×800): `store/1-order-page.png` … `store/5-popup.png`
- **Icon**: `icons/icon128.png`

### Description (English)

Connect your ChatGPT account to a Pay2GPT order in one click.

On a pay2gpt.com order page, click "Connect ChatGPT in one click". The extension reads the Session of the account you
are signed in to on chatgpt.com in this browser and hands it to that order page. No more opening a link, selecting
everything, copying and pasting.

Ordering in @Pay2GPTBot on Telegram? Tap "Connect on a computer" in the bot, or click the extension's icon, choose
"Get Session" and send it to the bot.

- Works with the browser's own chatgpt.com sign-in; no password asked.
- The Session goes only to pay2gpt.com or your clipboard. Nothing is stored, nothing is sent anywhere else.
- Open source: https://github.com/pay2gpt/pay2gpt-connect

### 描述（中文）

一键把你的 ChatGPT 账号连接到 Pay2GPT 订单。

在 pay2gpt.com 的订单页点「一键连接 ChatGPT 账号」，插件读取这个浏览器里已登录 chatgpt.com 的账号的 Session，交给订单页。
不用再打开链接、全选、复制、粘贴。

在 Telegram 的 @Pay2GPTBot 下单？在机器人里点「电脑一键连接」，或点插件图标「获取 Session」再发给机器人。

- 用浏览器里已登录的 chatgpt.com，不需要密码。
- Session 只交给 pay2gpt.com 或复制到剪贴板，不保存，也不发到其他地方。
- 开源：https://github.com/pay2gpt/pay2gpt-connect

## Privacy practices tab

**Single purpose**: Connect the user's ChatGPT account to their Pay2GPT order by passing the ChatGPT Session of the
signed-in account to the pay2gpt.com order page (or the clipboard, for the Pay2GPT Telegram bot) when the user asks.

**Permission justifications**

| Permission | Justification |
|---|---|
| `host_permissions: https://chatgpt.com/*` | Read `https://chatgpt.com/api/auth/session` for the signed-in account, only when the user clicks Connect or Get Session. |
| `scripting` | Run that single same-origin request inside a chatgpt.com tab, so the browser's own cookies are used and the site's bot check passes. |
| `clipboardWrite` | Copy the Session when the user chooses to send it to the Pay2GPT Telegram bot. |
| Content script on `pay2gpt.com`, `ru.pay2gpt.com` | Show the one-click button on the user's order page and hand the Session to that page. |

**Remote code**: No, all code is in the package.

**Data usage** — collects: *Authentication information* (the ChatGPT Session), only to provide the single purpose.
Certify: not sold to third parties; not used or transferred for purposes unrelated to the single purpose; not used for
creditworthiness or lending.

## Developer account (decided by Jalen)

- Register as a **trader** under the US company (address, phone and email shown on the listing).
- Verify `pay2gpt.com` in Google Search Console with the same Google account, then link it in the listing, so the store
  shows "Created by the owner of the listed website".
- Use a dedicated company Google account, not a personal one.
