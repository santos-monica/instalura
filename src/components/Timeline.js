import React, { Component } from 'react';
import FotoItem from './Foto';

export default class Timeline extends Component {
    constructor() {
        super();
        this.state = {
            fotos: []
        }
    }
    componentDidMount = () => {
        fetch('https://instalura-api.herokuapp.com/api/public/fotos/alots')
        .then(res => res.json())
        .then(fotos => {
            this.setState({
                fotos: fotos
            })
            console.log(fotos);
            
        });
    }
    render() {
        return (
            <div className="fotos container">
                {
                    this.state.fotos.map(foto => <FotoItem foto={foto}/>)
                }
            </div>
        );
    }
}