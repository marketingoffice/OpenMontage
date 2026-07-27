import { Config } from "@remotion/cli/config";

Config.setBrowserExecutable("/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell");
// This environment's network egress proxy MITMs TLS with its own CA (confirmed
// reachable and allowed via curl --cacert /root/.ccr/ca-bundle.crt); headless
// Chrome just doesn't have that CA in its trust store. Ignoring cert errors
// here only affects this render browser, not any other TLS verification.
Config.setChromiumIgnoreCertificateErrors(true);
