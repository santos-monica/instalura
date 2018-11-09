import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter, Switch, Redirect, matchPath} from 'react-router-dom';
import Login from './components/Login';
import App from './App';
import Logout from './components/Logout';
import './css/timeline.css';
import './css/reset.css';
import './css/login.css';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { timeline } from "./reducers/timeline";
import { notificacao } from "./reducers/header";
import { Provider } from 'react-redux';

function verificaAutenticacao(nextState) {
    const match = matchPath('/timeline', {
        path: nextState.match.url,
        exact: true
    });
    
    let valida = false
    if (match !== null) {
        valida = match.isExact
    }
    
    if (valida && localStorage.getItem('auth-token') === null) {
        return <Redirect to={{
            pathname: '/',
            state: { msg: 'Faça login para acessar esta página' }
        }} />
    }
    return <App login={nextState.match.params.login} />
}

const reducers = combineReducers({ timeline, notificacao });
const store = createStore(reducers, applyMiddleware(thunkMiddleware));

ReactDOM.render((
    <Provider store={store}>
        <BrowserRouter>
            <div>
                <Switch>
                    <Route exact path="/" component={Login}/>
                    <Route path="/timeline/:login?" render={verificaAutenticacao} />
                    <Route exact path="/logout" component={Logout}/>
                </Switch>
            </div>
        </BrowserRouter>
    </Provider>

), document.getElementById('root'));

