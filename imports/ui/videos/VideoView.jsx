import React from 'react';
// import { Meteor } from 'meteor/meteor';
// import { withTracker } from 'meteor/react-meteor-data';
// import Videos from '../../api/videos/Collection';

// VideoViewComponent - Represents the component that play a video
export default function VideoViewComponent({ video }) {
  video = video ? video : { link: () => {}, meta: {} };
  return (
    <video controls>
      <source src={video.link()} type={video.type} />
      <track src={video.meta.subtitle} kind="subtitles" srcLang="en" label="English" />
        Opa, o vídeo não é suportado.
    </video>
  );
}
//
// export default withTracker((props) => {
//   const { videoId: _id } = props;
//   Meteor.subscribe('videos', _id);
//   return {
//     video: Videos.findOne({ _id }) || {},
//   };
// })(VideoViewComponent);
