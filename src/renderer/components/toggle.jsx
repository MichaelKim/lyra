// @flow strict

import React from 'react';
import { useToggle } from '../hooks';

import type { Node } from 'React';

import '../../css/toggle.scss';

type Props = {|
  +selected: boolean,
  +onToggle: (selected: boolean) => mixed
|};

export default function Toggle(props: Props): Node {
  const [selected, toggleSelected] = useToggle(props.selected);

  function onToggle() {
    props.onToggle(!selected);
    toggleSelected();
  }

  return (
    <div className='toggle'>
      <input type='checkbox' checked={selected} readOnly />
      <span className='slider' onClick={onToggle} />
    </div>
  );
}
