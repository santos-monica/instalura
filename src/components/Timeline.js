import React, { Component } from 'react';
import FotoItem from './Foto';
import PubSub from 'pubsub-js';
import CSSTransitionGroup from 'react-addons-css-transition-group';

export default class Timeline extends Component {
    constructor(props) {
        super(props);
        this.state = { fotos: [] }
        this.login = this.props.login;
    }
    
    componentWillMount() {
        PubSub.subscribe('timeline', (topico, objFotos) => {
            this.setState({fotos: objFotos.fotos});
        })

        PubSub.subscribe('atualiza-liker', (topico, infoLiker) => {
            const fotoAchada = this.state.fotos.find(foto => foto.id === infoLiker.fotoId);
            fotoAchada.likeada = !fotoAchada.likeada;
            const possivelLiker = fotoAchada.likers.find(liker => liker.login === infoLiker.liker.login);
            if (possivelLiker === undefined) {
                fotoAchada.likers.push(infoLiker.liker);
            } else {
                const novosLikers = fotoAchada.likers.filter(liker => liker.login !== infoLiker.liker.login);
                fotoAchada.likers = novosLikers;
            }
            // pra forçar a renderização após aterar os likers
            this.setState({ fotos: this.state.fotos });
            
        });

        PubSub.subscribe('novo-comentario', (topico, infoComentario) => {
            const fotoAchada = this.state.fotos.find(foto => foto.id === infoComentario.fotoId);
            fotoAchada.comentarios.push(infoComentario.novoComentario);
            this.setState({ fotos: this.state.fotos });

        })
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

    like(fotoId) {
        fetch(`https://instalura-api.herokuapp.com/api/fotos/${fotoId}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`,
		{ method: 'post'})
		.then(res => {
			if(res.ok) {
				return res.json();
			} else {
				throw new Error("Não foi possível realizar o like na foto.")
			}
		})
		.then(liker => {
			PubSub.publish('atualiza-liker', {fotoId, liker})
		})
    }
    comenta(fotoId, comentario) {
        const requestInfo = {
			method: 'POST',
			body: JSON.stringify({texto: comentario}),
			headers: new Headers({
				'Content-type': 'application/json'
			})
		};
		fetch(`https://instalura-api.herokuapp.com/api/fotos/${fotoId}/comment?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, requestInfo)
		.then(res => {
			if (res.ok) {
				return res.json()
			} else {
				throw new Error("Não foi possível realizar comentar na foto.")
			}
		})
		.then(novoComentario => {
			PubSub.publish('novo-comentario', { fotoId, novoComentario})
		});
    }
    render(){
    return (
    <div className="fotos container">

        <CSSTransitionGroup
            transitionName="timeline"
            transitionEnter={true}
            transitionLeave={true}
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}>
        {
        this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto} like={this.like} comenta={this.comenta}/>)
        }                
        </CSSTransitionGroup>
    </div>            
    );
}
}