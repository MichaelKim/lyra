// @flow strict

import { ipcMain, BrowserWindow, globalShortcut } from 'electron';

const window = BrowserWindow.fromId(global.windowID);

function sendMessage(event: string) {
  window.webContents.send(event);
}

// Taken from https://github.com/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/commit/85b0eb57447b99d5d4d1cf443e5bba1f86b3912d#diff-8da52d0ccd45fa8db717beb34d249a98
function registerBindings(desktopEnv, session) {
  session.getInterface(
    `org.${desktopEnv}.SettingsDaemon`,
    `/org/${desktopEnv}/SettingsDaemon/MediaKeys`,
    `org.${desktopEnv}.SettingsDaemon.MediaKeys`,
    (err, iface) => {
      if (!err) {
        iface.on('MediaPlayerKeyPressed', (n, keyName) => {
          switch (keyName) {
            case 'Play':
              sendMessage('play-pause');
              return;
            case 'Previous':
              sendMessage('skip-previous');
              return;
            case 'Next':
              sendMessage('skip-next');
              return;
            default:
              return;
          }
        });
        iface.GrabMediaPlayerKeys(
          0,
          `org.${desktopEnv}.SettingsDaemon.MediaKeys`
        );
      }
    }
  );
}

if (process.platform === 'linux') {
  try {
    // $FlowFixMe: dbus is only required for linux
    const DBus = require('dbus');
    const dbus = new DBus();
    const session = dbus.getBus('session');

    registerBindings('gnome', session);
    registerBindings('mate', session);
  } catch (e) {}
} else {
  globalShortcut.register('MediaPlayPause', () => {
    sendMessage('play-pause');
  });

  globalShortcut.register('MediaPreviousTrack', () => {
    sendMessage('skip-previous');
  });

  globalShortcut.register('MediaNextTrack', () => {
    sendMessage('skip-next');
  });
}
