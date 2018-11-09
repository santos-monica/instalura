import React, { Component } from 'react';
import Header from './components/Header';
import Timeline from './components/Timeline';
import {createStore, applyMiddleware} from 'redux';
import { timeline } from "./reducers/timeline";
import thunkMiddleware from 'redux-thunk';

const store = createStore(timeline, applyMiddleware(thunkMiddleware));
class App extends Component {
  

  render() {
    console.log(this.props)
    return (
      <div id="root">
        <div className="main">
          <Header />
				<Timeline login={this.props.login} store={store} />
        </div>
      </div>
    );
  }
  
}

export default App;
