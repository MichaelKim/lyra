// @flow strict

import * as React from 'react';

import '../../css/toggle.scss';

type Props = {|
  +onToggle: (selected: boolean) => void,
  +selected: boolean
|};

export default function Toggle(props: Props) {
  const [selected, setSelected] = React.useState(props.selected);

  function onToggle() {
    props.onToggle(!selected);

    setSelected(!selected);
  }

  return (
    <div className='toggle'>
      <input type='checkbox' checked={selected} readOnly />
      <span className='slider' onClick={onToggle} />
    </div>
  );
}
