# Development Guide

This guide covers running and testing CUDA Docs Switcher locally as an unpacked
Chrome extension.

## Prerequisites

- Google Chrome or another Chromium-based browser that supports Manifest V3
  extensions.
- Node.js and `npm`.
- `make` for building the local `dist` directory.

Install JavaScript dependencies once:

```sh
npm install
```

## Build the Local Extension

Build the unpacked extension into `dist`:

```sh
make all
```

The build copies these files into `dist`:

- `src/*`
- `static/*`
- `LICENSE`

Re-run `make all` after changing files under `src` or `static`.

## Load It in Chrome

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Click **Load unpacked**.
4. Select the local `dist` directory.
5. Pin CUDA Docs Switcher from the Chrome toolbar if needed.

After rebuilding, return to `chrome://extensions` and click the reload icon on the
CUDA Docs Switcher card.

## Test the Main Flow

1. Open a current CUDA documentation page:

   ```text
   https://docs.nvidia.com/cuda/
   ```

2. Click the CUDA Docs Switcher toolbar icon.
3. Confirm the version picker opens.
4. Select an archived version and confirm the tab navigates to a URL like:

   ```text
   https://docs.nvidia.com/cuda/archive/12.0.0/
   ```

5. Open the picker again and switch back to `Latest`.
6. On an archived documentation subpage, verify that switching versions preserves
   the current documentation path.

## Test Version Updates

The extension stores the versions list in Chrome local storage. On install and
startup, it loads the bundled `versions-v1.json` first, then refreshes from the
remote file on GitHub.

To update the local versions file:

```sh
node ./utils/check_updates.mjs static/versions-v1.json
git diff -- static/versions-v1.json
make all
```

Then reload the unpacked extension from `chrome://extensions`.

You can also click the popup's reload button to trigger a remote versions-list
refresh.

## Debugging

Use these Chrome extension debugging entry points:

- Popup logs: right-click the extension popup and select **Inspect**.
- Background service worker logs: open `chrome://extensions`, find CUDA Docs
  Switcher, then click **service worker**.
- Stored versions data: inspect the service worker, then check
  `chrome.storage.local` from the console.

Useful checks:

```js
chrome.storage.local.get(["versions"]).then(console.log)
chrome.storage.local.clear()
```

After clearing local storage, reload the extension or click the popup reload
button to repopulate the versions list.

## Development Mode

`src/background.js` has a local `RELEASE` flag:

```js
let RELEASE = true;
```

For temporary local debugging, you can set it to `false` to clear local storage
and refresh versions more aggressively. Change it back to `true` before building
or submitting a release package.

## Before Opening a Pull Request

Run a final local check:

```sh
make all
```

Then reload the unpacked extension and verify the popup works on both current and
archived CUDA documentation pages.

