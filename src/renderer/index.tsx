// require('dotenv').config();
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import '../css/fonts.scss';
import '../css/main.scss';
import Root from './components/root';
import store from './state/store';

const root = document.getElementById('app');

function App() {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
}

if (root) {
  render(<App />, root);
}
