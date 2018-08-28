import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import {
  Button,
  Input,
  Grid,
  Typography,
  FormHelperText,
} from '@material-ui/core';
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

      uploadInstance.on('start', function () {
        self.setState({
          enviando: true, salvo: false, erro: false, progresso: 0,
        });
      });

      uploadInstance.on('progress', function (progresso) {
        self.setState({ progresso });
      });

      uploadInstance.on('end', function (error) {
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
      <Grid container style={{ overflowWrap: 'break-word', padding: '50px' }}>
        <Grid item xs={10}>
          <Input
            type="file"
            onChange={this.onChange}
            fullWidth
            error={erro}
          />
          <FormHelperText>
            <Typography variant="subheading" color="primary" style={{ marginLeft: '10px' }}>
              {enviando && 'Enviando vídeo'}
              {salvo && 'Vídeo salvo'}
              {erro
              && (
                <Typography variant="subheading" color="error">
                  {video ? 'Erro ao enviar vídeo' : 'Selecione um vídeo para envio'}
                </Typography>
              )}
              {progresso && (
                <div>
                  Progresso:
                  <span style={{ marginLeft: '5px' }}>
                    {progresso}
                    %
                  </span>
                </div>
              )}
            </Typography>
          </FormHelperText>
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" color="primary" aria-label="Enviar vídeo" onClick={this.enviarVideo}>
            Enviar vídeo
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('videosFile');
  return {};
})(VideoUploaderComponent);
