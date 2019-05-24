// @flow strict

import type { Store as ReduxStore } from 'redux';

export type SongID = string;
export type PlaylistID = string;

export type Song = {|
  +id: SongID, // hash of filepath or url
  +title: string, // metadata title
  +artist: string,
  +duration: number,
  +name: string, // filename
  +dir: string,
  +playlists: PlaylistID[],
  +date: number
|};

export type Playlist = {|
  +id: PlaylistID, // timestamp
  +name: string,
  +songs: SongID[]
|};

export type Tags = {|
  +title: string,
  +artist: string
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
export type Store = ReduxStore<StoreState, Action, Dispatch>;

export type StoreState = {|
  +loaded: boolean,
  +currSong?: Song,
  +currScreen?: ?string,
  +songs: {| [id: SongID]: Song |},
  +playlists: {| [id: PlaylistID]: Playlist |},
  +volume: number,
  +sort: SortType,
  +shuffle: boolean
|};

export type Dispatch = (action: Action) => void;

export type Action =
  | {|
      +type: 'LOAD_STORAGE',
      +state: StoreState
    |}
  | {|
      +type: 'SELECT_SONG',
      +song: Song
    |}
  | {|
      +type: 'SELECT_PLAYLIST',
      +name: ?string
    |}
  | {| +type: 'ADD_SONGS', +songs: Song[] |}
  | {| +type: 'CREATE_PLAYLIST', +playlist: Playlist |}
  | {| +type: 'DELETE_PLAYLIST', +id: PlaylistID |}
  | {| +type: 'CHANGE_VOLUME', +volume: number |}
  | {| +type: 'SKIP_PREVIOUS' |}
  | {| +type: 'SKIP_NEXT' |}
  | {| +type: 'UPDATE_TAGS', +id: SongID, +title: string, +artist: string |}
  | {| +type: 'SET_SORT', +column: SortColumn, +direction: boolean |}
  | {| +type: 'SET_SHUFFLE', +shuffle: boolean |}
  | {|
      +type: 'CLEAR_DATA'
    |};
