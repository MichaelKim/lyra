import { useSelector } from '../hooks';
import Queue from './queue';
import Screen from './screen';
import Settings from './settings';
import Sidebar from './sidebar';
import Youtube from './youtube';

export default function Top() {
  const currScreen = useSelector(state => state.currScreen);

  // Top-level screen components that should retain state when not being displayed

  const tops = [
    {
      Component: Settings,
      enum: 'settings',
      visible: currScreen === 'settings'
    },
    {
      Component: Youtube,
      enum: 'yt',
      visible: currScreen != null && currScreen.startsWith('yt-')
    },
    {
      Component: Queue,
      enum: 'queue',
      visible: currScreen === 'queue'
    }
  ];

  let screen = true;

  return (
    <div className='top'>
      <Sidebar />

      {tops.map(t => {
        if (t.visible) {
          screen = false;
        }
        return (
          <div key={t.enum} className={'screen ' + (t.visible ? '' : 'hidden')}>
            <t.Component />
          </div>
        );
      })}

      <div className={'screen ' + (screen ? '' : 'hidden')}>
        <Screen />
      </div>
    </div>
  );
}
