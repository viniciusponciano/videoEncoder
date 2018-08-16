import React, { Component } from 'react';
import { ListItem } from '@material-ui/core';
import { HTTP } from 'meteor/http';

// VideoItemComponent - Represents the component that is a video item
export default class VideoItemComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { progresso: {}, chamadas: 0 };
  }

  componentDidMount() {
    this.obterProgresso();
  }

  obterProgresso = () => {
    const { video } = this.props;
    let { chamadas } = this.state;
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
      chamadas++;
      self.setState({ progresso, chamadas });
    };
    if (video.meta.id && chamadas < 1000) {
      HTTP.get(url, options, callback);
    }
  };

  render() {
    const { video, onClick } = this.props;
    const { progresso } = this.state;
    if (progresso && ['failed', 'cancelled', 'finished'].includes(progresso.state)) {
      return (
        <ListItem
          button
          key={video._id}
          id={video._id}
          onClick={() => onClick(video)}
          disabled={['failed', 'cancelled'].includes(progresso.state)}
        >
          {video.name}
        </ListItem>
      );
    }
    this.obterProgresso();
    return (
      <ListItem
        button
        key={video._id}
        id={video._id}
        onClick={() => onClick(video)}
        disabled
      >
        {video.name}
        {' '}
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
      </ListItem>
    );
  }
}
