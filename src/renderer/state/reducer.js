// @flow strict

import u from 'updeep';
import { initialState } from './storage';
import { values } from '../util';

import type { StoreState, Action, SortType, QueueType } from '../types';

export default function rootReducer(
  state: StoreState = initialState,
  action: Action
): StoreState {
  switch (action.type) {
    case 'LOAD_STORAGE':
      return u({ loaded: true }, action.state);

    case 'SELECT_SONG': {
      const { id } = action.song;
      const { queue } = state;

      // Update cache
      const cache = queue.next.reduce((cache, id) => {
        if (cache[id] == null) return cache;
        if (cache[id].count === 1) {
          // $FlowFixMe: ignore mutating
          delete cache[id];
          return cache;
        }
        cache[id].count -= 1;
        return cache;
      }, queue.cache);

      const newQueue: QueueType = {
        prev: queue.curr != null ? [...queue.prev, queue.curr] : queue.prev,
        curr: id,
        next: [],
        cache
      };

      if (state.songs[id] != null) {
        return u(
          {
            queue: newQueue
          },
          state
        );
      }

      if (queue.cache[id] != null) {
        return u(
          {
            queue: u(
              {
                cache: {
                  [id]: {
                    count: state.queue.cache[id].count + 1
                  }
                }
              },
              newQueue
            )
          },
          state
        );
      }

      return u(
        {
          queue: u(
            {
              cache: {
                [id]: {
                  song: action.song,
                  count: 1
                }
              }
            },
            newQueue
          )
        },
        state
      );
    }

    case 'SELECT_PLAYLIST':
      return u(
        {
          currScreen: action.id
        },
        state
      );

    case 'ADD_SONGS': {
      const newSongs: $Shape<typeof state.songs> = action.songs.reduce(
        (acc, song) => {
          acc[song.id] = song;
          return acc;
        },
        {}
      );

      return u(
        {
          songs: newSongs
        },
        state
      );
    }

    case 'REMOVE_SONG': {
      const { queue, songs } = state;
      if (songs[action.id] == null) {
        return state;
      }

      return u(
        {
          songs: {
            [action.id]: null
          },
          queue: {
            prev: queue.prev.filter(p => p !== action.id),
            curr: queue.curr === action.id ? null : action.id,
            next: queue.next.filter(p => p !== action.id)
          }
        },
        state
      );
    }

    case 'CREATE_PLAYLIST':
      return u(
        {
          playlists: {
            [action.playlist.id]: action.playlist
          }
        },
        state
      );

    case 'DELETE_PLAYLIST': {
      const playlist = state.playlists[action.id];
      if (playlist == null) {
        return state;
      }

      const songs = state.songs;

      playlist.songs.forEach(id => {
        const index = songs[id].playlists.indexOf(action.id);
        if (index !== -1) songs[id].playlists.splice(index, 1);
      });

      if (state.currScreen === action.id) {
        return u(
          {
            playlists: {
              [action.id]: null
            },
            songs,
            currScreen: null
          },
          state
        );
      }

      return u(
        {
          playlists: {
            [action.id]: null
          },
          songs
        },
        state
      );
    }

    case 'SET_PLAYLISTS': {
      const { sid, pids } = action;
      const song = state.songs[sid];

      // Invalid song ID
      if (song == null) {
        return state;
      }

      for (let pid of pids) {
        // Invalid playlist ID
        if (state.playlists[pid] == null) {
          return state;
        }
      }

      return u(
        {
          songs: {
            [sid]: {
              playlists: pids
            }
          }
        },
        state
      );
    }

    case 'CHANGE_VOLUME': {
      return u(
        {
          volume: {
            amount: Math.max(Math.min(action.volume, 1), 0)
          }
        },
        state
      );
    }

    case 'MUTE': {
      return u(
        {
          volume: {
            muted: action.muted
          }
        },
        state
      );
    }

    case 'SKIP_PREVIOUS': {
      const { queue } = state;
      const { prev, curr, next } = queue;
      if (curr == null) {
        // Nothing playing right now
        return state;
      }

      if (prev.length === 0) {
        return state;
      }

      return u(
        {
          queue: {
            prev: prev.slice(0, -1),
            curr: prev[prev.length - 1],
            next: [curr, ...next]
          }
        },
        state
      );
    }

    case 'SKIP_NEXT': {
      const { queue } = state;
      const { prev, curr, next } = queue;
      if (curr == null) {
        // Nothing playing right now
        return state;
      }

      // Middleware: queues song if next is empty
      if (next.length === 0) {
        return state;
      }

      return u(
        {
          queue: {
            prev: [...prev, curr],
            curr: next[0],
            next: next.slice(1)
          }
        },
        state
      );
    }

    case 'UPDATE_TAGS': {
      const song = values(state.songs).find(song => song.id === action.id);
      if (song == null) {
        return state;
      }

      return u(
        {
          songs: {
            [song.id]: {
              title: action.title,
              artist: action.artist
            }
          }
        },
        state
      );
    }

    case 'SET_SORT': {
      const sort: SortType = {
        column: action.column,
        direction: action.direction
      };
      return u(
        {
          sort
        },
        state
      );
    }

    case 'SET_SHUFFLE': {
      return u(
        {
          shuffle: action.shuffle
        },
        state
      );
    }

    case 'QUEUE_SONG': {
      const { song } = action;
      const next = [...state.queue.next, song.id];

      // Song in library
      if (state.songs[song.id] != null) {
        return u(
          {
            queue: {
              next
            }
          },
          state
        );
      }

      // Song in cache
      if (state.queue.cache[song.id] != null) {
        return u(
          {
            queue: {
              next,
              cache: {
                [song.id]: {
                  count: state.queue.cache[song.id].count + 1
                }
              }
            }
          },
          state
        );
      }

      // Add to cache
      return u(
        {
          queue: {
            next,
            cache: {
              [song.id]: {
                song,
                count: 1
              }
            }
          }
        },
        state
      );
    }

    case 'DOWNLOAD_ADD': {
      return u(
        {
          dlQueue: [...state.dlQueue, action.id]
        },
        state
      );
    }

    case 'DOWNLOAD_PROGRESS': {
      return u(
        {
          dlProgress: action.progress
        },
        state
      );
    }

    case 'DOWNLOAD_FINISH': {
      if (action.song == null) {
        return u(
          {
            dlQueue: state.dlQueue.slice(1),
            dlProgress: 0
          },
          state
        );
      }

      return u(
        {
          songs: {
            [action.song.id]: action.song
          },
          dlQueue: state.dlQueue.slice(1),
          dlProgress: 0
        },
        state
      );
    }

    case 'CLEAR_DATA':
      return u(
        {
          loaded: true
        },
        initialState
      );

    default:
      return state;
  }
}
