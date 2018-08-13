import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Input } from '@material-ui/core';

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

  onChange = (event, x) => {
    event.preventDefault();
    const { files } = event.target;
    this.setState({
      video: files[0],
      enviando: false,
      salvo: false,
      erro: false,
    });
  };

  enviarVideo = () => {
    const { video } = this.state;
    if (video) {
      this.setState({ enviando: true, salvo: false, erro: false },
        () => {
          const {
            lastModified, lastModifiedDate, name, size, type, webkitRelativePath,
          } = video;
          const file = {
            lastModified, lastModifiedDate, name, size, type, webkitRelativePath,
          };
          const oReq = new XMLHttpRequest();
          oReq.open('GET', video, true);
          oReq.responseType = 'arraybuffer';

          oReq.onload = function (oEvent) {
            const arrayBuffer = oReq.response; // Note: not oReq.responseText
            if (arrayBuffer) {
              file.arrayBuffer = new Uint8Array(arrayBuffer);
              // const byteArray = new Uint8Array(arrayBuffer);
              // for (let i = 0; i < byteArray.byteLength; i++) {
              //   // do something with each byte in the array
              // }
              Meteor.call('videos.insert', file, (err, res) => {
                if (err || !res) {
                  this.setState({ enviando: false, salvo: false, erro: true });
                } else {
                  this.setState({
                    video: null, enviando: false, salvo: true, erro: false,
                  });
                }
              });
            }
          };

          oReq.send(null);
        });
    } else {
      this.setState({ enviando: false, salvo: false, erro: true });
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
        <Input type="file" onChange={this.onChange} />
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
