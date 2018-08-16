import React, { Component } from 'react';
import { ListItem } from '@material-ui/core';
import { HTTP } from 'meteor/http';
import { Videos } from '../../api/videos/Collection';

// VideoItemComponent - Represents the component that is a video item
export default class VideoItemComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { progresso: {} };
  }

  componentDidMount() {
    Meteor.setInterval(this.obterProgresso, 1000);
  }

  obterProgresso = () => {
    const { video } = this.props;
    const url = `https://app.zencoder.com/api/v2/outputs/${video.meta.id}/progress`;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Zencoder-Api-Key': 'd6fdd6158a1cccfd687a9482cab89e5f',
      },
    };
    const self = this;
    const callback = (err, progresso) => {
      if (err) {
        console.log(err);
      }
      self.setState({ progresso });
      if (progresso.state === 'finished') {
        const { _id } = video;
        const videoAtualizado = { ...video };
        videoAtualizado.meta.progresso = progresso;
        delete videoAtualizado._id;
        Videos.update({ _id }, videoAtualizado);
      }
    };
    if (video.meta.id) {
      HTTP.get(url, options, callback);
    }
  };

  render() {
    const { video, onClick } = this.props;
    const { progresso } = this.state;
    return (
      <ListItem
        button
        key={video._id}
        id={video._id}
        onClick={() => onClick(video)}
        disabled={!['finished'].includes(progresso.state) || !video.meta.progresso}
      >
        {video.name}
        {' '}
        {progresso.state
          && (
            <span>
-
              {progresso.current_event}
              {' '}
-
              {progresso.current_event_progress}
%
              {progresso.state}
              {' '}
-
              {progresso.progress}
%
            </span>
          )}
      </ListItem>
    );
  }
}
