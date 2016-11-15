import { render } from 'react-dom';
import React from 'react';
import { Router, browserHistory } from 'react-router/es6';
import rootRoute from 'pages/routes';
import 'index.html';
import 'general.scss';

console.log('STARTING');
window.foo = '123';

render(
  <Router history={browserHistory} routes={rootRoute} />,
  document.getElementById('root')
);
