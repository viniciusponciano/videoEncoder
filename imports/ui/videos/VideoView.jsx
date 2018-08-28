import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class VideoViewComponent extends Component {
  propTypes = {
    video: PropTypes.instanceOf(Object),
    onError: PropTypes.func,
  }

  constructor(props) {
    super(props);
    const { meta } = props.video;
    this.state = { meta };
  }

  onError = () => {
    this.props.onError();
    this.setState({ meta: {} });
  }

  render() {
    const { url, subtitle } = this.state.meta;
    return (
      <video controls onCanPlay="video/mp4">
        <source src={url || ''} type="video/mp4" onError={this.onError} />
        <track src={subtitle || ''} kind="subtitles" srcLang="en" label="English" />
        Opa, o vídeo não é suportado.
      </video>
    );
  }
}

export default VideoViewComponent;
