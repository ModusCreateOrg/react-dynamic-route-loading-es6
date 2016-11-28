import React, { Component, PropTypes } from 'react';
import Toolbar from 'components/Toolbar';
import routes from 'pages/routes';
import './style.scss';

const preDownloadRoutes = () =>
  routes.childRoutes
    .slice(0, 6)
    .forEach(route => route.getComponent(null, () => null));


export default class App extends Component {
  componentDidMount() {
    preDownloadRoutes();
  }

  render() {
    return (
      <main className="viewport">
        <Toolbar />
        {this.props.children}
      </main>
    );
  }
}

App.propTypes = {
  children: PropTypes.node
};
