import { render } from 'react-dom';
import React from 'react';
import { Router, browserHistory } from 'react-router/es6';
import rootRoute from 'pages/routes';
import offline from 'offline-plugin/runtime';
import 'general.scss';

offline.install();

render(
  <Router history={browserHistory} routes={rootRoute} />,
  document.getElementById('root')
);
