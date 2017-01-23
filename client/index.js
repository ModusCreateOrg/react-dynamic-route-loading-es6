import { render } from 'react-dom';
import React from 'react';
import Root from 'pages/routes';
import 'general.scss';

render(
  <Root />,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('pages/routes', () => {
    const NewRoot = require('pages/routes').default;

    render(
      <NewRoot />,
      document.getElementById('root')
    );
  });
}
