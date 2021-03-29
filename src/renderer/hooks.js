// @flow strict

import { useMemo, useState, useEffect } from 'react';
import {
  useSelector as _useSelector,
  useDispatch as _useDispatch
} from 'react-redux';

import { registerShortcuts, removeShortcuts } from './util';

import type { Song, StoreState, Dispatch } from './types';

// Type wrappers for built-in hooks
export function useSelector<Selected>(
  selector: StoreState => Selected
): Selected {
  return _useSelector<StoreState, Selected>(selector);
}

export function useDispatch(): Dispatch {
  return _useDispatch<Dispatch>();
}

export function useDispatchMap<T>(mapDispatch: Dispatch => T): T {
  const dispatch = useDispatch();
  return useMemo(() => mapDispatch(dispatch), [mapDispatch, dispatch]);
}

export function useToggle(defaultValue: boolean): [boolean, () => void] {
  const [value, setValue] = useState(defaultValue);

  return [value, () => setValue(!value)];
}

export function useCurrSong(): Song | null {
  return useSelector(state => {
    const {
      songs,
      queue: { cache, curr }
    } = state;

    return curr != null ? songs[curr] ?? cache[curr]?.song : null;
  });
}

export function useMediaShortcuts(shortcuts: { +[key: string]: () => mixed }) {
  useEffect(() => {
    registerShortcuts(shortcuts);

    return () => {
      removeShortcuts(shortcuts);
    };
  }, [shortcuts]);
}

export function useMediaSessionHandlers(actionHandlers: {
  +[key: string]: <T: []>(...args: T) => void
}) {
  useEffect(() => {
    if (!('mediaSession' in navigator)) {
      return;
    }

    Object.entries(actionHandlers).forEach(([eventName, handler]) =>
      navigator.mediaSession.setActionHandler(eventName, handler)
    );

    return () => {
      Object.entries(actionHandlers).forEach(([eventName]) =>
        navigator.mediaSession.setActionHandler(eventName, null)
      );
    };
  }, [actionHandlers]);
}
