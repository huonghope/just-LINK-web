import React, {useState, useEffect, useRef} from 'react';
import './style.scss';
import {useDispatch, useSelector} from 'react-redux';
import chatSelector from '../ChatComponent/ChatComponent.Selector';
import meetingRoomSelect from '../../MeetingRoom.Selector';
import chatAction from '../ChatComponent/ChatComponent.Action';
import {connect} from 'react-redux';
import DialogRoomInfoComponent from './components/DialogRoomInfoComponent';
import DialogMode from './components/DialogMode';
import RecordSupport from './components/RecordSupport';
import svgIcons from '../../../../constants/svgIcon';
import userSelector from '../../../../features/UserFeature/selector';

function HeadingVideoComponent() {
  const ref = useRef();
  const [showSplitOption, setShowSplitOption] = useState(false);
  const [userType, setUserType] = useState('');

  const myInfo = useSelector(userSelector.selectCurrentUser);

  useEffect(() => {
    if (myInfo) {
      const {user_tp} = myInfo;
      setUserType(user_tp);
    }
  }, [myInfo]);

  const handleClickShowMore = (type) => {
    setShowSplitOption(type);
  };

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (showSplitOption && ref.current && !ref.current.contains(e.target)) {
        setShowDropDownList(false);
      }
    };
    document.addEventListener('mousedown', checkIfClickedOutside);
    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [showSplitOption]);

  return (
    <div className="heading-container" ref={ref}>
      <div className="heading-container__task">
        <ul className="heading-task">
          {
            (userType === 'I' || userType === 'T') &&
            <li>
              <RecordSupport />
            </li>
          }
          <li>
            <DialogRoomInfoComponent
              showSplitOption={showSplitOption}
              handleClickShowMore={handleClickShowMore}
            />
          </li>
          <li>
            <DialogMode
              showSplitOption={showSplitOption}
              handleClickShowMore={handleClickShowMore}
            />
          </li>
        </ul>
      </div>
    </div>
  );
}
const mapStateToProps = (state) => ({
  numberOfNewMessages: chatSelector.selectNumberOfNewMessages(state),
});

export default connect(mapStateToProps)(HeadingVideoComponent);
