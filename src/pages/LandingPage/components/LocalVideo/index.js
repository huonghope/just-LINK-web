import React, {useEffect, useState} from 'react';

function LocalVideo({stream}) {
  const localVideo = React.createRef();

  useEffect(() => {
    localVideo.current.srcObject = stream;
  }, [stream]);

  return <video ref={localVideo} autoPlay muted />;
}

export default LocalVideo;
