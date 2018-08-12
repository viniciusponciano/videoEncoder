import React, { Component } from 'react';
import { ListItem } from '@material-ui/core';

// VideoItemComponent - Represents the component that is a video item
export class VideoItemComponent extends Component {
  onClick = (event) => {
    // TODO goto videoView;
    const url = `videos/${event.target.id}`;
  };

  render () {
    const { video } = this.props;
    return (
      <ListItem
        button
        id={video._id}
        onClick={this.onClick}
      >
        {video.name}
      </ListItem>
    );
  }
}
