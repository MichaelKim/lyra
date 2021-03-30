import '../../css/toggle.scss';
import { useToggle } from '../hooks';

type Props = {
  selected: boolean;
  onToggle: (selected: boolean) => void;
};

export default function Toggle(props: Props) {
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
