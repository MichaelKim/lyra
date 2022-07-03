import { Middleware } from '@reduxjs/toolkit';

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

export type AppMiddleware = Middleware<Record<string, never>, StoreState>;
