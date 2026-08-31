# Clicky Setup Guide

Setup notes for [farzaa/clicky](https://github.com/farzaa/clicky) — an open-source
macOS menu-bar AI companion that sees your screen, talks back, and points at UI
elements with a cursor overlay.

Clicky is **not** part of OpenMontage and is not vendored into this repo. This
document exists so the setup steps (and the traps in them) are written down
somewhere durable.

## Compatibility — read this first

Clicky requires **macOS 14.2 (Sonoma) or later**. This is not a soft
recommendation; it is the project's build setting:

- `MACOSX_DEPLOYMENT_TARGET = 14.2` in all four build configurations of
  `leanring-buddy.xcodeproj/project.pbxproj`
- `objectVersion = 77` in the same file — the Xcode 16 project format, so
  Xcode 16+ is required just to *open* the project, which in turn requires
  macOS 14.5+
- The screen-capture path uses ScreenCaptureKit's modern content-sharing
  picker (`com.apple.screencapturekit.picker` in
  `leanring-buddy/leanring-buddy.entitlements`)

| Your macOS | Max Xcode | Can build Clicky? |
| --- | --- | --- |
| 11 Big Sur | 13.2.1 | No |
| 12 Monterey | 14.2 | No |
| 13 Ventura | 15.2 | No |
| 14.5+ Sonoma | 16.x | Yes |
| 15+ Sequoia | 16.x/26.x | Yes |

There is no supported way to lower the deployment target to Big Sur. The app
leans on ScreenCaptureKit and SwiftUI APIs that do not exist before Sonoma, so
"just change 14.2 to 11.0" produces a project that will not compile.

### If your Mac cannot run macOS 14.2+

1. **Deploy the Worker anyway.** The Cloudflare Worker (below) is plain
   TypeScript and runs fine from Big Sur. It is the reusable half of the
   project and is useful on its own as an API-key proxy.
2. **Build on a different Mac.** Any Sonoma-or-later Mac can build the app;
   the Worker URL is the only thing shared between machines.
3. **Check whether your Mac can upgrade.** Apple menu → About This Mac → model
   identifier, then compare against Apple's Sonoma compatibility list. Macs
   capped at Big Sur are generally 2013–2014 models.
4. **Skip the source build.** Prebuilt releases are at
   [heyclicky.com](https://www.heyclicky.com/) — but they carry the same
   macOS 14.2 floor, so this only helps if you upgrade.

## Part 1 — The Cloudflare Worker (works on any macOS)

The Worker is a thin proxy holding your API keys so they never ship inside the
app binary. Source: `worker/src/index.ts`, 141 lines, three routes.

| Route | Proxies to | Secret used |
| --- | --- | --- |
| `POST /chat` | `api.anthropic.com/v1/messages` (streaming SSE) | `ANTHROPIC_API_KEY` |
| `POST /tts` | `api.elevenlabs.io/v1/text-to-speech/{voice}` | `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID` |
| `POST /transcribe-token` | `streaming.assemblyai.com/v3/token` | `ASSEMBLYAI_API_KEY` |

### Prerequisites

- Node.js 18+ (Node 20 or 22 on Big Sur; **Node 24 requires macOS 13.5+**)
- A free Cloudflare account
- API keys from [Anthropic](https://console.anthropic.com),
  [AssemblyAI](https://www.assemblyai.com), [ElevenLabs](https://elevenlabs.io)

### Deploy

```bash
git clone https://github.com/farzaa/clicky.git
cd clicky/worker
npm install

npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler secret put ASSEMBLYAI_API_KEY
npx wrangler secret put ELEVENLABS_API_KEY

npx wrangler deploy
```

`ELEVENLABS_VOICE_ID` is not a secret — it lives in `worker/wrangler.toml`
under `[vars]` and ships with a default voice. Change it there if you want a
different one.

Deploy prints a URL like `https://clicky-proxy.<your-subdomain>.workers.dev`.
Save it; Part 2 needs it.

### Run it locally instead

```bash
cd worker
npx wrangler dev     # serves http://localhost:8787
```

Local dev reads secrets from `worker/.dev.vars` rather than Cloudflare:

```
ANTHROPIC_API_KEY=sk-ant-...
ASSEMBLYAI_API_KEY=...
ELEVENLABS_API_KEY=...
ELEVENLABS_VOICE_ID=...
```

`.dev.vars` holds live credentials. Upstream already git-ignores it
(`worker/.dev.vars` is line 2 of the repo's `.gitignore`), so it stays out of
commits by default — just don't move it.

### Verify

```bash
curl -X POST https://<your-worker>.workers.dev/transcribe-token
```

A JSON token means the AssemblyAI key is wired up. Note every route is
POST-only — a plain `curl` GET returns `405 Method not allowed`, which is
correct behavior, not a broken deploy.

## Part 2 — The macOS app (requires macOS 14.2+)

### Point the app at your Worker

The upstream README tells you to `grep -r "clicky-proxy" leanring-buddy/`.
That grep returns nothing — `clicky-proxy` is the Worker's *service* name in
`wrangler.toml`, not the string in the Swift source. The actual placeholder is
`your-worker-name.your-subdomain.workers.dev`, in exactly two places:

- `leanring-buddy/CompanionManager.swift:73` — `workerBaseURL` (Claude chat + TTS)
- `leanring-buddy/AssemblyAIStreamingTranscriptionProvider.swift:22` — `tokenProxyURL`

```bash
grep -rn "your-worker-name" leanring-buddy/
```

Replace both with your Worker URL. Keep the `/transcribe-token` suffix on the
second one.

### Build

```bash
open leanring-buddy.xcodeproj
```

1. Select the `leanring-buddy` scheme — the misspelling is intentional upstream.
2. **Signing & Capabilities → Team:** change it. `DEVELOPMENT_TEAM` is
   hardcoded to the upstream author's team ID (`6D7X9GGZAW`) in
   `project.pbxproj` and will fail to sign under your account.
3. Cmd + R.

The app appears in the menu bar, not the Dock.

### Permissions

Granted on first run, all in System Settings → Privacy & Security:

- **Microphone** — push-to-talk capture
- **Accessibility** — the global Control + Option shortcut
- **Screen Recording** / **Screen Content** — ScreenCaptureKit screenshots

Note that `app-sandbox` is `false` in the entitlements. The app runs
unsandboxed with full screen and input access, which is what makes the
"points at things on your screen" feature possible. Read the source before
granting these if that matters to you.

## Things worth changing in a fork

Verified by grepping the source; none of these are in the upstream README.

- **Analytics phone home.** `leanring-buddy/ClickyAnalytics.swift:19` sends
  events to PostHog (`https://us.i.posthog.com`). Remove it or point it at
  your own instance.
- **Auto-update feed points at a third party.** `Info.plist` sets `SUFeedURL`
  to a `raw.githubusercontent.com` appcast under an unrelated account. Sparkle
  is already disabled (the `startSparkleUpdater()` call is commented out in
  `leanring_buddyApp.swift:53`) — leave it that way, or repoint the feed at
  your own before re-enabling. Never ship a build that auto-updates from
  someone else's repo.
- **Feedback form and demo video** are hardcoded to upstream endpoints
  (`submit-form.com`, `stream.mux.com`).
- **Model IDs are a generation behind.** The app pins `claude-sonnet-4-6` and
  `claude-opus-4-6` (`ClaudeAPI.swift`, `ElementLocationDetector.swift`,
  `CompanionPanelView.swift:610-611`). Newer models are drop-in replacements
  for the Messages API calls used here.

## Upstream status

As of the repo's April 2026 README update, the author has stopped developing
this codebase in public — new work is closed-source, and the open version is
left as-is under MIT. Treat it as a fork-and-own starting point, not a
maintained dependency. Bugs you hit are yours to fix.
