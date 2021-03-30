import { useRef } from 'react';

// Max delay in ms between two clicks
const DBL_CLICK_DELAY = 250;

type Props = {
  onSngClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onDblClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  children: React.ReactNode;
  className?: string;
};

export default function Click(props: Props) {
  // Double click
  const isDblClick = useRef(false);
  const clickTimer = useRef<number | null>(null);

  function onClick(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();

    // Make it easier to double click
    if (clickTimer.current != null) {
      onDblClick(e);
      return;
    }

    // Don't fire click handler if double click
    clickTimer.current = window.setTimeout(() => {
      if (!isDblClick) {
        props.onSngClick && props.onSngClick(e);
      }
      clickTimer.current = null;
      isDblClick.current = false;
    }, DBL_CLICK_DELAY);
  }

  function onDblClick(e: React.MouseEvent<HTMLDivElement>) {
    // Don't fire single click handler
    clickTimer.current && clearTimeout(clickTimer.current);
    clickTimer.current = null;
    isDblClick.current = true;

    props.onDblClick(e);
  }

  return (
    <div className={props.className || ''} onClick={onClick}>
      {props.children}
    </div>
  );
}
