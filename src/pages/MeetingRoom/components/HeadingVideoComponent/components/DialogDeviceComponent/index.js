import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import DialogContainer from '../DialogContainer';
import styled from 'styled-components';
import landingPageSelector from '../../../../../LandingPage/LandingPage.Selector';
import {useSelector, useDispatch} from 'react-redux';
import landingPageAction from '../../../../../LandingPage/LandingPage.Action';
import './style.scss';

import svgIcons from '../../../../../../constants/svgIcon';
function DialogDeviceComponent(props) {
  const [showDialog, setShowDialog] = useState(false);

  const currentVideoIdStore = useSelector(landingPageSelector.selectCurrentVideo);
  const listVideoInputStore = useSelector(landingPageSelector.selectListVideoInput);

  const currentAudioIdStore = useSelector(landingPageSelector.selectListAudioInput);
  const listAudioInputStore = useSelector(landingPageSelector.selectListAudioInput);


  let lastAudioInputDeviceFlag = true;
  let lastVideoInputDeviceFlag = true;


  const [listVideoInput, setListVideoInput] = useState([]);
  const [currentVideoId, setCurrentVideoId] = useState(null);

  const [listAudioInput, setListAudioInput] = useState([]);
  const [currentAudioId, setCurrentAudioId] = useState(null);

  const dispatch = useDispatch();

  const [videoInput, setVideoInput] = useState({value: '', text: ''});

  function gotDevices(deviceInfos) {
    for (let i = 0; i !== deviceInfos.length; ++i) {
      const deviceInfo = deviceInfos[i];
      if (deviceInfo.kind === 'audioinput') {
        const option = {
          value: deviceInfo.deviceId,
          text: deviceInfo.label || `microphone`,
        };
        setListAudioInput((listAudioInput) => [...listAudioInput, option]);
        dispatch(landingPageAction.setListAudioInput([...listAudioInput, option]));
        if (option.value === localStorage.getItem('audioInputDeviceId')) {
          lastAudioInputDeviceFlag = true;
          setCurrentVideoId(option.value);
          dispatch(landingPageAction.setCurrentAudioId(option.value));
        } else {lastAudioInputDeviceFlag = false;}
      } else if (deviceInfo.kind === 'audiooutput') {}
      else if (deviceInfo.kind === 'videoinput') {
        const option = {
          value: deviceInfo.deviceId,
          text: deviceInfo.label || `camera`,
        };
        setListVideoInput((listVideoInput) => [...listVideoInput, option]);
        dispatch(landingPageAction.setListVideoInput([...listVideoInput, option]));
        if (option.value === localStorage.getItem('videoInputDeviceId')) {
          lastVideoInputDeviceFlag = true;
          setCurrentVideoId(option.value);
          dispatch(landingPageAction.setCurrentVideoId(option.value));
        } else {
          lastVideoInputDeviceFlag = false;
        }
      } else {
        // console.log('Some other kind of source/device: ', deviceInfo);
      }
    }
    // if (lastAudioInputDeviceFlag !== true) getAudioStream();
    // if (lastVideoInputDeviceFlag !== true) getStream();
  }

  useEffect(() => {
    if (listVideoInputStore.length === 0 || listAudioInputStore.length === 0) {
      navigator.mediaDevices
          .enumerateDevices()
          .then(gotDevices);
    } else {
      setListVideoInput(listVideoInputStore);
      setListAudioInput(listAudioInputStore);
    }
  }, []);

  const handleOnChangeSelectVideo = (e) => {
    if (currentVideoId) {
      // 현재
      if (currentVideoId === null || currentVideoId === undefined) return;
      const deviceTemp = listVideoInput.filter((dev) => dev.value === e.target.value)[0];

      // 지금 e.target.value
      dispatch(landingPageAction.setCurrentVideoId(e.target.value));
      localStorage.setItem('videoInputDeviceId', e.target.value);
      setVideoInput({videoInput: deviceTemp});
    }
    setCurrentVideoId(e.target.value);
  };
  return (
    <DeviceDiv>
      <div onClick={() => setShowDialog(!showDialog)}>
        <svgIcons.setting />
        <span>설정</span>
      </div>
      {
        showDialog &&
        <DialogContainer>
          <div className="setting-dialog__cam-setting">
            <p className="setting-dialog__subhead">카메라 설정</p>
            <div className="setting-dialog__select setting-dialog__camera-setting__select">
              <select
                value={
                  !currentVideoId ?
                    videoInput.value :
                    currentVideoId
                }
                onChange={(e) => handleOnChangeSelectVideo(e)}
              >
                {listVideoInput.length !== 0 && listVideoInput.map((input) => (
                  <option value={input.value}>{input.text}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="setting-dialog__mic-setting">
            <p className="setting-dialog__subhead">마이크 설정</p>
            <div className="setting-dialog__select">
              <select
                // value={audioInput.value}
                // onChange={(e) => this.handleOnChangeSelectAudio(e)}
              >
                {listAudioInput.length !== 0 && listAudioInput.map((audio) => (
                  <option value={audio.value}>{audio.text}</option>
                ))}
              </select>
            </div>
          </div>
        </DialogContainer>
      }
    </DeviceDiv>
  );
}
const DeviceDiv = styled.div`
  position: relative;
  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

DialogDeviceComponent.propTypes = {

};

export default DialogDeviceComponent;

