// Verified against node_modules/@remotion/cli/dist/config/index.d.ts (4.0.523):
// setBrowserExecutable(:124), setChromiumOpenGlRenderer(:160), setConcurrency(:175).
import { Config } from "@remotion/cli/config";

// The sandbox cannot download a browser; use the Playwright Chromium already on disk.
Config.setBrowserExecutable("/opt/pw-browsers/chromium-1194/chrome-linux/chrome");
Config.setChromiumOpenGlRenderer("swangle");
// The Playwright Chromium 141 build has no old headless mode; "chrome-for-testing" makes Remotion
// launch it with --headless=new (renderer/dist/open-browser.js: chromeMode === 'chrome-for-testing').
Config.setChromeMode("chrome-for-testing");
Config.setConcurrency(2);
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(90);
Config.setDelayRenderTimeoutInMilliseconds(120000);
Config.setOverwriteOutput(true);
