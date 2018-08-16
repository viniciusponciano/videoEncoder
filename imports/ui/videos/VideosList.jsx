import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Dialog, DialogTitle, List } from '@material-ui/core';
import { VideosFile } from '../../api/videos/Collection';
import VideoItemComponent from './VideoItem';
import VideoViewComponent from './VideoView';

// VideoViewComponent - Represents the component that list all uploaded video
class VideosListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { play: {} };
  }

  onClick = (video) => {
    this.setState({ play: video });
  };

  render() {
    const { videos } = this.props;
    const { play } = this.state;
    return (
      <div>
        <List>
          {videos.map(video => (
            <VideoItemComponent key={video._id} video={video} onClick={this.onClick} />))}
        </List>
        <Dialog open={play.hasOwnProperty('name')} onClose={() => this.setState({ play: {} })}>
          <DialogTitle>
            {play ? play.name : ''}
          </DialogTitle>
          <VideoViewComponent video={play} />
        </Dialog>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('videosFile');
  return {
    videos: VideosFile.find({}).fetch(),
  };
})(VideosListComponent);
