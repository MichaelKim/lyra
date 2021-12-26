import { Middleware as _Middleware, Dispatch as _Dispatch } from 'redux';

export type SongID = string;
export type PlaylistID = string;

type SongShared = {
  id: SongID; // hash of filepath or url
  title: string; // metadata title
  artist: string;
  duration: number;
  playlists: PlaylistID[];
  date: number;
};

export type LocalSong = SongShared & {
  source: 'LOCAL';
  filepath: string;
};

export type VideoSong = SongShared & {
  source: 'YOUTUBE';
  url: SongID;
  views: string; // Readable view count
  thumbnail: Thumbnail;
};

export type Song = LocalSong | VideoSong;

type Thumbnail = {
  width: number;
  height: number;
  url: string;
};

export type Playlist = {
  id: PlaylistID; // timestamp
  name: string;
  songs: SongID[];
};

export type Metadata = {
  title: string;
  artist: string;
  duration: number;
};

export enum SortColumn {
  TITLE = 'TITLE',
  ARTIST = 'ARTIST',
  DURATION = 'DURATION',
  DATE = 'DATE'
}

export type SortType = {
  column: SortColumn;
  direction: boolean;
};

// Redux types
export type QueueType = {
  prev: SongID[];
  curr: SongID | null;
  next: SongID[];
  cache: Record<
    SongID,
    {
      song: Song;
      count: number;
    }
  >;
};

export type StoreState = {
  loaded: boolean;
  currScreen: string | null;
  songs: Record<SongID, Song>;
  playlists: Record<PlaylistID, Playlist>;
  volume: {
    amount: number;
    muted: boolean;
  };
  sort: SortType;
  shuffle: boolean;
  queue: QueueType;
  history: string[]; // Search history
  dlQueue: SongID[]; // Queue of downloading videos
  dlProgress: number;
};

export type Dispatch = _Dispatch<Action>;

export type Middleware = _Middleware<
  Record<string, never>,
  StoreState,
  Dispatch
>;

export type Action =
  | { type: 'LOAD_STORAGE'; state: StoreState }
  | { type: 'SELECT_SONG'; song: Song }
  | { type: 'SELECT_PLAYLIST'; id: string | null }
  | { type: 'ADD_SONGS'; songs: Song[] }
  | { type: 'REMOVE_SONG'; id: SongID }
  | { type: 'CREATE_PLAYLIST'; playlist: Playlist }
  | { type: 'DELETE_PLAYLIST'; id: PlaylistID }
  | { type: 'SET_PLAYLISTS'; sid: SongID; pids: PlaylistID[] }
  | { type: 'CHANGE_VOLUME'; volume: number }
  | { type: 'MUTE'; muted: boolean }
  | { type: 'SKIP_PREVIOUS' }
  | { type: 'SKIP_NEXT' }
  | { type: 'UPDATE_TAGS'; id: SongID; title: string; artist: string }
  | { type: 'SET_SORT'; column: SortColumn; direction: boolean }
  | { type: 'SET_SHUFFLE'; shuffle: boolean }
  | { type: 'QUEUE_SONG'; song: Song }
  | { type: 'ADD_TO_HISTORY'; search: string }
  | { type: 'REMOVE_FROM_HISTORY'; search: string }
  | { type: 'DOWNLOAD_ADD'; id: SongID }
  | { type: 'DOWNLOAD_PROGRESS'; progress: number }
  | { type: 'DOWNLOAD_FINISH'; song: Song | null }
  | { type: 'CLEAR_DATA' };
