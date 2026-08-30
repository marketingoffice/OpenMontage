# HomeEstimator.ai Tutorial — Cut List (PROVISIONAL)

**Status: NOT APPROVED FOR RENDER. Timecodes are UNVERIFIED.**

Source: `Home Estimator Demo Video.mp4` (Google Drive, 97 MB) — **located but unreachable, see below.** Stated duration 29:52.
Transcript: `Home_Estimator_Demo_Video.txt` (TurboScribe export, **no timestamps**).

---

## Blocking gap — read this first

Step 1 of the brief ("verify each in/out against the real audio, adjust so cuts land
in silence between sentences") **has not been performed and cannot be yet.**

**The MP4 has been located but cannot be fetched into this session.**
`Home Estimator Demo Video.mp4` (97 MB, id `1ybrTmXfFFdXi2SVYte8bLmrDm7HB2HE3`) is
visible in the shared Drive folder. Every route to actually pull the bytes is closed:

| Route | Result |
|---|---|
| `curl` → `drive.google.com` | **403 CONNECT** — blocked by this session's egress policy |
| `curl` → `drive.usercontent.google.com` | **403 CONNECT** — blocked |
| `www.googleapis.com` (Drive REST API) | Host reachable, but needs an OAuth token this session has no access to |
| Drive MCP `download_file_content` | Returns base64 into the transcript (~135 MB of text) — would destroy the session before the file ever reached disk |

The proxy README is explicit that a 403 is an organization egress-policy denial and
must be reported, not routed around. So I have stopped here rather than working around it.

**Re-tested 08:02 after the file was re-shared — still 403 on both hosts.** This is the
important part: the refusal happens at the network layer, on the CONNECT handshake,
*before* Drive ever evaluates who the file is shared with. Sharing permissions are not
the problem and changing them cannot fix it. This session is not allowed to open a
connection to `drive.google.com` at all.

**Also note:** the supplied transcript carries no timecodes. It is prose-only, so it can
confirm *what is said and in what order* but not *when*. It is not a substitute for the audio.

Every timecode below is therefore **copied verbatim from the brief**, not verified.
The brief itself states these drift by a few seconds. They must not be rendered against.

What the transcript *can* do — and does, below — is anchor each cut to an exact spoken
phrase. Once the MP4 is on disk, forced alignment against these anchors will place every
boundary to the frame in one pass.

**Everything else is ready:** ffmpeg/ffprobe 6.1.1 installed this session (neither was
present); OpenMontage `video_trimmer`, `silence_cutter`, `transcriber`, `frame_sampler`
and `audio_energy` confirmed present.

### To unblock — any one of these

1. **Attach the MP4 to the chat directly.** The transcript arrived this way and landed
   on disk as a real file, bypassing the proxy entirely. Best option if the size is accepted.
2. **Have the egress policy allow `drive.google.com` and `drive.usercontent.google.com`.**
3. **Put the file on a host this session can already reach.**

---

## Structural findings (from arithmetic, independent of the media)

### 1. The segment map reconciles exactly — with one discrepancy

| Block | Range | Duration |
|---|---|---|
| Head (unused) | 0:00–1:03 | 63s |
| Part 1 | 1:04–3:27 + 5:43–7:20 | 143s + 97s = 240s |
| Part 2 | 3:28–5:43 + 7:20–17:00 | 135s + 580s = 715s |
| Part 3 | 17:01–26:25 | 564s |
| Part 4 | 26:26–29:56 | 206s (to 29:52) |
| **Total** | | **1788s + 4 × 1s inter-part gaps = 1792s = 29:52** ✓ |

The map accounts for the entire source with nothing orphaned. **However, Part 4's
stated out-point of 29:56 is 4 seconds past the stated 29:52 duration.** I have assumed
"run to end of file." Confirm.

### 2. Part 1 cannot reach its 4–5 minute target — hard conflict

Part 1's raw material is **exactly 4:00**. After the two mandatory removals inside it
(2:31–2:36 and 6:27–6:35, 13s) it is **3:47** — already below target before a single
filler trim. Step 4 then mandates removing dead air and false starts, which realistically
lands Part 1 at **~3:10–3:30**.

There is no way to deliver a 4–5 minute Part 1 from these segments. Options:

- **(a) Accept ~3:15 for Part 1.** Recommended — consistent with Part 4's "do not pad."
- **(b) Widen Part 1's second segment** past 7:20 to borrow from Part 2's material.
- **(c) Move the addition-types block (3:28–5:43) into Part 1**, making it a single
  contiguous 1:04–7:20 part and shrinking Part 2.

I recommend **(a)**. Comprehension is intact; the target was an estimate.

### 3. Part 2 will probably need the 2A/2B split

Part 2 is **11:27** after mandatory removals, against a 7–8 minute target — a ~35%
reduction from filler alone, which is aggressive. Realistic landing is **8:00–9:00**,
straddling the 8:30 split threshold. Per the brief I am flagging this **before** acting:
expect to split at the interior→exterior transition (~15:00), but I will not know for
certain until the audio is trimmed.

### 4. Boundary collisions

`5:43` and `7:20` each serve as both an out-point and an in-point (Part 1 ends / Part 2
begins). With 0.5s handles at head and tail, **Parts 1 and 2 will overlap by ~1s of
identical audio**. I will nudge these to the nearest silence and offset them so no
frame appears in two parts.

---

## Mandatory removals — transcript-anchored

`0:09–1:03` is already excluded by Part 1's 1:04 in-point, so it needs no separate cut.

| # | Brief TC | Part | Transcript anchor | Action | Reason |
|---|---|---|---|---|---|
| M1 | 0:09–1:03 | — | "Hi **Hussain**, how are you?" … "almost done with **Berkeley Heights**? With the framing?" … "rough inspections next week" | **Cut** (already outside all parts) | Live project name, inspection status, presenter named, participant named |
| M2 | 2:31–2:36 | 1 | "So this is the **Rockaway** project we're talking about, right? Correct." | **Cut** | Real client project name |
| M3 | 6:27–6:35 | 1 | "Wow and **you guys put together the software**? You guys actually created the software? Yes sir." | **Cut** | Reveals private demo, not tutorial |
| M4 | 7:48–7:52 | 2 | "Like **Jason** remember. Yeah." | **Cut** | Third-party name |
| M5 | 12:00–12:12 | 2 | "So now I'm going to go **in the admin mode**. So now you see the exact price." | **Blur** price fields, keep audio | Per-item pricing on screen. Blur chosen over cut so the four-allowance-levels explanation immediately following survives intact |
| M6 | 13:44–13:56 | 2 | "These are **the rules that's been defined at the back end**. The pricing for everything and **the profit margins**." | **Cut** audio + video | Internal margin logic — blur cannot save this, the audio itself is the disclosure |
| M7 | 18:56–19:20 | 3 | "**You should sell this software** you know like with a subscription… We are doing it. Nice. **We just started on it.**" | **Cut** | Undercuts a shipped product |
| M8 | 27:03–27:30 | 4 | "**You see this price? Wow.**" … "By just looking at it, **I told you that's a high price**." | **Blur** total + **cut** reaction | Blur the figure; cut the "high price" exchange. Retain "includes everything except the permit fee… engineering or asbestos" |

**M5 and M8 use blur; M1–M4, M6, M7 are cuts.** Rationale per the brief's instruction to
prefer blur where a cut would break demo flow.

---

## Additional exposures found in the transcript — NOT in the brief's list

These need your ruling. Two are spoken dollar figures that no amount of screen-blurring
will remove.

| # | Part | Transcript anchor | Concern | Recommendation |
|---|---|---|---|---|
| A1 | 3 | "if you're going to put a new location it's going to add like **around like $8,000**" | Spoken price disclosure. Not on the mandatory list, but it is exact pricing | **Cut the figure**, keep "it adds cost for a new location" if a clean boundary exists |
| A2 | 4 | "you can save say **$80,000**" | Spoken dollar figure inside the smart-recommendations explanation. Step 5 says all Part 4 figures must be blurred — but this one is *audio* | **Cut or mute the figure.** Blurring will not catch it |
| A3 | 1 | "I have a **hard stop at 1215-ish**" | Meeting framing — confirms private call, not tutorial | Already inside M1's range. No action |
| A4 | 3 | "are we replacing all the joists…" / "Where was the existing… we changed the location" | Discussion of a specific real house's plans | Low risk — no name or address. **Flagging, not cutting** |
| A5 | all | Any client name, street address, browser tab, bookmark, desktop icon, email notification, or WA Construct branding | **Cannot be assessed — requires the video.** This is a frame-by-frame visual scan and the transcript is blind to it | **Outstanding.** This is the single largest unverifiable item |

**A5 is the most serious gap.** The brief requires zero reference to any construction
company, and that is a visual determination I have no way to make without the file.

---

## Projected runtimes

| Part | Raw | After mandatory | Projected after Step 4 trims | Target | Verdict |
|---|---|---|---|---|---|
| 1 | 4:00 | 3:47 | **~3:10–3:30** | 4–5 min | ✗ under — see finding 2 |
| 2 | 11:55 | 11:27 | **~8:00–9:00** | 7–8 min | ⚠ likely 2A/2B split |
| 3 | 9:24 | 9:00 | **~6:30–7:15** | 6–7 min | ✓ |
| 4 | 3:30 | ~3:11 | **~2:45–3:05** | 3–3:30 | ✓ (do not pad) |

Projections assume 12–18% removal from dead air, filler and false starts. The transcript
is dense with these ("in there", "on that", "you know", "anyway", "means", plus heavy
sentence restarts), so this range is well supported — but it is an estimate, not a measurement.

---

## Scope change requested mid-brief — needs confirmation

You have asked for an outro card: **Home Estimator logo centered, CTA "Book a demo",
link https://homeestimator.ai/book-demo**.

This reverses the opening constraint of the brief — *"no titles, no lower thirds, no music,
no motion graphics… trim and split, nothing else."* Your later instruction supersedes it and
I will build the outro, but three things are unresolved:

1. ~~Which parts get it?~~ **Answered: every clip.**
2. **The logo asset.** The logo came through as an image in chat, not as a file. I need
   the source PNG/SVG on disk to composite at full resolution.
3. **A URL is not clickable in an MP4.** It can only be rendered as text on screen.
   Confirm that is what you want.

**RESOLVED:** outro goes on **every clip** — all four tutorial parts plus both hands-free
versions (six files total). Still outstanding: the logo as a file on disk, and item 3 above.

---

## Step 9 — Standalone feature clip: Hands-Free Mode (5th deliverable)

**Same blocker applies: ranges below are unverified, copied from your brief.**

### Headline problem — the clip range contains a mandatory removal

Your `-short` range **~6:14–6:53 has removal M3 sitting in the middle of it.**

From the transcript, the block runs in this exact order:

> "Once you're going to click this **this is a hands free mode**. So you're going to talk
> conversationally with that. And it's going to select the things automatically.
> **[M3 — "Wow and you guys put together the software? You guys actually created the
> software? Yes sir. Wow that's amazing."]**
> Now not only the data collection if you're going to say oh show me the analysis…
> It's going to take you to that card. Nice. **It means the learning curve is not there.**"

M3 is non-negotiable — it reveals this is a private demo, not a tutorial. So **neither
version can be a single contiguous cut.** Both are two sub-segments joined across an
internal splice, which lands exactly between "select the things automatically" and
"Now not only the data collection."

That splice sits mid-demonstration, so it needs a clean handle on both sides or the clip
will feel jumped. This is the one boundary in the whole job I would most want to hear
before committing to.

### Proposed ranges

**`-short`** — target ~26–29s

| Seg | Range | Content | Note |
|---|---|---|---|
| A | ~6:14 → ~6:27 | "this is a hands free mode" → "select the things automatically" | Opens on the toggle |
| — | *6:27–6:35* | *M3 removed* | Private-demo reveal |
| B | ~6:35 → ~6:53 | "Now not only the data collection…" → "the learning curve is not there" | Voice jump-to-card + payoff line |

Raw 39s → 31s after M3 → **~26–29s** after cutting "Nice." and the participant's "Wow."

**`-extended`** — target ~46–52s

| Seg | Range | Content | Note |
|---|---|---|---|
| A | ~5:49 → ~6:27 | chat panel / "you can ask any question" / preferences → "select the things automatically" | Sets up the voice feature |
| — | *6:27–6:35* | *M3 removed* | |
| B | ~6:35 → ~6:53 | as above | |

Raw 64s → 56s after M3 → **~46–52s** after removing the presenter's self-interruption
("Then one more thing maybe if you're going to have a chance I'm going to get to you but
excuse me") and the agreement noises, per Step 4.

### Overlap with Part 1

Both versions are carved from **inside Part 1's second segment (5:43–7:20)**. This is a
duplicate-use clip, not a removal — Part 1 keeps this material as well. Confirm that is
intended (I have assumed yes, since you called it "separate from the four tutorial parts").

### Open items on this deliverable

1. **Your CONTENT IT MUST KEEP list appears cut off** — it ends at "The hands-free toggle
   and that you talk to it." If there were more bullets, send them; my segment B assumes
   you also want the voice-navigation payoff ("show me the analysis" → jumps to that card)
   and the "learning curve is not there" closing line.
2. **Filenames** — your Step 6 convention doesn't cover this. Proposing:
   `homeestimator-hands-free-mode-short.mp4` / `-extended.mp4`. Say if you want them
   numbered into the `-05-` series instead.
3. ~~Does the outro card go on these too?~~ **Answered: yes, every clip gets the outro.**

---

## What I need to proceed

1. **The source MP4** — the blocker. Nothing in Steps 1, 3 (visual scan), 6 or 7 can happen without it.
2. **Rulings on A1 and A2** (spoken dollar figures).
3. **Confirmation on Part 1's short runtime** — option (a), (b) or (c) from finding 2.
4. **Part 4 end point** — 29:52 (end of file) rather than 29:56.
5. **The logo as a file on disk** — needed to composite the outro at full resolution.
   The chat image is not usable as a source asset.
6. **Step 9 rulings** — the truncated content list, filenames, and whether the
   hands-free clip carries the outro.

On receipt of the MP4 I will ffprobe it, run local transcription for word-level timings,
align the anchors above, do the frame scan for A5, and return a verified cut list with
every boundary that moved more than 3 seconds reported — before rendering anything.
