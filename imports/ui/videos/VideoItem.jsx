import React, { Component } from 'react'
import { ListItem } from '@material-ui/core'

// App component - represents the whole app
export default class VideoItemComponent extends Component {

  onClick = (event) => {
    // TODO goto videoView;
    const url = `videos/${event.target.id}`
  }

  render () {
    return <ListItem
      button
      id={this.props.video._id}
      name={this.props.video._id}
      onClick={this.onClick}>{this.props.video.name}</ListItem>
  }
}