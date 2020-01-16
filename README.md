# Lyra Music Player

Lyra is a cross-platform music player app that can play songs on your computer and on YouTube.

Check out the [lightweight version](https://github.com/LenKagamine/lyra-neutrino) built with [Neutrino](https://github.com/LenKagamine/neutrino)!

## Features

- Songs
  - Add songs on your computer and play them
  - Remove songs
- Playback
  - Volume control
  - Shuffle
  - Skip forward / back 10 seconds
  - Skip to previous / next song
  - Media button shortcuts (Play, Pause, Skip)
- Queue
  - Add to queue
  - Generates queue
- Song metadata
  - Parses title and artist metadata
  - Edit metadata within the player
- Playlists
  - Create and delete playlists
  - Add and remove songs to playlists
  - Play songs in a playlist
- YouTube
  - Search for YouTube videos
  - YouTube video playback (audio only)
  - Autoplay
  - Shows related videos
  - Add video to library
  - Download YouTube video as audio

Keyboard Shortcuts:

- K: Toggle play / pause
- J: Skip back 10 seconds
- L: Skip forward 10 seconds
- H: Skip to previous song / start of song
- (Semicolon): Skip to next song

## Screenshots

<div align="center">
  <img src="./screenshots/library.png" alt="Library" width="49%">
  <img src="./screenshots/youtube.png" alt="Youtube" width="49%">
</div>

## Development

There are several ways to run Lyra:

### Electron App

```sh
npm run dev  # Run locally in development mode

npm run dist # Create unpacked release

npm run pack # Create packaged executable
```

### Browser Web App

```sh
npm run browser  # Available on localhost:9000

npm run browser-build # Create release

npm run serve # Serve built release on localhost:8080
```

This also requires lyra-server to be running (on localhost:5000).

### Neutrino App

See the build instructions [here](https://github.com/LenKagamine/lyra-neutrino).

Note:

- Media button shortcuts don't work normally in Linux. To get around it, the player uses `dbus` to directly access shortcuts. `dbus` requires several other packages to install:
  - `npm i -g node-gyp`
  - `sudo apt-get install libdbus-1-dev libglib2.0-dev`
  - Upon installing `dbus`, node will build the package for use. However, there may be differences in Node and Electron `NODE_MODULE_VERSION`s.
    - See more here: https://electronjs.org/docs/tutorial/using-native-node-modules
- On macOS Mojave (and higher), access to media keys requires accessibility permissions. In this case, Lyra will display a dialog requesting permissions.
- On Linux, running the AppImage for the first time will install the desktop file in `~/.local/share/applications/` for desktop integration. However, if the path to the AppImage has a space in it, the desktop file will have an incorrect value for `TryExec`, making it unable to run.
  - `TryExec` doesn't support quotes, so spaces in the path must be escaped. However, they are escaped with `\\s` rather than `\s`.
    - See https://github.com/AppImage/AppImageKit/issues/948 and https://github.com/electron-userland/electron-builder/issues/3547
  - My fix is to set the AppImage executable name to something without spaces. As long as the directories in the path don't have spaces, the integration should work normally.
