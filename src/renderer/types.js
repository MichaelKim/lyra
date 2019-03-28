// @flow strict

import type { Store as ReduxStore } from 'redux';

export type Song = {|
  +name: string,
  +dir: string
|};

export type Store = ReduxStore<StoreState, Action, Dispatch>;

export type StoreState = {|
  +loaded: boolean,
  +current?: Song,
  +playlist?: ?string,
  +songs: Song[]
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
  | {| +type: 'ADD_SONGS', +songs: Song[] |};
