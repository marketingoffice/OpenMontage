# 271 Springfield Ave — 45s Beat-Synced Reel

Production handoff for the WA Construct luxury walkthrough reel. Everything here is
resume-state: a fresh session can pick up from these files without redoing analysis.

## Status

| Item | State |
|---|---|
| Pipeline | `cinematic` — project id `wa-construct-springfield-reel` |
| Research stage | complete (`research_brief.json`) |
| Proposal stage | `awaiting_human` (`proposal_packet.json`) |
| Source footage | **BLOCKED** — not retrievable in the session it was planned in |
| Music | supplied by user, analyzed, window locked |
| Logo | reconstruction only (`brand/`) — official file still wanted |

## The blocker

The source is a 242 MB mp4 on Google Drive
(`1REmUql7zOeVY2jLlfZ4h3FqmuZ4ij-rC`). The session's egress policy denied
`drive.usercontent.google.com` and `drive.google.com`, and the Drive connector returns
file bytes as base64 into the conversation, which 242 MB cannot fit in.

Hosts confirmed **reachable** from a Trusted-network cloud session:
`storage.googleapis.com`, `s3.amazonaws.com`, `github.com`,
`objects.githubusercontent.com`, `www.googleapis.com`.

Hosts confirmed **blocked**: `drive.google.com`, `drive.usercontent.google.com`,
Dropbox, WeTransfer, OneDrive, Box, filebin, transfer.sh, 0x0.st.

Any of these unblocks the render:
1. Set the cloud environment's Network access to **Custom** and allow
   `drive.google.com`, `drive.usercontent.google.com`, `*.googleusercontent.com`
   (keep the default package-manager list checked). The Drive file must also be
   link-shared to "Anyone with the link", or an unauthenticated fetch returns a login page.
2. Upload the mp4 to a GCS or S3 bucket and hand over a public object URL.
3. Attach a smaller proxy export to the session and cut against that.

## Music grid — measured, not assumed

The brief assumed 120 BPM. The track is **114.0 BPM** (spectral-flux comb alignment
scores 0.665 at 114 vs 0.111 at 120). Beat = 0.5263s, bar = 2.1053s. A 120 grid drifts
~5% per bar and would sit visibly off the kick by the second section.

Track structure (absolute seconds): pluck intro to 33.168 · main drop **33.168** ·
one-bar kick dropouts at **47.905** and **64.747** · breakdown 81.589 ·
second drop 119.484 · total 168.46s.

**Music window for the reel: 24.747s → 69.75s.** See `beat_map.json` for the
section-by-section cut plan keyed to reel time.

## Locked decisions

- Aspect: **9:16 vertical**, per-shot reframing (not blind center-crop)
- Runtime: **ffmpeg** (all three runtimes available; ffmpeg recommended — this is a
  footage cut with a mask, a fade and one static lockup, so no scene components are needed)
- Address burn-in ("271 Springfield Ave, Paramus NJ 07652", visible 0:00–0:06 of the
  source) gets masked or cropped — decide once the frame is visible
- No voiceover, no on-screen text beyond the closing lockup

## Brand notes

Palette is black + gold. The gold in `brand/` is sampled from a pasted image
(~`#BFA06A`) and needs confirming against the official brand value. The lockups here are
a **reconstruction**, not the official asset — replace them with the real file before
anything ships. No pricing, no phone/URL, no award claims appear in the piece.

## Starting the next session

The cloud container ships without ffmpeg, ffprobe, or the project's Python
dependencies, so every video tool in the registry reports UNAVAILABLE on a cold start.
Run `scripts/cloud-setup.sh` first, or paste it into the environment's **Setup script**
field so it runs before Claude starts. It measurably changes what the registry reports:

| Capability | Cold start | After setup |
|---|---|---|
| `video_post` | 7 of 9 | 9 of 9 |
| `analysis` | 5 of 13 | 7 of 13 |

Then: read this README, pull the source from Drive, and resume at the `assets` stage.
The proposal checkpoint is `awaiting_human` — the plan in `proposal_packet.json` was
approved in conversation (9:16 vertical, ffmpeg runtime, 45s), so record that approval
before advancing.
