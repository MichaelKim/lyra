// @flow strict

import { dialog, systemPreferences } from 'electron';

// On macOS Mojave (and higher), access to media keys requires
// accessibility permissions. This method opens a dialog
// for macOS if permissions are not provided.

// Taken from https://github.com/salomvary/soundcleod/commit/b9b37e2bfbe9c8f5dab07c4c050c47a6da08cbc5
export default function checkAccessibility() {
  if (process.platform !== 'darwin') {
    return;
  }

  const isTrusted = systemPreferences.isTrustedAccessibilityClient(false);

  if (isTrusted) {
    return;
  }

  // No permission, open dialog and request access
  const result = dialog.showMessageBox({
    type: 'warning',
    message: 'Turn on accessibility',
    detail:
      'To control playback using media keys on your keyboard, select the Lyra checkbox in Security & Privacy > Accessibility.\n\nYou will have to restart Lyra after enabling access.',
    defaultId: 1,
    cancelId: 0,
    buttons: ['Not Now', 'Turn On Accessibility']
  });

  if (result === 1) {
    systemPreferences.isTrustedAccessibilityClient(true);
  }
}
