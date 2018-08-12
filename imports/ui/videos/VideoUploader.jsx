import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Button from '@material-ui/core/Button';

// VideoUploaderComponent - Represents the component that upload a video
export default class VideoUploaderComponent extends Component {
  constructor (props) {
    super(props);
    this.state = {
      video: null,
      enviando: false,
      salvo: false,
      erro: false,
    };
  }

  onChange = ({ target: value }) => {
    this.setState({
      video: value,
      enviando: false,
      salvo: false,
      erro: false,
    });
  };

  enviarVideo = () => {
    const { video, setState } = this.state;
    if (video) {
      setState({ enviando: true, salvo: false, erro: false },
        () => {
          Meteor.call('videos.insert', { name: video, createdAt: new Date() }, (err, res) => {
            if (err || !res) {
              setState({ enviando: false, salvo: false, erro: true });
            } else {
              setState({
                video: null, enviando: false, salvo: true, erro: false,
              });
            }
          });
        });
    } else {
      setState({ enviando: false, salvo: false, erro: true });
    }
  };

  render () {
    const {
      video,
      enviando,
      salvo,
      erro,
    } = this.state;
    return (
      <div>
        <input type="file" onChange={this.onChange} value={video || ''} />
        <Button variant="contained" color="primary" aria-label="Enviar vídeo" onClick={this.enviarVideo}>
          Enviar vídeo
        </Button>
        {enviando && 'Enviando vídeo'}
        {salvo && 'Vídeo salvo'}
        {erro
        && (
          <span>
            {video ? 'Erro ao enviar vídeo' : 'Selecione um vídeo para envio'}
          </span>
        )}
      </div>
    );
  }
}
