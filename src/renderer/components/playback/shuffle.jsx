// @flow strict

import React from 'react';
import { useDispatch, useSelector } from '../../hooks';

import type { Node } from 'React';

const Shuffle = (): Node => {
  const shuffle = useSelector(state => state.shuffle);

  const dispatch = useDispatch();
  const setShuffle = (shuffle: boolean) =>
    dispatch({ type: 'SET_SHUFFLE', shuffle });

  const onShuffle = () => {
    setShuffle(!shuffle);
  };

  return (
    <button
      className={'shuffle-btn ' + (shuffle ? '' : 'shuffle-off')}
      onClick={onShuffle}
    />
  );
};

export default Shuffle;
