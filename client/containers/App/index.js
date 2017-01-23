import React, { Component, PropTypes } from 'react';
import Toolbar from 'components/Toolbar';
import preload from 'utils/preload';
import './style.scss';

export default class App extends Component {
  componentDidMount() {
    window.__CHUNKS.forEach(preload);
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
