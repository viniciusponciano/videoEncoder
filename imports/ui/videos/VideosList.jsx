import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { List } from '@material-ui/core';
import Videos from '../../api/videos/Collection';
import { VideoItemComponent } from './VideoItem';

// VideoViewComponent - Represents the component that list all uploaded video
function VideosListComponent({ videos }) {
  return (
    <List>
      {videos.map(video => (<VideoItemComponent video={video} />))}
    </List>
  );
}

export default withTracker(() => {
  Meteor.subscribe('videos');
  return {
    videos: Videos.find({}).fetch(),
  };
})(VideosListComponent);
