TODO:

- Search history
  - Show youtube search history on blank yt search screen
- Invalid state
  - Recover from invalid state
- Fix playback bar on mobile

Refactor:

- Unify lyra and lyra-native
  - Use css-in-js similar to react native's stylesheets (?)
    - move variables.scss to constants.js
  - standardize file names
    - rangeinput -> slider
    - songItem -> song-item
  - standardize common utils
    - useToggle hook
- Screen display
  - currently, it's hacked together with playlists
  - playlists / all songs should be seperately handled from other screens (e.g. settings, youtube)
  - loading all songs is laggy due to reloading all songs again
    - bring `getSongList` into component, and only update if props change
  - new screen management:
    - currScreen: 'MAIN' | 'PLAYLIST' | 'SETTINGS' | 'YOUTUBE'
    - currSubScreen: PlaylistID | 'SEARCH' | 'PLAYING'
  - make it like lyra-mobile?
- what to do with "playing" sidebar

Minor fixes:

- Deleting playlist
  - Show confirmation modal?
- Inconsistent action to open context menu
  - Youtube playing: click options icon
  - Library: right click
- seeking
  - use HTML5 Audio fastSeek()
- right align on all songs is not all aligned if no scroll bar
  - the date added header is moved left slightly to line up with items if there's a scroll bar
  - with no scroll bar, the header doesn't line up with the song items
  - same with playlists in sidebar

Bugs:

- Sorting by name should ignore punctuation (like brackets)
- If the song skips before related songs are loaded, it won't autoplay the next song
- Linux:
  - If something else takes control of the media buttons and releases them, the media buttons won't work anymore

Browser:

- mediasession
  - use navigator.mediaSession.setPositionState (coming Chrome v81)
  - enable media session action handler for 'onseek' (buggy on Chrome mobile)

Long term features:

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
- Hover over seek bar
  - Show time over cursor
