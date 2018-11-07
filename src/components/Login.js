import React, { Component } from 'react'

export default class Login extends Component {
    constructor(props) {
        super(props);        
        this.state = {
            mensagem: ''
        };
    }
    
    envia = (e) => {
        e.preventDefault();
        const requestInfo = {
            method: 'POST',
            body: JSON.stringify({login: this.login.value, senha: this.senha.value}),
            headers: new Headers({
                'Content-type': 'application/json'
            })
        };

        fetch('https://instalura-api.herokuapp.com/api/public/login', requestInfo)
        .then(res => {
            if(res.ok) return res.text();
            else throw new Error('Não foi possível fazer o login')
        })
        .then(token => {
            localStorage.setItem('auth-token', token);
            this.props.history.push('/timeline');
            console.log(token);
        })
        .catch(error => {
             this.setState({mensagem: error.message})
        })
    }

    render() {
        return (
            <div className="login-box">
                <h1 className="header-logo">Instalura</h1>
                <span>{this.state.mensagem}</span>
                <form onSubmit={this.envia}> 
                    <input type="text" ref={(input) => this.login = input}/>
                    <input type="password" ref={(input) => this.senha = input}/>
                    <input type="submit" value="login"/>
                </form>
            </div>
        )
    }
}
