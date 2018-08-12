import React, { Component } from 'react'
import Button from '@material-ui/core/Button'

export default class VideoUploaderComponent extends Component {

  constructor (props) {
    super(props)
    this.state = {
      enviando: false,
      salvo: false,
      erro: false,
      video: null,
    }
  }

  onChange = (event) => {
    this.setState({video: event.target.value, enviando: false, salvo: false, erro: false})
  }

  enviarVideo = () => {
    if (this.state.video) {
      this.setState({enviando: true, salvo: false, erro: false},
        () => {
          Meteor.call('videos.insert', {name: this.state.video, createdAt: new Date()}, (err, res) => {
            if (err || !res) {
              this.setState({enviando: false, salvo: false, erro: true})
            } else {
              this.setState({video: null, enviando: false, salvo: true, erro: false})
            }
          })
        })
    } else {
      this.setState({enviando: false, salvo: false, erro: true})
    }
  }

  render () {
    return (
      <div>
        <input type="file" onChange={this.onChange} value={this.state.video || ''}/>
        <Button variant="contained" color="primary" aria-label="Enviar vídeo" onClick={this.enviarVideo}>
          Enviar vídeo
        </Button>
        {this.state.enviando && 'Enviando vídeo'}
        {this.state.salvo && 'Vídeo salvo'}
        {this.state.erro &&
        <span>
          {this.state.video ? 'Erro ao enviar vídeo' : 'Selecione um vídeo para envio'}
        </span>}
      </div>
    )
  }
}