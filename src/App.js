import React, { Component } from 'react';
import Header from './components/Header';
import Timeline from './components/Timeline';

class App extends Component {
  
  render() {
    console.log(this.props)
    return (
      <div id="root">
        <div className="main">
          <Header />
          <Timeline login={this.props.login} />
        </div>
      </div>
    );
  }
  
}

export default App;
