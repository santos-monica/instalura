import {listagem, comentario, like, alerta} from '../actions/actionCreator'
export default class TimelineApi {
    static comenta(fotoId, textoComentario) {
        return dispatch => {
            const requestInfo = {
                method: 'POST',
                body: JSON.stringify({ texto: textoComentario }),
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
                dispatch(comentario(fotoId, novoComentario))
                return novoComentario;
            });
        }
    }

    static like(fotoId) {
        return dispatch => {
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
                dispatch(like(fotoId, liker))
                return liker;
            });
        }
    }

    static lista(urlPerfil) {
        return dispatch => {
            fetch(urlPerfil)
            .then(res => res.json())
            .then(fotos => {
                dispatch(listagem(fotos));
                return fotos;
            });
        }
    }

    static pesquisa(login) {
        return dispatch => {
            fetch(`https://instalura-api.herokuapp.com/api/public/fotos/${login}`)
            .then(res => res.json())
            .then(fotos => {
                if(fotos.length === 0) {
                    dispatch(alerta('Usuário não encontrado.'))
                } else {
                    dispatch(alerta(''))
                }
                dispatch(listagem(fotos))
                return fotos;
            });
        }
    }
}