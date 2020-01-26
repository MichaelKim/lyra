## TODO

All:

- downloading (on electron and native mobile, possibly neutrino)
  - when a song is downloaded, it acts just like a normal song, but with a downloaded icon next to it
  - when selected to play, it plays the local file instead of fetching the url

Mobile Web:

- Switch to bottom navigation
  - Same as mobile native, but bottom sheet is tap based
- when phone is closed, queue / related songs requests aren't performed

Lyra:

- change platform-specific file structure
  - move to folder (e.g. storage/)
  - index.js: get environment variable and conditionally export
  - index.electron.js, index.browser.js, index.neutrino.js: platform specific
    - neutrino and browser can share files

Mobile Native:

- Stylize song item
- downloading?
- playlists
- set app icon
- media controls

## Possible Features

All:

- Recover from invalid state
- State updates across versions (like Mercury)

Server:

- Cache video data

Lyra:

- Deleting playlist
  - Show confirmation (modal?)
- Inconsistent action to open context menu
  - Youtube playing: click options icon
  - Library: right click
- seeking
  - use HTML5 Audio fastSeek()
- right align on all songs is not all aligned if no scroll bar
  - the date added header is moved left slightly to line up with items if there's a scroll bar
  - with no scroll bar, the header doesn't line up with the song items
  - same with playlists in sidebar
- Linux:
  - If something else takes control of the media buttons and releases them, the media buttons won't work anymore
- Unify lyra and lyra-native
  - Use css-in-js similar to react native's stylesheets (?)
    - move variables.scss to constants.js
  - move to css modules
- mediasession
  - use navigator.mediaSession.setPositionState (coming Chrome v81)
  - enable media session action handler for 'onseek' (buggy on Chrome mobile)

## Ideas

- Music metadata
  - Edit metadata on song add
- Drag and drop
  - Add songs to all songs
  - Add songs to playlists
  - Add songs into playlists
- Youtube
  - Pagination
  - Open in browser
- Online
  - Make account
  - Show songs saved online
  - Stream songs
  - Download songs
    - When listening to a Youtube song, download it in the background as a cache
    - Future playbacks and actual downloads will fetch from server's cache instead
  - Upload songs
- Rooms!
  - Several users listening to the same stream
- Captions
- loading circle on play / pause button when loading song
- liked / favourite songs
  - add button on song / yt items
  - add special playlist for liked / fav songs
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
- Hover over seek bar
  - Show time over cursor
