import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {connect} from 'react-redux';
import {useTranslation} from 'react-i18next';
import './style.scss';

import chatService from '../ChatComponent/ChatComponent.Service';
import {getSocket} from '../../../rootSocket';
import meetingRoomSelector from '../../MeetingRoom.Selector';
import SearchIcon from '@material-ui/icons/Search';
import CancelIcon from '@material-ui/icons/Cancel';
import UserListItem from './components/UserListItem';
import remoteStreamSelector from '../RemoteStreamContainer/RemoteStreamContainer.Selector';

import userListAction from './UserList.Action';
import tabComponentAction from '../TabComponent/TabComponent.Action';
import svgIcons from '../../../../constants/svgIcon';

function UserList(props) {
  /**
   * @filterConnectingUsers : 유저 리스트
   * @listUser : 유저 리스트
   * @userType : 현재 유저 타입
   *
   */
  const {t, i18n} = useTranslation();
  const [connectingUsers, setConnectingUsers] = useState([]);
  const [filterConnectingUsers, setFilterConnectingUsers] = useState([]);
  const [isShowMoreUser, setIsShowMoreUser] = useState(null);

  const [userFilter, setUserFilter] = useState('');
  const dispatch = useDispatch();
  const remoteStreams = useSelector(meetingRoomSelector.selectRemoteStreams);

  // listUser를 변경할 떄마다 filter user를 다시 업데이트함
  // useEffect(() => {
  //   setFilterConnectingUsers(listUser);
  // }, [listUser]);

  /**
   * remoteStreams[] : {
   *  id: //socketID
   *  name: // = id
   *  stream: stream
   *  userInfo: userInfo of stream
   * },
   * listUser[]: { user }
   *
   * remote는 유저리스트를 기준으로 user 정보를 뽑음
   * 다만, 마이크 및 오디오정보는 listUser에서 뽑음
   *
   * => 이를 고정을 변경할때 마다 remote또 바뀜
   */

  useEffect(() => {
    // setFilterConnectingUsers(listUser);
    const listUserFromRemoteStream = [];
    remoteStreams.map((remote) => {
      let userInfoFromRemote = {};
      const {shareScreenStream} = props;
      if (!shareScreenStream) {
        userInfoFromRemote = remote.userInfo;
        listUserFromRemoteStream.push(userInfoFromRemote);
      } else {
        const {id} = shareScreenStream;
        if (id !== remote.id) {
          userInfoFromRemote = remote.userInfo;
          listUserFromRemoteStream.push(userInfoFromRemote);
        }
      }
    });
    setConnectingUsers(listUserFromRemoteStream);
    setFilterConnectingUsers(listUserFromRemoteStream);
  }, [remoteStreams]);

  /**
   * 사람이 위치를 고정하는 이벤트
   * 전달하는 유저 id 및 고정의 상패을 확인하여 배열을 도사ㅣ 설정함
   * 없으면 전체 유저 리스트로 출력함
   */
  function arrayMove(arr, fromIndex, toIndex) {
    let element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  }

  const handleUserFix = (isFixed, user_idx) => {
    let filterConnectingUsersTemp = filterConnectingUsers;
    let userFix = filterConnectingUsersTemp.find(
        (user) => user.user_idx === user_idx,
    );
    if (userFix === undefined) return;

    let filterConnectingUsersTempNoSelf = filterConnectingUsersTemp.slice(1);
    filterConnectingUsersTempNoSelf.forEach(function(item, i) {
      if (item.user_idx === user_idx) {
        filterConnectingUsersTempNoSelf.splice(i, 1);
        filterConnectingUsersTempNoSelf.unshift(item);
      }
    });

    let newFilterUsers = [
      filterConnectingUsersTemp[0],
      ...filterConnectingUsersTempNoSelf,
    ];
    dispatch(userListAction.handleFixUser(userFix));
    setFilterConnectingUsers(newFilterUsers);
  };

  /**
   * 검색 이벤트
   * 입력한 이름이 있으면 filter를 통해서 결과를 출력함
   * 없으면 전체 유저 리스트로 출력함
   */
  const showUserSearchResult = (keyword) => {
    const username = keyword === '' ? keyword : userFilter;
    if (username) {
      const tempFilterUsers = connectingUsers.filter((data) => {
        return data.user_name.includes(username);
      });
      setFilterConnectingUsers(tempFilterUsers);
    } else {
      setFilterConnectingUsers(connectingUsers);
    }
  };

  const handleChangeShowListUserState = () => {
    dispatch(tabComponentAction.handleChangeShowListUserState(false));
  };

  const handleClickMoreOption = (e) => {
    setIsShowMoreUser(e);
  };

  return (
    <div className="user-list__component">
      <div className="user-number">
        <p>
          {t('mainPage.userListComponent.title')}
          {filterConnectingUsers.length !== 0 &&
            `(${filterConnectingUsers.length})`}
        </p>
        <span onClick={() => handleChangeShowListUserState()}>
          {<svgIcons.icClose />}
        </span>
      </div>

      <div className="user-search">
        <SearchIcon style={{fill: '#a6adc1', marginLeft: '13px'}} />
        <input
          type="text"
          id="user-input"
          onChange={(e) => {
            setUserFilter(e.target.value);
            e.target.value === '' && showUserSearchResult('');
          }}
          onKeyPress={(e) => {
            e.key === 'Enter' && showUserSearchResult();
          }}
          value={userFilter}
          autoComplete="off"
        />
        {userFilter !== '' && (
          <CancelIcon
            style={{fill: '#2a2b37', marginRight: '10px'}}
            onClick={() => {
              setUserFilter('');
              showUserSearchResult('');
            }}
          />
        )}
      </div>

      <div className="user-list-list">
        {filterConnectingUsers.length !== 0 &&
          filterConnectingUsers.map((user, idx) => (
            <UserListItem
              idx={idx}
              key={user.id}
              user={user}
              isShowMoreUser={isShowMoreUser}
              handleUserFix={(isFixed, user_idx) =>
                handleUserFix(isFixed, user_idx)
              }
              handleClickMoreOption={(e) => handleClickMoreOption(e)}
            />
          ))}
      </div>
    </div>
  );
}

export default UserList;
