// @flow strict

export type StoreState = {|
  +current?: Song,
  +directories: string[],
  +playlist?: ?string
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
  | {| +type: 'SET_DIRECTORIES', +dirs: string[] |};
