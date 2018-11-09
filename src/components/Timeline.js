import React, { Component } from 'react';
import FotoItem from './Foto';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import TimelineApi from '../logicas/TimelineApi';

export default class Timeline extends Component {
    constructor(props) {
        super(props);
        this.state = { fotos: [] }
        this.login = this.props.login;
    }
    
    componentWillMount() {
        this.props.store.subscribe(() => {
            this.setState({fotos: this.props.store.getState().timeline});
        });
    }
    
    carregaFotos() {
        let urlPerfil;
        if (this.login === undefined) {
            urlPerfil = `https://instalura-api.herokuapp.com/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
        } else {
            urlPerfil = `https://instalura-api.herokuapp.com/api/public/fotos/${this.login}`
        }
        this.props.store.dispatch(TimelineApi.lista(urlPerfil));
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

    like(fotoId) {
        this.props.store.dispatch(TimelineApi.like(fotoId));
    }

    comenta(fotoId, comentario) {
        this.props.store.dispatch(TimelineApi.comenta(fotoId, comentario))
    }

    render() {
        return (
        <div className="fotos container">
            <CSSTransitionGroup
                transitionName="timeline"
                transitionEnter={true}
                transitionLeave={true}
                transitionEnterTimeout={500}
                transitionLeaveTimeout={300}>
            {
                this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto} like={this.like.bind(this)} comenta={this.comenta.bind(this)}/>)
            }                
            </CSSTransitionGroup>
        </div>            
        );
    }
}