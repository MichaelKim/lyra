import { removeFromHistory } from '../actions';
import { useDispatch } from '../hooks';

type Props = {
  text: string;
  search: string;
  focused: boolean;
  isHistory: boolean;
  onClick: (value: string) => void;
};

const Suggestion = ({ text, search, focused, isHistory, onClick }: Props) => {
  const dispatch = useDispatch();
  const deleteFromHistory = (search: string) =>
    dispatch(removeFromHistory(search));

  const cancelBlur = (
    e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>
  ) => {
    // Stop blur event on input to keep showing suggestions
    e.preventDefault();
  };

  const selectItem = () => {
    // ? pass onBlur prop instead
    (document.activeElement as HTMLElement | null)?.blur();
    onClick(text);
  };

  const deleteItem = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    deleteFromHistory(text);
  };

  const idx = text.indexOf(search);

  const textItem =
    idx === -1 ? (
      text
    ) : (
      <>
        <b>{text.substring(0, idx)}</b>
        {search}
        <b>{text.substring(idx + search.length)}</b>
      </>
    );

  return (
    <div
      className={'search-suggest ' + (focused ? 'search-suggest-focus' : '')}
      onMouseDown={cancelBlur}
      onClick={selectItem}
    >
      <p className={isHistory ? 'search-suggest-history-item' : ''}>
        {textItem}
      </p>
      {isHistory && (
        <button
          onMouseDown={cancelBlur}
          onClick={deleteItem}
          className='search-suggest-clear'
        />
      )}
    </div>
  );
};

export default Suggestion;
