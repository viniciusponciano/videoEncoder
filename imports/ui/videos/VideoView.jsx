import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Videos from '../../api/videos/Collection';

// VideoViewComponent - Represents the component that play a video
function VideoViewComponent({ video }) {
  return (
    <div>
      {video.name || ''}
    </div>
  );
}

export default withTracker(() => {
  const _id = '1234';
  Meteor.subscribe('videos', _id);
  return {
    video: Videos.findOne({ _id }) || {},
  };
})(VideoViewComponent);
