import React, { Component } from 'react'
import VideosListComponent from './videos/VideosList'
import VideoUploaderComponent from './videos/VideoUploader'
import VideoViewComponent from './videos/VideoView'

// App component - represents the whole app
export default class App extends Component {

  render () {
    return (
      <div className="container">
        <header>
          <h1>Videos</h1>
        </header>

        <VideoUploaderComponent/>
        <br/>
        <br/>

        <ul>
          <VideosListComponent/>
        </ul>
        <br/>
        <br/>
        <VideoViewComponent />
      </div>
    )
  }
}

