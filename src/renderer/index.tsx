import { StrictMode } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import '../css/fonts.scss';
import '../css/main.scss';
import Root from './components/root';
import store from './state/store';

const root = document.getElementById('app');

function App() {
  return (
    <StrictMode>
      <Provider store={store}>
        <Root />
      </Provider>
    </StrictMode>
  );
}

if (root) {
  render(<App />, root);
}
