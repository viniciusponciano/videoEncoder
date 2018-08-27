import React from 'react';

export default function VideoViewComponent({ video }) {
  return (
    <video controls onCanPlay="video/mp4">
      <source src={video.meta.url || ''} type="video/mp4" />
      <track src={video.meta.subtitle || ''} kind="subtitles" srcLang="en" label="English" />
      Opa, o vídeo não é suportado.
    </video>
  );
}
