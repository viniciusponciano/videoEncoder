import React, { Component } from 'react';
import { ListItem, Icon, Grid } from '@material-ui/core';
import classNames from 'classnames';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import PropTypes from 'prop-types';

const style = {
  span: { marginLeft: '5px' },
};

// VideoItemComponent - Represents the component that is a video item
export default class VideoItemComponent extends Component {
  propTypes = {
    video: PropTypes.instanceOf(Object),
    onClick: PropTypes.func,
  }

  constructor (props) {
    super(props);
    this.state = { progresso: {} };
    this.interval = [];
  }

  componentDidMount () {
    this.interval.push(Meteor.setInterval(this.obterProgresso, 3000));
  }

  componentWillUpdate ({ video }) {
    const { id } = this.props.video.meta;
    if (video.meta.id !== id) {
      this.interval.push(Meteor.setInterval(this.obterProgresso, 1000));
    }
  }

  obterProgresso = () => {
    const { video } = this.props;
    const url = `https://app.zencoder.com/api/v2/outputs/${video.meta.id}/progress`;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Zencoder-Api-Key': 'd6fdd6158a1cccfd687a9482cab89e5f',
      },
    };
    const self = this;
    const callback = (err, res) => {
      if (err) {
        console.log('Progress resquest err: ', err);
      }
      const progresso = res.data;
      self.setState({ progresso });
      if (progresso.state === 'finished') {
        const videoAtualizado = video;
        videoAtualizado.meta.progresso = progresso;
        Meteor.call('videos.update', videoAtualizado);
        self.interval.forEach(interval => Meteor.clearInterval(interval));
      }
    };
    if (video.meta.id) {
      HTTP.get(url, options, callback);
    }
  }

  render () {
    const { video, onClick } = this.props;
    const {
      state,
      current_event: currentEvent,
      current_event_progress: currentEventProgress,
      progress,
    } = this.state.progresso;
    const isDisable = (state !== 'finished'
      || !(video.meta.progresso && video.meta.progresso.state === 'finished'));
    const fontColor = isDisable ? 'action' : 'primary';
    return (
      <ListItem
        button
        key={video._id}
        id={video._id}
        onClick={() => onClick(video)}
        disabled={isDisable}
      >
        <Grid container sm="auto" style={{ overflowWrap: 'break-word' }}>
          <Grid item xs={5}>
            {video.name}
          </Grid>
          <Grid item xs={6}>
            {state
            && (
              <Grid container sm="auto">
                <Grid container sm="auto">
                  {currentEvent && (
                    <Grid item sm="6">
                      Evento:
                      <span style={style.span}>
                        {currentEvent}
                      </span>
                    </Grid>
                  )}
                  {currentEventProgress && (
                    <Grid item sm="6">
                      Progresso do Evento:
                      <span style={style.span}>
                        {currentEventProgress}
                        %
                      </span>
                    </Grid>
                  )}
                </Grid>
                <Grid container sm="auto">
                  <Grid item sm="6">
                    Situação:
                    <span style={style.span}>
                      {state}
                    </span>
                  </Grid>
                  {progress && (
                    <Grid item sm="6">
                      Progresso: $
                      <span style={style.span}>
                        {progress}
                        %
                      </span>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            )}
          </Grid>
          <Grid item xs={1}>
            <Icon
              className={classNames('fa fa-play')}
              color={fontColor}
            />
          </Grid>
        </Grid>
      </ListItem>
    );
  }
}
