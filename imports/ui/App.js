import React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import VideosListComponent from './videos/VideosList';
import VideoUploaderComponent from './videos/VideoUploader';
import VideoViewComponent from './videos/VideoView';

// App component - represents the whole app
export default function App() {
  return (
    <div className="container">
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="title" color="inherit">
            Vídeos
          </Typography>
        </Toolbar>
      </AppBar>
      <VideoUploaderComponent />
      <br />
      <br />

      <ul>
        <VideosListComponent />
      </ul>
      <br />
      <br />
      <VideoViewComponent />
    </div>
  );
}
