import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Button, Input } from '@material-ui/core';
import { VideosFile } from '../../api/videos/Collection';

// VideoUploaderComponent - Represents the component that upload a video
class VideoUploaderComponent extends Component {
  constructor (props) {
    super(props);
    this.state = {
      video: null,
      enviando: false,
      salvo: false,
      erro: false,
      progresso: null,
    };
  }

  onChange = (event) => {
    event.preventDefault();
    const { files } = event.target;
    this.setState({
      video: files[0],
      enviando: false,
      salvo: false,
      erro: false,
      progresso: null,
    });
  };

  enviarVideo = () => {
    const { video } = this.state;
    if (video) {
      const self = this;
      const uploadInstance = VideosFile.insert({
        file: video,
        streams: 'dynamic',
        chunkSize: 'dynamic',
      }, false);

      uploadInstance.on('start', function() {
        self.setState({
          enviando: true, salvo: false, erro: false, progresso: 0,
        });
      });

      uploadInstance.on('progress', function(progresso) {
        self.setState({ progresso });
      });

      uploadInstance.on('end', function(error) {
        if (error) {
          self.setState({
            enviando: false, salvo: false, erro: true, progresso: null,
          });
        } else {
          self.setState({
            enviando: false, salvo: true, erro: false, progresso: 100,
          });
        }
      });

      uploadInstance.start();
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
      progresso,
    } = this.state;
    return (
      <div>
        <Input
          type="file"
          inputProps={{ accept: 'video/animaflex,video/x-ms-asf,video/x-ms-asf,video/x-ms-asf-plugin,video/avi,video/msvideo,video/x-msvideo,video/avs-video,video/x-dv,video/dl,video/x-dl,video/x-dv,video/fli,video/x-fli,video/x-atomic3d-feature,video/gl,video/x-gl,video/x-isvideo,video/mpeg,video/mpeg,video/x-motion-jpeg,video/quicktime,video/quicktime,video/x-sgi-movie,video/mpeg,video/x-mpeg,video/x-mpeq2a,video/mpeg,video/x-mpeg,video/mpeg,video/mpeg,video/mpeg,video/mpeg,video/x-sgi-movie,video/quicktime,video/x-qtc,video/vnd.rn-realvideo,video/x-scm,video/vdo,video/vivo,video/vnd.vivo,video/vivo,video/vnd.vivo,video/vosaic,video/x-amt-demorun,video/x-amt-showrun,video/*' }}
          onChange={this.onChange}
          fullWidth
        />
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
        {progresso && ` - ${progresso}%`}
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('videosFile');
  return {};
})(VideoUploaderComponent);
