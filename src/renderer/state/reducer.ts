import { createReducer } from '@reduxjs/toolkit';
import * as actions from '../actions';
import { QueueType, SortColumn, StoreState } from '../types';

export const initialState: StoreState = {
  loaded: false,
  currScreen: null,
  songs: {},
  playlists: {},
  volume: {
    amount: 1,
    muted: false
  },
  sort: {
    column: SortColumn.TITLE,
    direction: false
  },
  shuffle: false,
  queue: {
    prev: [],
    curr: null,
    next: [],
    cache: {}
  },
  history: [],
  dlQueue: [],
  dlProgress: 0
};

const MAX_QUEUE_SIZE = 50;

// Restricts prev.length to MAX_QUEUE_SIZE
function cleanQueue(queue: QueueType) {
  while (queue.prev.length > MAX_QUEUE_SIZE) {
    // Remove oldest from cache
    const oldest = queue.prev.shift();

    if (oldest) {
      const count = queue.cache[oldest]?.count;

      if (count === 1) {
        // Remove from cache
        delete queue.cache[oldest];
      } else if (count > 1) {
        // Decrease count
        queue.cache[oldest].count -= 1;
      }
    }
  }
}

const rootReducer = createReducer(initialState, builder => {
  builder.addCase(actions.loadStorage, (state, { payload }) => {
    Object.assign(state, payload, { loaded: true });
  });

  builder.addCase(actions.selectSong, (state, { payload: song }) => {
    const { queue } = state;

    if (queue.curr != null) {
      // Move current song to history
      queue.prev.push(queue.curr);
      cleanQueue(queue);
    }

    queue.curr = song.id;
    queue.next = [];

    if (state.songs[song.id] != null) return;

    // Add to cache
    queue.cache[song.id] ??= { song, count: 0 };
    queue.cache[song.id].count += 1;
  });

  builder.addCase(actions.selectPlaylist, (state, { payload: screen }) => {
    state.currScreen = screen;
  });

  builder.addCase(actions.addSongs, (state, { payload: songs }) => {
    for (const newSong of songs) {
      state.songs[newSong.id] = newSong;

      // Remove song from cache
      delete state.queue.cache[newSong.id];
    }
  });

  builder.addCase(actions.removeSong, (state, { payload: id }) => {
    const { queue, songs } = state;

    // Missing song
    if (songs[id] == null) return;

    // Remove from songs
    delete state.songs[id];

    // Remove from cache
    delete queue.cache[id];

    // Remove from queue
    queue.prev = queue.prev.filter(p => p !== id);
    if (queue.curr == id) queue.curr = null;
    queue.next = queue.next.filter(p => p !== id);
  });

  builder.addCase(actions.createPlaylist, (state, { payload: playlist }) => {
    state.playlists[playlist.id] = playlist;
  });

  builder.addCase(actions.deletePlaylist, (state, { payload: id }) => {
    const playlist = state.playlists[id];
    if (playlist == null) return;

    // Remove songs from playlist
    for (const songID of playlist.songs) {
      const song = state.songs[songID];
      if (song) {
        song.playlists = song.playlists.filter(p => p !== id);
      }
    }

    // Remove from playlists
    delete state.playlists[id];

    if (state.currScreen === id) state.currScreen = null;
  });

  builder.addCase(actions.setPlaylists, (state, { payload: { sid, pids } }) => {
    const song = state.songs[sid];

    // Invalid song ID
    if (song == null) return;

    for (const pid of pids) {
      // Only add valid playlists
      if (state.playlists[pid]) {
        song.playlists.push(pid);
      }
    }
  });

  builder.addCase(actions.changeVolume, (state, { payload: volume }) => {
    const clamp = Math.max(Math.min(volume, 1), 0);
    state.volume.amount = clamp;
  });

  builder.addCase(actions.toggleMute, (state, { payload: muted }) => {
    state.volume.muted = muted;
  });

  builder.addCase(actions.skipPrevious, state => {
    const { queue } = state;

    const newCurr = queue.prev.pop();

    // No previous songs
    if (newCurr == null) return;

    if (queue.curr) {
      queue.next.unshift(queue.curr);
    }

    queue.curr = newCurr;
  });

  builder.addCase(actions.skipNext, state => {
    const { queue } = state;

    const newCurr = queue.next.shift();
    // Middleware: queues song if next is empty
    if (newCurr == null) return state;

    if (queue.curr) {
      queue.prev.push(queue.curr);
      cleanQueue(queue);
    }

    queue.curr = newCurr;
  });

  builder.addCase(
    actions.updateTags,
    (state, { payload: { id, title, artist } }) => {
      const song = Object.values(state.songs).find(song => song.id === id);

      if (song == null) return;

      song.title = title;
      song.artist = artist;
    }
  );

  builder.addCase(actions.setSort, (state, { payload: sort }) => {
    state.sort = sort;
  });

  builder.addCase(actions.setShuffle, (state, { payload: shuffle }) => {
    state.shuffle = shuffle;
  });

  builder.addCase(actions.queueSong, (state, { payload: song }) => {
    state.queue.next.push(song.id);

    // Song in library
    if (state.songs[song.id] != null) return;

    // Add to cache
    state.queue.cache[song.id] ??= { song, count: 0 };
    state.queue.cache[song.id].count += 1;
  });

  builder.addCase(actions.addToHistory, (state, { payload: search }) => {
    state.history.push(search);
    state.history = [...new Set(state.history)].slice(0, MAX_QUEUE_SIZE);
  });

  builder.addCase(actions.removeFromHistory, (state, { payload: search }) => {
    state.history = state.history.filter(h => h !== search);
  });

  builder.addCase(actions.downloadAdd, (state, { payload: id }) => {
    state.dlQueue.push(id);
  });

  builder.addCase(actions.downloadProgress, (state, { payload: progress }) => {
    state.dlProgress = progress;
  });

  builder.addCase(actions.downloadFinish, (state, { payload: song }) => {
    state.dlQueue.shift();
    state.dlProgress = 0;

    if (song != null) {
      state.songs[song.id] = song;
    }
  });

  builder.addCase(actions.clearData, state => {
    Object.assign(state, initialState, { loaded: true });
  });
});

export default rootReducer;
