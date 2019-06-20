// @flow strict

import { save, clear } from './storage';
import { downloadVideo } from '../yt-util';

import type { Middleware } from 'redux';
import type { StoreState, Action, Dispatch } from '../types';

export const logger: Middleware<
  StoreState,
  Action,
  Dispatch
> = store => next => action => {
  console.log(action);
  return next(action);
};

export const saveToStorage: Middleware<
  StoreState,
  Action,
  Dispatch
> = store => next => action => {
  const result = next(action);
  const newState = store.getState();

  switch (action.type) {
    case 'ADD_SONGS':
    case 'SELECT_SONG':
    case 'CREATE_PLAYLIST':
    case 'SELECT_PLAYLIST':
    case 'DELETE_PLAYLIST':
    case 'CHANGE_VOLUME':
    case 'SKIP_PREVIOUS':
    case 'SKIP_NEXT':
    case 'UPDATE_TAGS':
    case 'SET_SORT':
    case 'SET_NEXT_SONG':
      save(newState);
      break;

    case 'DOWNLOAD_ADD':
    case 'DOWNLOAD_FINISH': {
      // There's already a song being downloaded
      if (action.type === 'DOWNLOAD_ADD' && newState.dlQueue.length > 1) {
        break;
      }

      // There are no more songs to download
      if (action.type === 'DOWNLOAD_FINISH' && newState.dlQueue.length === 0) {
        break;
      }

      const id = newState.dlQueue[0];
      downloadVideo(id)
        .on('progress', progress =>
          store.dispatch({ type: 'DOWNLOAD_PROGRESS', progress })
        )
        .on('end', song => {
          store.dispatch({ type: 'DOWNLOAD_FINISH', song });
        });
      break;
    }

    case 'CLEAR_DATA':
      clear();
      break;
  }

  return result;
};
