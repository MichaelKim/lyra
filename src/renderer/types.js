// @flow strict

import type { Store as ReduxStore } from 'redux';

export type SongID = string;
export type PlaylistID = string;

export type Song = {|
  +id: SongID, // hash of filepath
  +name: string,
  +dir: string,
  +playlists: PlaylistID[],
  +date: number
|};

export type Playlist = {|
  +id: PlaylistID, // timestamp
  +name: string,
  +songs: SongID[]
|};

// Redux types
export type Store = ReduxStore<StoreState, Action, Dispatch>;

export type StoreState = {|
  +loaded: boolean,
  +currSong?: Song,
  +currScreen?: ?string,
  +songs: {| [id: SongID]: Song |},
  +playlists: {| [id: PlaylistID]: Playlist |}
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
  | {|
      +type: 'CLEAR_DATA'
    |};
