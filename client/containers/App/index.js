import React, { PropTypes } from 'react';
import Toolbar from 'components/Toolbar';
import Helmet from 'react-helmet';
import './style.scss';

const App = (props) => (
  <main className="viewport">
    <Helmet
      link={[
        {href: '/0.bundle.js', rel: 'preload', as: 'script'},
        {href: '/1.bundle.js', rel: 'preload', as: 'script'},
      ]}
    />
    <Toolbar />
    {props.children}
  </main>
);

App.propTypes = {
  children: PropTypes.node
};

export default App;
