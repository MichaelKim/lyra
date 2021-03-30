import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import '../../css/context.scss';
import { Props } from './context';

/*
  Custom Context Menu for browsers
  1. When opening, create the context menu container in the top-left corner, hidden
    - This is for the browser to render the element fully
  2. Get its width and height
  3. Based on where the mouse was clicked, calculate the new position of the menu
    - Take into account the page width and height so the menu doesn't exceed the page
  4. Move the menu to its new position, and display it
*/

export default function Context(props: Props) {
  const [isOpen, setOpen] = useState(false);
  const [isVisible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  // Ref for cancelling setTimeout
  const ref = useRef<number | undefined>();
  // Ref for context menu container
  const el = useRef<HTMLDivElement>(null);

  function onOutsideClick(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    setOpen(false);
    setVisible(false);
  }

  function onInsideClick(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
  }

  function openMenu(e: React.MouseEvent<HTMLDivElement>) {
    const { pageX, pageY } = e;

    // Initial render
    setOpen(true);
    ref.current = window.setTimeout(() => {
      // Calculate size and reposition
      ref.current = undefined;
      if (el.current == null) return;
      const { offsetWidth, offsetHeight } = el.current;

      const top = Math.min(pageY, window.innerHeight - offsetHeight);
      const left = Math.min(pageX, window.innerWidth - offsetWidth);

      setPosition({
        top,
        left
      });
      setVisible(true);
    }, 0);
  }

  useEffect(() => {
    // Clear timeout on unmount
    return () => {
      clearTimeout(ref.current);
    };
  }, []);

  function onClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!props.rightClick) {
      e.stopPropagation();
      openMenu(e);
    }
  }

  function onContextMenu(e: React.MouseEvent<HTMLDivElement>) {
    if (props.rightClick) {
      e.stopPropagation();
      e.preventDefault();
      openMenu(e);
    }
  }

  function onItemClick(callback: () => void) {
    setOpen(false);
    setVisible(false);
    callback();
  }

  const renderMenu = () => {
    if (!isOpen || document.body == null) {
      return null;
    }

    return createPortal(
      <div
        className='context'
        onClick={onOutsideClick}
        style={{ visibility: isVisible ? 'visible' : 'hidden' }}
      >
        <div
          className={props.className}
          style={position}
          onClick={onInsideClick}
          ref={el}
        >
          {props.items.map(item => (
            <div key={item.label} onClick={() => onItemClick(item.click)}>
              {item.label}
            </div>
          ))}
        </div>
      </div>,
      // $FlowFixMe
      document.body
    );
  };

  return (
    <div
      className={props.className}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      {props.children}
      {renderMenu()}
    </div>
  );
}
