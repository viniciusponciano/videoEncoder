import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import { List } from '@material-ui/core'
import { Videos } from '../../api/videos/Collection'
import VideoItemComponent from './VideoItem'

// App component - represents the whole app
class VideosListComponent extends Component {

  render () {
    return <List>{this.props.videos.map(video => <VideoItemComponent video={video} />)}</List>
  }
}

export default withTracker(() => {
  Meteor.subscribe('videos')
  return {
    videos: Videos.find({}).fetch(),
  }
})(VideosListComponent)