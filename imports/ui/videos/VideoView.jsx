import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { VideosConverted, VideosFileConverted } from '../../api/videos/Collection';

export class VideoViewComponent extends Component {
  propTypes = {
    video: PropTypes.instanceOf(Object),
    onError: PropTypes.func,
  }

  constructor(props) {
    super(props);
    const { video } = props;
    video.url = VideosFileConverted.link(video);
    this.state = { video };
    console.log('VideoToView', video);
  }

  onError = () => {
    this.props.onError();
    this.setState({ video: {} });
  }

  render() {
    const { url, subtitle } = this.state.video;
    return (
      <video controls onCanPlay="video/mp4">
        <source src={url || ''} type="video/mp4" onError={this.onError} />
        <track src={subtitle || ''} kind="subtitles" srcLang="en" label="English" />
        Opa, o vídeo não é suportado.
      </video>
    );
  }
}

export default withTracker(({ videoId }) => {
  Meteor.subscribe('videosConverted', videoId);
  return {
    video: VideosConverted.find({}).fetch(),
  };
})(VideoViewComponent);
