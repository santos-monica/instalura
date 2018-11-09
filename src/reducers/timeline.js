import {List} from 'immutable';

function trocaFoto(lista, fotoId, callbackAtualizaProps) {
    const fotoEstadoAntigo = lista.find(foto => foto.id === fotoId);
    const novasPropriedades = callbackAtualizaProps(fotoEstadoAntigo);

    const fotoEstadoNovo = Object.assign({}, fotoEstadoAntigo, novasPropriedades)
    const indiceLista = lista.findIndex(foto => foto.id === fotoId);
    return lista.set(indiceLista, fotoEstadoNovo);
}

export function timeline(state = [], action) {
    if (action.type === 'LISTAGEM') {
        return new List(action.fotos);
    }

    if (action.type === 'COMENTARIO') {
        return trocaFoto(state, action.fotoId, fotoEstadoAntigo => {
            const novosComentarios = fotoEstadoAntigo.comentarios.concat(action.novoComentario);
            return {comentarios: novosComentarios}
        } );
    }

    if (action.type === 'LIKE') {
        return trocaFoto(state, action.fotoId, fotoEstadoAntigo => {
            const likeada = !fotoEstadoAntigo.likeada;
            const liker = action.liker;
            const possivelLiker = fotoEstadoAntigo.likers.find(likerAtual => likerAtual.login === liker.login);
            let novosLikers;
            if (possivelLiker === undefined) {
                novosLikers = fotoEstadoAntigo.likers.concat(liker)
            } else {
                novosLikers = fotoEstadoAntigo.likers.filter(liker => liker.login !== possivelLiker.login)
            }
            return {likeada, likers:novosLikers}
        })
    }

    return state;
}