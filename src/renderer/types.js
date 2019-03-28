// @flow strict

export type StoreState = {|
  +current?: Song,
  +playlist?: ?string,
  +songs: Song[]
|};

export type Song = {|
  +name: string,
  +dir: string
|};

export type Dispatch = (action: Action) => void;

export type Action =
  | {|
      +type: 'SELECT_SONG',
      +song: Song
    |}
  | {|
      +type: 'SELECT_PLAYLIST',
      +name: ?string
    |}
  | {| +type: 'ADD_SONGS', +songs: Song[] |};
