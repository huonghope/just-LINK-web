import React, {useEffect, useState} from 'react';
import './style.scss';

function SoundMeter({startMeasuring, audioStream}) {
  window.audioMeterTmp = 0;
  const [audioMeter, setAudioMeter] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setAudioMeter(window.audioMeterTmp.toFixed(2) * 25);
    }, 200);
  }, []);

  useEffect(() => {
    // Reference:
    // https://github.com/webrtc/samples/blob/gh-pages/src/content/getusermedia/volume/js/soundmeter.js
    try {
      let context = new AudioContext();
      let script = context.createScriptProcessor(2048, 1, 1);
      let mic = context.createMediaStreamSource(audioStream);
      mic.connect(script);
      script.connect(context.destination);

      script.onaudioprocess = (event) => {
        const input = event.inputBuffer.getChannelData(0);
        let sum = 0.0;
        for (let i = 0; i < input.length; ++i) {
          sum += Math.pow(input[i], 2);
        }
        window.audioMeterTmp = Math.sqrt(sum / input.length);
      };
    } catch (e) {
      console.error(e);
    }
  }, [audioStream]);

  return (
    <meter
      className={startMeasuring ? 'sound-meter sound-meter-on' : 'sound-meter sound-meter-off'}
      high="0.25"
      max="1"
      value={startMeasuring ? audioMeter : 0}
    />
  );
}

export default SoundMeter;
