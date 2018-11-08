import React, { Component } from 'react';
import FotoItem from './Foto';

export default class Timeline extends Component {
    constructor(props) {
        super(props);
        this.state = { fotos: [] }
        this.login = this.props.login;
    }

    carregaFotos() {
        let urlPerfil;
        if (this.login === undefined) {
            urlPerfil = `https://instalura-api.herokuapp.com/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
        } else {
            urlPerfil = `https://instalura-api.herokuapp.com/api/public/fotos/${this.login}`
        }
        fetch(urlPerfil)
        .then(res => res.json())
        .then(fotos => {
            this.setState({
                fotos: fotos
            })            
        });
    }

    componentDidMount() {
        this.carregaFotos(this.props);
    }

    componentDidUpdate(prevProps) {
        if (this.props.login !== undefined && this.props.login !== prevProps.login) {
            this.login = this.props.login
            this.carregaFotos()
        } else {
            return null
        }
    }
    render(){
    return (
    <div className="fotos container">
        {
        this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto}/>)
        }                
    </div>            
    );
}
}