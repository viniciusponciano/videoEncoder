import React, { Component } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import Videos from '../../api/videos/collection'
import { Meteor } from "meteor/meteor"

// App component - represents the whole app
class VideosListComponent extends Component {

  render () {
    return this.props.videos.map(video => <div>video.name</div>);
  }
}

export default withTracker(() => {
  Meteor.subscribe('videos');
  return {
    videos: Videos.find({}).fetch(),
  }
})(VideosListComponent)