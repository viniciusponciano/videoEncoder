import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from "meteor/meteor";
import { HTTP } from 'meteor/http';
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

      uploadInstance.on('end', function(error, fileInserted) {
        if (error) {
          self.setState({
            enviando: false, salvo: false, erro: true, progresso: null,
          });
        } else {
          self.setState({
            enviando: false, salvo: true, erro: false, progresso: 100,
          }, () => {
            Meteor.subscribe('videosFile');
            const vid = VideosFile.findOne({ _id: fileInserted._id });
            const url = 'https://app.zencoder.com/api/v2/jobs';
            const options = {
              headers: {
                'Content-Type': 'application/json',
                'Zencoder-Api-Key': 'd6fdd6158a1cccfd687a9482cab89e5f',
              },
              data: // HTML5 video. Outputs include a high quality mp4, WebM, OGG and a lower quality
              // mp4.
                {
                  input: vid.link(),
                  outputs: [
                    // {
                    //   label: 'mp4 high',
                    //   // Change this to your server: "url": "s3://output-bucket/output-file-name.mp4",
                    //   h264_profile: 'high',
                    // },
                    // {
                    //   // Change this to your server: "url": "s3://output-bucket/output-file-name.webm",
                    //   label: 'webm',
                    //   format: 'webm',
                    // },
                    // {
                    //   // Change this to your server: "url": "s3://output-bucket/output-file-name.ogg",
                    //   label: 'ogg',
                    //   format: 'ogg',
                    // },
                    {
                      // Change this to your server: "url": "s3://output-bucket/output-file-name-mobile.mp4",
                      label: 'mp4 low',
                      size: '640x480',
                    },
                  ],
                },

            };
            const callback = (err, res) => {
              if (err) {
                console.log(err);
              }
              fileInserted.meta = res.data.outputs[0];
              Meteor.call('videos.update', fileInserted);
            };
            HTTP.post(url, options, callback);
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
        <Input type="file" accept="video/*" onChange={this.onChange} />
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
