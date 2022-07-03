import { isAnyOf } from '@reduxjs/toolkit';
import {
  addSongs,
  addToHistory,
  changeVolume,
  clearData,
  createPlaylist,
  deletePlaylist,
  downloadAdd,
  downloadFinish,
  downloadProgress,
  loadStorage,
  queueSong,
  removeFromHistory,
  removeSong,
  selectPlaylist,
  selectSong,
  setPlaylists,
  setShuffle,
  setSort,
  skipNext,
  skipPrevious,
  updateTags
} from '../actions';
import { AppMiddleware } from '../types';
import { getSongList } from '../util';
import { downloadVideo, getRelatedVideos } from '../yt-util';
import { clear, save } from './storage';

export const logger: AppMiddleware = () => next => action => {
  console.log(action);
  return next(action);
};

export const fetchNextSong: AppMiddleware = store => next => action => {
  const result = next(action);
  const newState = store.getState();

  if (
    skipNext.match(action) ||
    selectSong.match(action) ||
    setShuffle.match(action)
  ) {
    // Ignore middleware
    return result;
  }

  const { queue } = newState;
  const { curr } = queue;
  if (curr == null) {
    // Nothing playing
    return result;
  }

  const currSong = newState.songs[curr] ?? queue.cache[curr]?.song;
  if (currSong == null) {
    // Error state
    console.log('invalid queue.curr');
    return result;
  }

  if (queue.next.length > 0) {
    // Songs already in queue
    return result;
  }

  // Enable autoplay for youtube if shuffle is on
  if (currSong.source === 'YOUTUBE') {
    if (newState.shuffle) {
      getRelatedVideos(currSong.id).then(related => {
        store.dispatch(queueSong(related[0]));
      });
    }
    return result;
  }

  // Shuffle from library
  if (newState.shuffle) {
    const songs = getSongList(newState.songs, newState.currScreen).filter(
      song => song.id !== currSong.id
    );
    const nextSong = songs[0 | (Math.random() * songs.length)];

    store.dispatch(queueSong(nextSong));
    return result;
  }

  // Add next song in library
  const songs = getSongList(newState.songs, newState.currScreen, newState.sort);
  const index = songs.findIndex(song => song.id === currSong.id);
  if (index >= 0 && index < songs.length - 1) {
    store.dispatch(queueSong(songs[index + 1]));
  }

  return result;
};

const isSaveAction = isAnyOf(
  loadStorage,
  selectSong,
  selectPlaylist,
  addSongs,
  removeSong,
  createPlaylist,
  deletePlaylist,
  setPlaylists,
  changeVolume,
  skipPrevious,
  skipNext,
  updateTags,
  setSort,
  setShuffle,
  queueSong,
  addToHistory,
  removeFromHistory
);

export const saveToStorage: AppMiddleware = store => next => action => {
  const result = next(action);
  const newState = store.getState();

  if (isSaveAction(action)) {
    save(newState);
  } else if (clearData.match(action)) {
    clear();
  } else if (
    // There's already a song being downloaded
    (downloadAdd.match(action) && newState.dlQueue.length <= 1) ||
    // There are no more songs to download
    (downloadFinish.match(action) && newState.dlQueue.length > 0)
  ) {
    const id = newState.dlQueue[0];
    downloadVideo(id)
      .on('progress', progress => store.dispatch(downloadProgress(progress)))
      .on('end', song => {
        if (song != null) store.dispatch(downloadFinish(song));
      });
  }

  return result;
};
