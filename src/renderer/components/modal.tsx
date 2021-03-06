import { createPortal } from 'react-dom';
import '../../css/modal.scss';

type Props = {
  isOpen: boolean;
  className: string;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal(props: Props) {
  const onOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    props.onClose();
  };

  const onInsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  if (!props.isOpen || document.body == null) {
    return null;
  }

  return createPortal(
    <div className='modal' onClick={onOutsideClick}>
      <div className={props.className} onClick={onInsideClick}>
        {props.children}
      </div>
    </div>,
    document.body
  );
}
