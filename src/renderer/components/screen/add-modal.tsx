// @flow strict

import React from 'react';
import Modal from '../modal';
import Toggle from '../toggle';
import { useSelector } from '../../hooks';
import { values } from '../../util';

import type { Node } from 'React';
import type { Song, PlaylistID } from '../../types';

type Props = {|
  +song: Song,
  +onClose: (toggle: PlaylistID[]) => mixed
|};

const AddModal = (props: Props): Node => {
  const playlists = useSelector(state => values(state.playlists));
  const [toggle, setToggle] = React.useState(
    new Set(
      playlists.filter(p => props.song.playlists.includes(p.id)).map(p => p.id)
    )
  );

  const onClose = () => {
    props.onClose([...toggle]);
  };

  const onToggle = (pid: PlaylistID) => {
    setToggle(toggle => {
      if (toggle.has(pid)) {
        toggle.delete(pid);
      } else {
        toggle.add(pid);
      }

      return toggle;
    });
  };

  return (
    <Modal isOpen={true} onClose={onClose} className='modal-content'>
      <h3>Select Playlists</h3>
      {playlists.map(p => (
        <div key={p.id}>
          <p>{p.name}</p>
          <Toggle onToggle={() => onToggle(p.id)} selected={toggle.has(p.id)} />
        </div>
      ))}
    </Modal>
  );
};

export default AddModal;
