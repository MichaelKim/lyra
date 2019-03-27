// @flow strict

export type Action =
  | {|
      +type: 'SELECT_SONG',
      +name: string
    |}
  | {|
      +type: 'SELECT_PLAYLIST',
      +name: ?string
    |};

export type StoreState = {|
  +current?: string,
  +directory: string,
  +playlist?: ?string
|};
