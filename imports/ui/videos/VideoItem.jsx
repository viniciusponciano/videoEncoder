import React, { Component } from 'react';
import { ListItem } from '@material-ui/core';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

// VideoItemComponent - Represents the component that is a video item
export default class VideoItemComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { progresso: {} };
    this.interval = [];
  }

  componentDidMount() {
    this.interval.push(Meteor.setInterval(this.obterProgresso, 3000));
  }

  componentWillUpdate({ video }) {
    const { id } = this.props.video.meta;
    if (video.meta.id !== id) {
      this.interval.push(Meteor.setInterval(this.obterProgresso, 1000));
    }
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
    const callback = (err, res) => {
      if (err) {
        console.log('Progress resquest err: ', err);
      }
      const progresso = res.data;
      self.setState({ progresso });
      if (progresso.state === 'finished') {
        const videoAtualizado = video;
        videoAtualizado.meta.progresso = progresso;
        Meteor.call('videos.update', videoAtualizado);
        self.interval.forEach(interval => Meteor.clearInterval(interval));
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
        disabled={progresso.state !== 'finished'
        || !(video.meta.progresso && video.meta.progresso.state === 'finished')}
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
