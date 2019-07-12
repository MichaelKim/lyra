// @flow strict

import {
  useSelector as _useSelector,
  useDispatch as _useDispatch
} from 'react-redux';

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
