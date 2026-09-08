/**
 * Lato is installed as a system font on the render host (see
 * scripts/install-lato.sh), so the composition just names it — no webfont, no
 * delayRender, no I/O in the render path.
 *
 * Three earlier approaches failed on this host and are recorded so nobody
 * repeats them:
 *   1. A fonts.googleapis.com <link>. The host reaches Google through a
 *      TLS-inspecting proxy that headless Chromium does not trust; the request
 *      fails silently and the whole piece re-typesets in a fallback face.
 *   2. new FontFace(staticFile(...)).load() behind delayRender(). The promise
 *      does not settle inside the renderer, so delayRender times out.
 *   3. The same, with a setTimeout() escape hatch. Remotion freezes timers
 *      during rendering — they advance with the video timeline, not wall clock —
 *      so the fallback never fires and the render still dies, but later
 *      (frame 167, on a newly spawned tab) and more confusingly.
 */
export const SANS = "Lato, 'Helvetica Neue', Arial, sans-serif";

/** Retained so callers keep a single import site; nothing to do at runtime. */
export const loadFonts = () => {
  /* Lato is resolved by fontconfig — see the note above. */
};
