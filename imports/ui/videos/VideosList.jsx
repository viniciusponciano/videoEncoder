import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import {
  Dialog,
  DialogTitle,
  List,
  Snackbar,
  Fade,
} from '@material-ui/core';
import { Videos } from '../../api/videos/Collection';
import VideoItemComponent from './VideoItem';
import VideoViewComponent from './VideoView';

// VideoViewComponent - Represents the component that list all uploaded video
class VideosListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { play: {}, errorTxt: '' };
  }

  onClick = (video) => {
    this.setState({ play: video, errorTxt: '' });
  };

  onClose = () => this.setState({ play: {}, errorTxt: '' })

  onError = () => {
    this.setState({
      play: {},
      errorTxt: 'O vídeo não está mais disponível ou não é suportado pelo navegador utilizado.',
    });
  }

  render() {
    const { videos } = this.props;
    const { play, errorTxt } = this.state;
    return (
      <div>
        <List>
          {videos.map(video => (
            <VideoItemComponent key={video._id} video={video} onClick={this.onClick} />))}
        </List>
        <Dialog open={play.hasOwnProperty('name')} onClose={this.onClose}>
          <DialogTitle>
            {play ? play.name : ''}
          </DialogTitle>
          <VideoViewComponent video={play} onError={this.onError} />
        </Dialog>
        <Snackbar
          open={!play.hasOwnProperty('name') && !!errorTxt}
          autoHideDuration={5000}
          onClose={this.onClose}
          TransitionComponent={Fade}
          message={errorTxt}
        />
      </div>
    );
  }
}

VideosListComponent.propTypes = {
  videos: PropTypes.arrayOf(Object).isRequired,
};

export default withTracker(() => {
  Meteor.subscribe('videos');
  return {
    videos: Videos.find({}).fetch(),
  };
})(VideosListComponent);
