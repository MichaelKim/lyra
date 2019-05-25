# Music Player

TODO:

- Add search bar on top of song list
- Highlight row of current song
- Stylize scroll bar (like mercurywm)

Minor fixes:

- Adjust icon sizing / padding
  - Sort up/down
    - Position up and down
    - Last column's sort arrows should be on the left
  - Skip, replay/forward
- Scroll bar
  - Screen's scroll bar should only scroll song rows, not the title, search bar, or header row of table
  - Sidebar scroll bar should only scroll playlists?

Long term features:

- Playlists
  - Add song to playlist
  - Remove song to playlist
- Music metadata
  - Edit metadata on song add
- Drag and drop
  - Add songs to all songs
  - Add songs to playlists
  - Add songs into playlists
- Online
  - Make account
  - Show songs saved online
  - Stream songs
  - Download songs
  - Upload songs
- Youtube
  - Stream similar to autoplay
    - No video, only thumbnail
  - Save song to library
  - Skip to next / previous
  - Show several related songs

Ideas:

- Song row interaction
  - Single click does nothing
  - Double click to play
  - Play button on left
    - Single click to play
  - Right click to open menu
    - Play, Edit
      - Edit is same
- Download from Youtube
  - Server download, since it requires converting to mp3

Note:

- Media button shortcuts don't work normally in Linux. To get around it, the player uses `dbus` to directly access shortcuts. `dbus` requires several other packages to install:
  - `npm i -g node-gyp`
  - `sudo apt-get install libdbus-1-dev libglib2.0-dev`
  - Upon installing `dbus`, node will build the package for use. However, there may be differences in Node and Electron `NODE_MODULE_VERSION`s.
    - See more here: https://electronjs.org/docs/tutorial/using-native-node-modules
