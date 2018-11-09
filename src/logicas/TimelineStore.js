import PubSub from 'pubsub-js';
export default class TimelineStore {
    constructor(fotos) {
        this.fotos = fotos
    }
    
    comenta(fotoId, comentario) {
        const requestInfo = {
            method: 'POST',
            body: JSON.stringify({ texto: comentario }),
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
            const fotoAchada = this.fotos.find(foto => foto.id === fotoId);
            fotoAchada.comentarios.push(novoComentario);
            // pra forçar a renderização após aterar os comentarios
            PubSub.publish('timeline', this.fotos)
        });
    }

    like(fotoId) {
        fetch(`https://instalura-api.herokuapp.com/api/fotos/${fotoId}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`,
        { method: 'post' })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error("Não foi possível realizar o like na foto.")
            }
        })
        .then(liker => {
            const fotoAchada = this.fotos.find(foto => foto.id === fotoId);
            fotoAchada.likeada = !fotoAchada.likeada;
            const possivelLiker = fotoAchada.likers.find(likerAtual => likerAtual.login === liker.login);
            if (possivelLiker === undefined) {
                fotoAchada.likers.push(liker);
            } else {
                const novosLikers = fotoAchada.likers.filter(likerAtual => likerAtual.login !== liker.login);
                fotoAchada.likers = novosLikers;
            }
            // pra forçar a renderização após aterar os likers
            PubSub.publish('timeline', this.fotos)
        });
    }

    lista(urlPerfil) {
        fetch(urlPerfil)
        .then(res => res.json())
        .then(fotos => {
            this.fotos = fotos;
            PubSub.publish('timeline', this.fotos);
        });
    }

    subscribe(callback) {
        PubSub.subscribe('timeline', (topico, fotos) => {
            callback(fotos);
        })
    }
}