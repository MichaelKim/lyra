// @flow strict

import type { Middleware as _Middleware } from 'redux';

export type SongID = string;
export type PlaylistID = string;

type SongShared = {|
  +id: SongID, // hash of filepath or url
  +title: string, // metadata title
  +artist: string,
  +duration: number,
  +playlists: PlaylistID[],
  +date: number
|};

export type LocalSong = {|
  ...SongShared,
  +source: 'LOCAL',
  +filepath: string
|};

export type VideoSong = {|
  ...SongShared,
  +source: 'YOUTUBE',
  +url: SongID,
  +views: number,
  +thumbnail: Thumbnail
|};

export type Song = LocalSong | VideoSong;

type Thumbnail = {|
  +width: number,
  +height: number,
  +url: string
|};

export type Playlist = {|
  +id: PlaylistID, // timestamp
  +name: string,
  +songs: SongID[]
|};

export type Metadata = {|
  +title: string,
  +artist: string,
  +duration: number
|};

export type SortColumn = 'TITLE' | 'ARTIST' | 'DURATION' | 'DATE';

export type SortType = {|
  +column: SortColumn,
  +direction: boolean
|};

// Redux types
export type StoreState = {|
  +loaded: boolean,
  +currScreen?: ?string,
  +songs: {|
    +[id: SongID]: Song
  |},
  +playlists: {|
    +[id: PlaylistID]: Playlist
  |},
  +volume: {|
    +amount: number,
    +muted: boolean
  |},
  +sort: SortType,
  +shuffle: boolean,
  +queue: {|
    +prev: SongID[],
    +curr: ?SongID,
    +next: SongID[],
    +cache: {|
      +[id: SongID]: Song
    |}
  |},
  +dlQueue: SongID[], // Queue of downloading videos
  +dlProgress: number
|};

export type Dispatch = (action: Action) => void;

export type Middleware = _Middleware<StoreState, Action, Dispatch>;

export type Action =
  | {| +type: 'LOAD_STORAGE', +state: StoreState |}
  | {| +type: 'SELECT_SONG', +song: Song |}
  | {| +type: 'SELECT_PLAYLIST', +id: ?string |}
  | {| +type: 'ADD_SONGS', +songs: Song[] |}
  | {| +type: 'REMOVE_SONG', +id: SongID |}
  | {| +type: 'CREATE_PLAYLIST', +playlist: Playlist |}
  | {| +type: 'DELETE_PLAYLIST', +id: PlaylistID |}
  | {| +type: 'SET_PLAYLISTS', +sid: SongID, +pids: PlaylistID[] |}
  | {| +type: 'CHANGE_VOLUME', +volume: number |}
  | {| +type: 'MUTE', +muted: boolean |}
  | {| +type: 'SKIP_PREVIOUS' |}
  | {| +type: 'SKIP_NEXT' |}
  | {| +type: 'UPDATE_TAGS', +id: SongID, +title: string, +artist: string |}
  | {| +type: 'SET_SORT', +column: SortColumn, +direction: boolean |}
  | {| +type: 'SET_SHUFFLE', +shuffle: boolean |}
  | {| +type: 'QUEUE_SONG', +song: Song |}
  | {| +type: 'DOWNLOAD_ADD', +id: SongID |}
  | {| +type: 'DOWNLOAD_PROGRESS', +progress: number |}
  | {| +type: 'DOWNLOAD_FINISH', +song: ?Song |}
  | {| +type: 'CLEAR_DATA' |};
