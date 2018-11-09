import React, { Component } from 'react';
import Header from './components/Header';
import Timeline from './components/Timeline';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import { timeline } from "./reducers/timeline";
import { notificacao } from "./reducers/header";
import thunkMiddleware from 'redux-thunk';

const reducers = combineReducers({ timeline, notificacao });
const store = createStore(reducers, applyMiddleware(thunkMiddleware));
class App extends Component {
  render() {
    console.log(this.props)
    return (
      <div id="root">
        <div className="main">
          <Header store={store}/>
				<Timeline login={this.props.login} store={store} />
        </div>
      </div>
    );
  }
  
}

export default App;
