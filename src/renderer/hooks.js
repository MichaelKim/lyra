// @flow strict

import React from 'react';
import {
  useSelector as _useSelector,
  useDispatch as _useDispatch
} from 'react-redux';

import { registerShortcuts, removeShortcuts } from './util';

import type { StoreState, Dispatch } from './types';

// Type wrappers for built-in hooks
export function useSelector<Selected>(
  selector: StoreState => Selected
): Selected {
  return _useSelector<StoreState, Selected>(selector);
}

export function useDispatch() {
  return _useDispatch<Dispatch>();
}

export function useDispatchMap<T>(mapDispatch: Dispatch => T): T {
  const dispatch = useDispatch();
  return React.useMemo(() => mapDispatch(dispatch), [mapDispatch, dispatch]);
}

export function useToggle(defaultValue: boolean) {
  const [value, setValue] = React.useState(defaultValue);

  return [value, () => setValue(!value)];
}

export function useMediaShortcuts(shortcuts: { +[key: string]: () => mixed }) {
  return React.useEffect(() => {
    registerShortcuts(shortcuts);

    return () => {
      removeShortcuts(shortcuts);
    };
  }, [shortcuts]);
}

export function useMediaSessionHandlers(actionHandlers: {
  // $FlowFixMe
  +[key: string]: Function
}) {
  React.useEffect(() => {
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
