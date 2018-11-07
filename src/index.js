import React from 'react';
import ReactDOM from 'react-dom';
import {Route, BrowserRouter, Switch, Redirect} from 'react-router-dom';
import Login from './components/Login';
import Timeline from './components/Timeline';
import Logout from './components/Logout'
import './css/timeline.css';
import './css/reset.css';
import './css/login.css';

const verificaAutorizacao = () => {
    if(localStorage.getItem('auth-token') === null) {
        return <Redirect to={
            { 
                pathname: '/', 
                state: { 
                    msg: 'voce precisa estar logado para acessar o endereço' 
                    }
            }
        } />
    }
    return <Timeline />
}

ReactDOM.render((
    <BrowserRouter>
        <div>
            <Switch>
                <Route exact path="/" component={Login}/>
                <Route path="/timeline" render={verificaAutorizacao}/>
                <Route path="/logout" component={Logout}/>
            </Switch>
        </div>
    </BrowserRouter>

), document.getElementById('root'));

