# Release Process

This guide covers releasing CUDA Docs Switcher to the Chrome Web Store.

## Prerequisites

- A working Node.js installation. The GitHub workflow uses Node.js 20.
- `npm`, `make`, and `zip` available locally.
- Access to the Chrome Web Store developer account for CUDA Docs Switcher.

Install dependencies before running update checks:

```sh
npm install
```

## Release Checklist

1. Confirm the working tree only contains intended changes.

   ```sh
   git status --short
   ```

2. Update the CUDA documentation versions list if needed.

   ```sh
   node ./utils/check_updates.mjs static/versions-v1.json
   git diff -- static/versions-v1.json
   ```

   The extension loads `static/versions-v1.json` from the published extension first,
   then refreshes from `https://raw.githubusercontent.com/kmaehashi/cuda-docs-switcher/main/static/versions-v1.json`.
   If only the CUDA versions list changed, merging that change to `main` is usually
   enough for installed extensions to pick it up during their next remote refresh.

3. Bump the extension version in `src/manifest.json` for Chrome Web Store releases.

   ```json
   "version": "0.0.3"
   ```

   Chrome Web Store uploads must use a version greater than the currently published
   version.

4. Build the release package.

   ```sh
   make all
   zip -r cuda-docs-switcher-dist.zip dist/
   ```

   You can also use `make release` when replacing an existing
   `cuda-docs-switcher-dist.zip`. That target removes the previous ZIP, rebuilds
   `dist`, creates a fresh archive, and prints the manifest version.

5. Validate the packaged extension locally.

   - Open `chrome://extensions`.
   - Enable Developer mode.
   - Click **Load unpacked** and select the local `dist` directory.
   - Open a CUDA documentation page such as `https://docs.nvidia.com/cuda/`.
   - Click the extension icon and verify the version picker opens.
   - Switch between `Latest` and at least one archived version.
   - Click the reload button and confirm the picker still renders after the remote
     versions list refreshes.

6. Upload the ZIP to Chrome Web Store.

   - Open the Chrome Web Store Developer Dashboard.
   - Select CUDA Docs Switcher.
   - Upload `cuda-docs-switcher-dist.zip`.
   - Review the store listing and requested permissions.
   - Submit the new package for review.

7. Tag the release after the store submission is accepted.

   ```sh
   git tag v0.0.3
   git push origin v0.0.3
   ```

## Post-Release Verification

After the release is live:

- Install or update CUDA Docs Switcher from the Chrome Web Store.
- Confirm `chrome://extensions` shows the expected version.
- Open the extension on a current CUDA docs page and an archived CUDA docs page.
- Verify the version list includes the expected entries from `static/versions-v1.json`.

## Rollback

The fastest mitigation depends on what changed:

- For a bad CUDA versions list, fix `static/versions-v1.json` on `main`. Installed
  extensions refresh the remote list on startup and every 12 hours.
- For a bad extension package, revert or fix the package change, bump
  `src/manifest.json` to a newer version, rebuild the ZIP, and submit a replacement
  Chrome Web Store release.

## Release Artifacts

The generated release files are intentionally ignored by Git:

- `dist/`
- `cuda-docs-switcher-dist.zip`
