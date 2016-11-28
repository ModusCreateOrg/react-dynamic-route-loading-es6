import React, { Component, PropTypes } from 'react';
import Toolbar from 'components/Toolbar';
import Helmet from 'react-helmet';
import './style.scss';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      preload: []
    };
  }

  componentDidMount() {
    fetch('/chunks.json')
      .then(res => res.json())
      .then(chunks => this.setState({
        preload: chunks.map(chunk => ({ href: chunk, rel: 'preload', as: 'script' }))
      }));
  }

  render() {
    return (
      <main className="viewport">
        <Helmet link={this.state.preload} />
        <Toolbar />
        {this.props.children}
      </main>
    );
  }
}

App.propTypes = {
  children: PropTypes.node
};
