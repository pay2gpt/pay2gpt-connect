# Pay2GPT Connect

> Pay2GPT is an independent service, not affiliated with OpenAI. ChatGPT is a trademark of OpenAI.

Chrome extension that connects your ChatGPT account to a [Pay2GPT](https://pay2gpt.com) order in one click.

一键把你的 ChatGPT 账号连接到 Pay2GPT 订单，不用再打开链接、全选、复制、粘贴。

## How it works

- **On a pay2gpt.com order page**: the page shows **Connect ChatGPT in one click**. The extension reads the Session of the
  account signed in to chatgpt.com in this browser and hands it to that page, which submits it to the order.
- **From @Pay2GPTBot**: the bot's **Connect on a computer** button opens the same one-click page for your Telegram order.
- **In the popup**: **Get Session**, then copy it and open [@Pay2GPTBot](https://t.me/Pay2GPTBot), copy it, or save it as a `.txt`.

The Session is read with `fetch("/api/auth/session")` inside a chatgpt.com tab (an open one, or one opened in the
background and closed afterwards), so your own browser cookies are used and nothing passes through any other server.

## Privacy

- Nothing is stored. The Session goes only to the pay2gpt.com page that asked for it, or to your clipboard / a file you save.
- The extension runs its page script only on `pay2gpt.com` and `ru.pay2gpt.com`, and reads only `chatgpt.com`.
- No analytics, no remote code. See [PRIVACY.md](PRIVACY.md).

## Permissions

| Permission | Why |
|---|---|
| `https://chatgpt.com/*` | Read `/api/auth/session` in a chatgpt.com tab |
| `scripting` | Run that one request inside the chatgpt.com tab |
| `clipboardWrite` | Copy the Session for @Pay2GPTBot |
| `https://pay2gpt.com/*`, `https://ru.pay2gpt.com/*` and a content script there | Offer the one-click button and hand the Session to the order page; on install, reach order pages already open so they need no reload |

## Develop

```sh
scripts/build.sh   # dist/pay2gpt-connect-<version>.zip for the store, dist/dev for local testing
```

`dist/dev` also runs on `http://localhost` so it works with a local pay2gpt.com server. Load it from
`chrome://extensions` → Developer mode → Load unpacked. Never upload `dist/dev`.

## License

MIT
