import { useEffect, useMemo, useState } from 'react';
import {
  useDispatch as _useDispatch,
  useSelector as _useSelector
} from 'react-redux';
import { Dispatch, Song, StoreState } from './types';
import { registerShortcuts, removeShortcuts } from './util';

// Type wrappers for built-in hooks
export function useSelector<Selected>(
  selector: (state: StoreState) => Selected
): Selected {
  return _useSelector(selector);
}

export function useDispatch(): Dispatch {
  return _useDispatch<Dispatch>();
}

export function useDispatchMap<T>(mapDispatch: (d: Dispatch) => T): T {
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

export function useMediaShortcuts(shortcuts: Record<string, () => void>) {
  useEffect(() => {
    registerShortcuts(shortcuts);

    return () => {
      removeShortcuts(shortcuts);
    };
  }, [shortcuts]);
}

export function useMediaSessionHandlers(
  actionHandlers: Partial<
    Record<MediaSessionAction, (details: MediaSessionActionDetails) => void>
  >
) {
  useEffect(() => {
    if (navigator.mediaSession == null) {
      return;
    }

    const { mediaSession } = navigator;

    Object.entries(actionHandlers).forEach(
      ([eventName, handler]) =>
        handler &&
        mediaSession.setActionHandler(eventName as MediaSessionAction, handler)
    );

    return () => {
      Object.entries(actionHandlers).forEach(([eventName]) =>
        mediaSession.setActionHandler(eventName as MediaSessionAction, null)
      );
    };
  }, [actionHandlers]);
}
