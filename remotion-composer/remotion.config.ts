import { Config } from '@remotion/cli/config';
import { existsSync } from 'node:fs';

/**
 * Remotion normally downloads its own Chrome Headless Shell from remotion.media
 * on first render. On hosts whose network policy does not allowlist that domain
 * (Claude Code web sandboxes, locked-down CI), that download fails with a 403
 * and every render dies before it bundles anything.
 *
 * Those hosts usually already ship a Chromium — Playwright's, most often, at
 * PLAYWRIGHT_BROWSERS_PATH. If we can find one, hand it to Remotion and switch
 * to chrome-for-testing mode (a full Chrome binary, not the headless shell).
 *
 * Set REMOTION_BROWSER_EXECUTABLE to override the search. If nothing is found we
 * stay silent and let Remotion do its normal download, so machines with working
 * egress behave exactly as before.
 */
const candidates = [
  process.env.REMOTION_BROWSER_EXECUTABLE,
  process.env.PLAYWRIGHT_BROWSERS_PATH
    ? `${process.env.PLAYWRIGHT_BROWSERS_PATH}/chromium-1194/chrome-linux/chrome`
    : undefined,
  '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/google-chrome',
].filter((p): p is string => Boolean(p));

const browser = candidates.find((p) => existsSync(p));

if (browser) {
  Config.setBrowserExecutable(browser);
  Config.setChromeMode('chrome-for-testing');
}

// Sandboxes commonly lack the kernel namespaces Chrome's sandbox needs.
Config.setChromiumOpenGlRenderer('swangle');
