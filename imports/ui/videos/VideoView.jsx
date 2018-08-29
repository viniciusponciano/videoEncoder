import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Videos, VideosFile } from '../../api/videos/Collection';

export class VideoViewComponent extends Component {
  propTypes = {
    video: PropTypes.instanceOf(Object),
    onError: PropTypes.func,
  }

  constructor(props) {
    super(props);
    const { video } = props;
    video.url = VideosFile.link(video);
    this.state = { video };
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
  Meteor.subscribe('videos', videoId);
  return {
    video: Videos.find({}).fetch(),
  };
})(VideoViewComponent);
