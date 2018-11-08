import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PubSub from 'pubsub-js';

class FotoAtualizacoes extends Component {
	constructor(props){
		super(props);
		this.state = {
			likeada: this.props.foto.likeada
		}
	}
	
	like(event) {
		event.preventDefault();
		fetch(`https://instalura-api.herokuapp.com/api/fotos/${this.props.foto.id}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`,
		{ method: 'post'})
		.then(res => {
			if(res.ok) {
				return res.json();
			} else {
				throw new Error("Não foi possível realizar o like na foto.")
			}
		})
		.then(liker => {
			this.setState({likeada: !this.state.likeada});
			PubSub.publish('atualiza-liker', {fotoId: this.props.foto.id, liker})
		})
	}

	comenta(event) {
		event.preventDefault();
		const requestInfo = {
			method: 'POST',
			body: JSON.stringify({texto: this.comentario.value}),
			headers: new Headers({
				'Content-type': 'application/json'
			})
		};
		fetch(`https://instalura-api.herokuapp.com/api/fotos/${this.props.foto.id}/comment?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, requestInfo)
		.then(res => {
			if (res.ok) {
				return res.json()
			} else {
				throw new Error("Não foi possível realizar comentar na foto.")
			}
		})
		.then(novoComentario => {
			PubSub.publish('novo-comentario', { fotoId: this.props.foto.id, novoComentario})
		});
	}
	
	render() {
		return (
			<section className="fotoAtualizacoes">
			<a onClick={this.like.bind(this)} className={this.state.likeada ? 'fotoAtualizacoes-like-ativo':'fotoAtualizacoes-like'}>Likar</a>
			<form className="fotoAtualizacoes-form" onSubmit={this.comenta.bind(this)}>
			<input type="text" placeholder="Adicione um comentário..." className="fotoAtualizacoes-form-campo" ref={input => this.comentario = input}/>
			<input type="submit" value="Comentar!" className="fotoAtualizacoes-form-submit" />
			</form>
			</section>
		);
	}
}

class FotoInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			likers: this.props.foto.likers,
			comentarios: this.props.foto.comentarios
		};
	}
	
	componentWillMount() {
		PubSub.subscribe('atualiza-liker', (topico, infoLiker) => {
			if (this.props.foto.id === infoLiker.fotoId) {
				const possivelLiker = this.state.likers.find(liker => liker.login === infoLiker.liker.login);
				if(possivelLiker === undefined) {
					const novosLikers = this.state.likers.concat(infoLiker.liker);
					this.setState({likers: novosLikers});
				} else {
					const novosLikers = this.state.likers.filter(liker => liker.login !== infoLiker.liker.login);
					this.setState({ likers: novosLikers})
				}
			}
		});

		PubSub.subscribe('novo-comentario', (topico, infoComentario) => {
			if (this.props.foto.id === infoComentario.fotoId) {
				const novosComentarios = this.state.comentarios.concat(infoComentario.novoComentario);
				this.setState({comentarios: novosComentarios})
			}			
			
		})


	}
	
	render() {
	return (
		<div className="foto-info">
		<div className="foto-info-likes">
		{
			this.state.likers.map(liker => {
				console.log(liker);
				
				return (
					<Link key={liker.login} to={`/timeline/${liker.login}`}>{liker.login} </Link>
					)
					
				})
		} curtiram
		</div>
		<p className="foto-info-legenda">
		<a className="foto-info-autor">autor </a>
		{this.props.foto.comentario}
		</p>
		
		<ul className="foto-info-comentarios">
		{
			this.state.comentarios.map(coment => {
				return (
					<li className="comentario" key={coment.id}>
					<Link to={`/timeline/${coment.login}`} className="foto-info-autor">{coment.login} </Link>
					{coment.texto}
					</li>
					)
				})
		}
		</ul>
		</div>
		);
	}
}
	
class FotoHeader extends Component {
	render() {
		return (
			<header className="foto-header">
			<figure className="foto-usuario">
			<img src={this.props.foto.urlPerfil} alt="foto do usuario" />
			<figcaption className="foto-usuario">
			<Link to={`/timeline/${this.props.foto.loginUsuario}`} href="#">
			{this.props.foto.loginUsuario}
			</Link>
			</figcaption>
			</figure>
			<time className="foto-data">{this.props.foto.horario}</time>
			</header>
		);
	}
}
		
export default class FotoItem extends Component {
	render() {
		return (
			<div className="foto">
			<FotoHeader foto={this.props.foto} />
			<img alt="foto" className="foto-src" src={this.props.foto.urlFoto} />
			<FotoInfo foto={this.props.foto} />
			<FotoAtualizacoes foto={this.props.foto} />
			</div>
		);
	}
}