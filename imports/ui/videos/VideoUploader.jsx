import React, { Component } from 'react'
import Videos from '../../api/videos/collection'

export default class VideoUploaderComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      enviando: false,
      salvo: false,
      erro: false,
      video: null,
    }
  }

  onChange = (event) => {
    this.setState({ video: event.target.value, enviando: false, salvo: false, erro: false });
  }

  enviarVideo = () => {
    this.setState({ enviando: true, video: null },
      () => {
        Meteor.call('videos.insert', { name: this.state.video, createdAt: new Date() }, (err, res) => {
          if (err) {
            this.setState({ salvo: true, erro: true })
          } else {
            this.setState({ video: null, salvo: true})
          }
        })
      });
  }

  render () {
    return (
      <div>
        <input type="file" onChange={this.onChange} value={this.state.video}/>
        <button onClick={this.enviarVideo}>Enviar vídeo</button>
      {this.state.enviando ? 'Enviando vídeo' : `Aguardando envio do arquivo ${this.state.video || ''}`}
      </div>
    );
  }
}