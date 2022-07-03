import { useEffect, useMemo, useState } from 'react';
import {
  TypedUseSelectorHook,
  useDispatch as _useDispatch,
  useSelector as _useSelector
} from 'react-redux';
import { AppDispatch } from './state/store';
import { Song, StoreState } from './types';
import { registerShortcuts } from './util';

// Type wrappers for built-in hooks
export const useSelector: TypedUseSelectorHook<StoreState> = _useSelector;
export const useDispatch: () => AppDispatch = _useDispatch;

export function useDispatchMap<T>(mapDispatch: (d: AppDispatch) => T): T {
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
  useEffect(() => registerShortcuts(shortcuts), [shortcuts]);
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
