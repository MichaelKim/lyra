import { setShuffle } from '../../actions';
import { useDispatch, useSelector } from '../../hooks';

const Shuffle = () => {
  const shuffle = useSelector(state => state.shuffle);

  const dispatch = useDispatch();

  const onShuffle = () => {
    dispatch(setShuffle(!shuffle));
  };

  return (
    <button
      className={'shuffle-btn ' + (shuffle ? '' : 'shuffle-off')}
      onClick={onShuffle}
    />
  );
};

export default Shuffle;
