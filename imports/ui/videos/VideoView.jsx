import React, { Component } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import Videos from '../../api/videos/collection'

class VideoViewComponent extends Component {

  render () {
    return <div>this.props.video.name</div>;
  }
}

export default withTracker(() => {
  const _id = '1234'
  Meteor.subscribe('videos', _id);
  return {
    video: Videos.findOne({ _id }),
  }
})(VideoViewComponent)