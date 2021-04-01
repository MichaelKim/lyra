export type Props = {
  className: string;
  rightClick?: boolean;
  items: Array<{
    label: string;
    click: () => void;
  }>;
  children: React.ReactNode;
};

export default function ContextMenu(props: Props) {
  const openMenu = () => {
    const labels: Record<string, string> = {};
    const clicks: Record<string, () => void> = {};
    for (const item of props.items) {
      const id = Math.random().toString(36).substr(2, 9);
      labels[id] = item.label;
      clicks[id] = item.click;
    }

    window.menu.show(labels).then(id => {
      clicks[id]?.();
    });
  };

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!props.rightClick) {
      e.stopPropagation();
      openMenu();
    }
  };

  const onContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    if (props.rightClick) {
      e.stopPropagation();
      e.preventDefault();
      openMenu();
    }
  };

  return (
    <div
      className={props.className}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      {props.children}
    </div>
  );
}
