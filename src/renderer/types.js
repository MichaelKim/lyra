// @flow strict

import type { Store as ReduxStore } from 'redux';

export type SongID = string;
export type PlaylistID = string;

export type Song = {|
  +id: SongID,
  +name: string,
  +dir: string,
  +playlists: PlaylistID[]
|};

export type Playlist = {|
  +id: PlaylistID,
  +name: string,
  +songs: SongID[]
|};

export type Store = ReduxStore<StoreState, Action, Dispatch>;

export type StoreState = {|
  +loaded: boolean,
  +currSong?: Song,
  +currScreen?: ?string,
  +songs: Song[],
  +playlists: Playlist[]
|};

export type Dispatch = (action: Action) => void;

export type Action =
  | {|
      +type: 'LOAD_STORAGE',
      +songs: Song[]
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
  | {|
      +type: 'CLEAR_DATA'
    |};
