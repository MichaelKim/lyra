import { createAction } from '@reduxjs/toolkit';
import {
  Playlist,
  PlaylistID,
  Song,
  SongID,
  SortColumn,
  StoreState
} from './types';

export const loadStorage = createAction<StoreState>('LOAD_STORAGE');
export const selectSong = createAction<Song>('SELECT_SONG');
export const selectPlaylist = createAction<string | null>('SELECT_PLAYLIST');
export const addSongs = createAction<Song[]>('ADD_SONGS');
export const removeSong = createAction<SongID>('REMOVE_SONG');
export const createPlaylist = createAction<Playlist>('CREATE_PLAYLIST');
export const deletePlaylist = createAction<PlaylistID>('DELETE_PLAYLIST');
export const setPlaylists = createAction<{ sid: SongID; pids: PlaylistID[] }>(
  'SET_PLAYLISTS'
);
export const changeVolume = createAction<number>('CHANGE_VOLUME');
export const toggleMute = createAction<boolean>('TOGGLE_MUTE');
export const skipPrevious = createAction('SKIP_PREVIOUS');
export const skipNext = createAction('SKIP_NEXT');
export const updateTags = createAction<{
  id: SongID;
  title: string;
  artist: string;
}>('UPDATE_TAGS');
export const setSort = createAction<{ column: SortColumn; direction: boolean }>(
  'SET_SORT'
);
export const setShuffle = createAction<boolean>('SET_SHUFFLE');
export const queueSong = createAction<Song>('QUEUE_SONG');
export const addToHistory = createAction<string>('ADD_TO_HISTORY');
export const removeFromHistory = createAction<string>('REMOVE_FROM_HISTORY');
export const downloadAdd = createAction<SongID>('DOWNLOAD_ADD');
export const downloadProgress = createAction<number>('DOWNLOAD_PROGRESS');
export const downloadFinish = createAction<Song | null>('DOWNLOAD_FINISH');
export const clearData = createAction('CLEAR_DATA');
