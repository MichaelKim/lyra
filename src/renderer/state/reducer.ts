import produce, { Draft } from 'immer';
import { Action, QueueType, StoreState } from '../types';

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
    column: 'TITLE',
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

function rootReducer(state: Draft<StoreState>, action: Action) {
  switch (action.type) {
    case 'LOAD_STORAGE': {
      Object.assign(state, action.state, { loaded: true });
      return;
    }

    case 'SELECT_SONG': {
      const { id } = action.song;
      const { queue } = state;

      if (queue.curr != null) {
        // Move current song to history
        queue.prev.push(queue.curr);
        cleanQueue(queue);
      }

      queue.curr = id;
      queue.next = [];

      if (state.songs[id] != null) {
        return;
      }

      if (queue.cache[id] != null) {
        // Increment count
        queue.cache[id].count += 1;
        return;
      }

      // Add to cache
      queue.cache[id] = {
        song: action.song,
        count: 1
      };
      return;
    }

    case 'SELECT_PLAYLIST': {
      state.currScreen = action.id;
      return;
    }

    case 'ADD_SONGS': {
      for (const newSong of action.songs) {
        state.songs[newSong.id] = newSong;

        // Remove song from cache
        delete state.queue.cache[newSong.id];
      }
      return;
    }

    case 'REMOVE_SONG': {
      const { queue, songs } = state;
      if (songs[action.id] == null) {
        // Missing song
        return;
      }

      // Remove from songs
      delete state.songs[action.id];

      // Remove from cache
      delete queue.cache[action.id];

      // Remove from queue
      queue.prev = queue.prev.filter(p => p !== action.id);
      if (queue.curr == action.id) {
        queue.curr = null;
      }
      queue.next = queue.next.filter(p => p !== action.id);

      return;
    }

    case 'CREATE_PLAYLIST': {
      state.playlists[action.playlist.id] = action.playlist;
      return;
    }

    case 'DELETE_PLAYLIST': {
      const playlist = state.playlists[action.id];
      if (playlist == null) {
        return state;
      }

      // Remove songs from playlist
      for (const songID of playlist.songs) {
        const song = state.songs[songID];
        if (song) {
          song.playlists = song.playlists.filter(p => p !== action.id);
        }
      }

      // Remove from playlists
      delete state.playlists[action.id];

      if (state.currScreen === action.id) {
        state.currScreen = null;
      }
      return;
    }

    case 'SET_PLAYLISTS': {
      const { sid, pids } = action;
      const song = state.songs[sid];

      // Invalid song ID
      if (song == null) {
        return;
      }

      for (const pid of pids) {
        // Only add valid playlists
        if (state.playlists[pid]) {
          song.playlists.push(pid);
        }
      }
      return;
    }

    case 'CHANGE_VOLUME': {
      const clamp = Math.max(Math.min(action.volume, 1), 0);
      state.volume.amount = clamp;
      return;
    }

    case 'MUTE': {
      state.volume.muted = action.muted;
      return;
    }

    case 'SKIP_PREVIOUS': {
      const { queue } = state;

      const newCurr = queue.prev.pop();

      if (newCurr == null) {
        // No previous songs
        return;
      }

      if (queue.curr) {
        queue.next.unshift(queue.curr);
      }

      queue.curr = newCurr;
      return;
    }

    case 'SKIP_NEXT': {
      const { queue } = state;

      const newCurr = queue.next.shift();
      if (newCurr == null) {
        // Middleware: queues song if next is empty
        return state;
      }

      if (queue.curr) {
        queue.prev.push(queue.curr);
        cleanQueue(queue);
      }

      queue.curr = newCurr;
      return;
    }

    case 'UPDATE_TAGS': {
      const song = Object.values(state.songs).find(
        song => song.id === action.id
      );

      if (song == null) {
        return;
      }

      song.title = action.title;
      song.artist = action.artist;
      return;
    }

    case 'SET_SORT': {
      state.sort.column = action.column;
      state.sort.direction = action.direction;
      return;
    }

    case 'SET_SHUFFLE': {
      state.shuffle = action.shuffle;
      return;
    }

    case 'QUEUE_SONG': {
      const { song } = action;

      state.queue.next.push(song.id);

      // Song in library
      if (state.songs[song.id] != null) {
        return;
      }

      // Song in cache
      if (state.queue.cache[song.id] != null) {
        state.queue.cache[song.id].count += 1;
        return;
      }

      // Add to cache
      state.queue.cache[song.id] = {
        song,
        count: 1
      };
      return;
    }

    case 'ADD_TO_HISTORY': {
      state.history.push(action.search);
      state.history = [...new Set(state.history)].slice(0, MAX_QUEUE_SIZE);
      return;
    }

    case 'REMOVE_FROM_HISTORY': {
      state.history = state.history.filter(h => h !== action.search);
      return;
    }

    case 'DOWNLOAD_ADD': {
      state.dlQueue.push(action.id);
      return;
    }

    case 'DOWNLOAD_PROGRESS': {
      state.dlProgress = action.progress;
      return;
    }

    case 'DOWNLOAD_FINISH': {
      state.dlQueue.shift();
      state.dlProgress = 0;

      if (action.song != null) {
        state.songs[action.song.id] = action.song;
      }
      return;
    }

    case 'CLEAR_DATA': {
      Object.assign(state, initialState, {
        loaded: true
      });
      return;
    }
  }
}

export default function wrapper(
  state: StoreState = initialState,
  action: Action
): StoreState {
  return produce(state, draftState => {
    rootReducer(draftState, action);
  });
}
