MeetingRoom Component

1. 추가 Component

- ChatComponent : 채팅 부분 관리함
- HeadingVideoComponent : 해더 부분 관리함
- RemoteStreamContainer : 연결 stream를 출력 및 관리함
- RemoteStreamContainerAudio : 연결 stream의 오디오를 출력 및 관리함
- RemoteStreamContainerShare : 화명 공유 시 연결 stream를 출력 및 관리함
- StreamAudioComponentRemote : RemoteStreamComponentAudio부터 받은 audio stream를 출력함 (본인 빼고 모든 사용자)
- StreamAudioComponentSelf : RemoteStreamComponentAudio부터 받은 audio stream를 출력함 (본인만 출력함)
- StreamVideoComponentRemote : RemoteStreamContainer부터 받은 video stream를 출력함 (본인 빼고 모든 사용자)
- StreamVideoComponentSelf : RemoteStreamContainer부터 받은 video stream를 출력함 (본인만)
- StreamVideoComponentShare : 화면공유 시 RemoteStreamContainerShare 부터 받은 stream를 출력함 (화면 공유하는 사람 stream)
- StreamVideoSlideItem : 화면공유 시 오른쪽에서 작은 video 출력함
- TabComponent : 밑에 있는 부분 처리함
- UserList : 유저 리스트를 출력하는 부분
- WhiteBoard : 화이트보드를 출력한느 페이이지

2. Redux 구조

- Action :
  - handleSetMyInfo : 유저 정보를 설정하는 함수
  - handleSetUserType : 유저 타입을 설장하는 함수
  - handleSaveRemoteStreams : 전체 연결 stream 값이 설장하는 함수
  - handleSetRoomInfo : 룸정보를 설정하는 함수
  - handleChangeListUserBadNetwork : 연결되고 있는 네트워크가 안 좋은 유러 리스트 설정하는 함수
  - handleCreateLocalStream : local stream 값을 설정하는 함수
  - handleChangeMicAllUserState : 모든 유저 마이크 상태 값이 저장하는 변수
  - handleFixVideo : pin한 카메라 설정하는 함수
  - handleSetPeerConnections : 모든 연결된 peer 값을 설정하는 함수
  - handleSetListUserByUserRoom : 유저 리스트 값을 설정한느 함수
  - handleSetRoomRecordInfo : 룸녹화 정보 값을 설정하는 삼수
- Contants :

  - CHANGE_SET_MY_INFO: 유저 정보
  - CHANGE_MIC_ALL_USER_STATE: 유저 상태
  - CREATE_LOCALSTREAM: 노컬 stream
  - SET_ROOM_INFO: 룸의 정보
  - SET_USER_TYPE: 유저 타입
  - CHANGE_FIX_VIDEO: stream 고정
  - CHANGE_LIST_USER_BAD_NETWORK: 네트워크 안 좋은 유저 리스트
  - SET_PEER_CONNECTIONS: 연결 피어 리스트
  - SET_LIST_USER_BY_USERROOM: 유저 리스트
  - SET_REMOTESTREAMS: 연결되 stream
  - SET_ROOMRECORD_INFO: 녹화 정보

- Reducer :

  ```js
  const initialState = {
    myInfo: {}, //유저 정보
    micAllUserState: false, // 모단 유저 mic 상태
    localStream: null, //로컬 stream상태
    userType: 0, //유저 타입
    roomInfo: null, //유저 정보
    fixVideo: {
      // 고정 동영상
      status: false,
      userInfo: {}
    },
    listUserBadNetwork: [], // 네트워크 안 좋은 유저 리스트
    peerConnections: {}, // 연결 peer 리스트
    listUserByUserRoom: [], // 유저 리트
    remoteStreams: [], // 연결된 stream
    roomRecordInfo: null //녹화 정보
  }
  ```

- Selector :

  - getMyInfo : 유저 정보를 출력함
  - getLocalStream : 노컬 stream를 출력함
  - selectUserType : 유저 타입을 출력함
  - selectRoomInfo : 룸의 정보를 출력함
  - selectMuteAllMic : 모든 유저 마이크 상태 값을 출력함
  - selectFixVideo : 고정 video를 출력함
  - selectListUserBadNetwork : 네트워크가 안 좋은 유저 리스트
  - selectPeerConnections : 연결 peer를 출력함
  - selectRemoteStreams : 모든 연결 stream를 출력함
  - selectRoomRecordInfo : 녹화 정보를 출력함

- Service :
  - getUserRole : 유저 타입을 출력 api
  - getRoomInfo : 룸정보를 출력 api
  - getUserInfoBySocketId : 유저 정보를 출력 api
  - getAllUserByUserRoom : 해당 유저룸을 모든유저의 정보를 출력 api
  - setRoomRecord : 룸을 녹화정보를 저장함
  - setSaveRecordData : 룸의 녹화 데이트를 저장항

2. index.js

##### function:

###### React life cycle

- componentDidMount : component 로딩할때 한번만 실행함

```
모든 socket.on 이벤트를 추가함
- 먼저 getSocket()를 통해서 socket가 생성되는지 안 되는 확인함, 만약에서 생성되었으면 connect messsage를 통해서 webrtc를 연결함
(Client가 message를 통해서 서버에서 생성되는지안 되는 확인함, 오류가 있으면 생성 안 됨)
- 연결한 다음에 join-room를 통해서 방을 개설함
- 연결 및 방을 정상적으로 생성되었으면
  + 룸정보를 저장함
  + stream를 생성함 (밑에 gotDevicesAndCreateStream함수 참조)
  + socket listing 리스트들을 추가함 (상세 내용을 밑에 설명함)
- 처음에 들어갔을 디폴트 2x2 해서 slice를 통해서 4개 잘라서 renderRemotStreams에서 저장하고 나머지 nextListRemoteStreams에서 저장함
```

- componentWillReceiveProps : props를 변경할 떄마다 실행 (이 component root라서 redux의 props에서만 함)

```
- listUser : 유저리스트를 변경할 때 마다...미처리함
- modeType : 화면 출력 타입을 변경할 떄 마다 변경함
  + 특히 모드를 변경할때 연결되고 있는 stream (remoteStream에서 저장함)를 해상도 다 up으로 올림
```

- componentDidUpdate : pros 및 state를 업데이트

```
1. remoteStreams !== prevRemoteStreams
remoteStreams의 길보다 4
true :
- 일단 remoteStreams 및 prevRemoteStreams의 달라진 부분을 찾는다
- 달라진 부분이 있으면
    true :
      현재 출력되고 있는 화면의 길이 3라면
         true : 현재 출력 stream를 달라진 부분 0번째 원소를 추가해서 깂을 설정
         flase : 그렇지 않으면 nextListRemoteStream에서 추가함 및 nextListRemoteStream 원소들이 해상도 내린다
    false : 아무것도 안함
false :
- remoteStreams 중에서 4개(0, 4) 잘라서 renderRemoteStream에서 저장할깃임


2. (handleSlideRemoteBtn !== prevHandleSlideRemoteBtn ) && (renderRemoteStreams !== prevRenderRemoteStreams)
next 과 prev 버튼을 클릭했을 때 처리함, 그리고 전에 renderRemoteStreams 및 현 renderRemoteStreams를 변경했 을떄
- renderRemoteStream를 받아서 해상도 올림 (diffUp)
- 전체 stream 및 renderRemoteStream를 비굔해서 달라진 부분을 가지고 와서 해상도 내림 (diffDown)


3. isRemoteExistRenderRemoteStreams !== prevIsRemoteExistRenderRemoteStreams &&
renderRemoteStreams.length !== prevRenderRemoteStreams.length &&
isRemoteExistRenderRemoteStreams
현재 출력되고 있는 페이지에서 나갈 사람이 있면, 2 값으 길이 다른 경우에, isRemote.. 존재하는경우임

3.1 nextListRemoteStreams 길의 0보다 다름 (측 나가는 사람 뒤에 리스트(next List) 사람이 있는 것임)
- 첫번쨰 원소를 받아서서 및 새로 nextListRemoteStream를 만들어얌 (단순히 slice)
- 첫번쨰 원소를 renderStreams에서 추가하고 값을 다시 설정함
=> setState (nextListRemote, nextList, isRemoteExistRenderRemoteStreams = false)

3.2 prevListSteam.length 길의 0보다 다름: 측 나가는 사람 앞에 리스트(prev List) 사람이 있는 것임)
- 일단 mode 변수를 출력하고 preveListRemoteStream에서 가지고 갈 stream를 뺴
- renderRemoteStreams를 2차 배열 형식으로 값을 추가하고 다시 설정함
- setState(renderRemoteStreams, prevListRemoteStreams, currentPage)

모든 경우는 if문을 통해서 비교해서 처리함
마지막 단계에서 renderRemoteStreamsTemp 및 remoteStreams를 비교해서 해상도가 내리거나 올림


4. currentVideo !== prevVideo : 카메라를 변경 했을떄 ... // 미처리함

5. 동영상을 고정 했을떄
- 고정된 동영상의 정보를 받아서 전체 stream를 비교해서 출력함
- remoteSteams를 순서를 변경해서 다시 값이 설정함
```

- componentWillUnmount : component를 없애헀을 때 진행함

```
- disconnected: 값이 설정 -> true
- clearInterval(intervalMonitoringOffer) : interval 타임을 reset
- clearInterval(intervalMonitoringOnline) : interval 타임을 reset

```

- handleSuccess

```
stream를 받아서 출력하는 함수
isLocalStream 및 localStream 값을 체크함 (즉 존재하지 않으면)
userRoomId를 windows localStorage부터 받아 서버한테 보내고 유저정보를 받는다
localRemoteSteamm를 하나 생성해서 (id, name - socketid 및 stream, user 정보, type)를 remoteStreams에서 저장함
onlinePeers를 통해서 서버에서 룸을 생성함
그리고 audio 및 micro 상태를 서버한테 받아서 redux를 저장함
```

- handleError

```
stream를 생성시 오류를 발생하면 error를 출력함
state를 통해서 errorDevice를 true 값이 설정
```

- gotDevices

```
listDetectAudioInput, listDetectVideoInput, selectedAudioInput, selectedVideoInput : 인식되는 기계 및 선택된 기계
for 문을 이용해서 devices를 검사함. 위에 값들이 저장함 (localStorage에서 저장되는 값이 비교함)
검사되는 값들이 redux를 통해서 값이 저장함
return { audio 및 video}
```

- gotDevicesAndCreateStream

```
redux에서 저장되고 있는 stream를 출력하여 전체체크한 다음에, 만약에 있으면 handleSuccess를 전달함
반대로 없다면
- localStorage에서 값을 저장되고 있는지 체크함,
  + 있으면 selected...Input 값이 설정함 (이미 선택했으면 stream를 생성만하고 출력함) (TRICK : 있어도 다시 인삭하여 3초 후에 값이 설정함)
  + 반대로 없으면 gotDevices를 통해서 카메라 및 오디오를 인식하여 값이 설정함
- 이어서 stream를 video: true, audio: true 디폴드 값을 설절해서 stream를 생성한다 (해당 컴퓨터에서 각 기계들을 인식하기 위함)
- 위에 단계를 거처서 각 기계 id를 받아서 stream를 생성함 (해상도 값도 설정함 - 1280px x 760px)
(여기서도 유저 타입을 체크하는데, 만약에서 유저가 호스트라면 무조건 카메라가 있어야됨)
TRICK : 일반 유저가 카메라가 없으면 audio를 생성하고 - canvas를 통해서 video를 생성해서 stream를 합친다
```

- createPeerConnection (socketID, userInfo, type, callback)

```
- 웹RTC를 연결하기 위해서 RTCPeerConnection객체를 만듦(pc_config 필수) pc_config를 coturn서버 정보가 저장됨
- socketId를 이용해서 RTCPeerConnection객체랑 매핑함
- pc.onicecandidate : candidate 데이트를 받은 이벤트를 처리함
- pc.oniceconnectionstatechange : 연결상태를 확인함 (connectionState, iceConnectionState, iceGatheringState)
- pc.ontrack : track를 추가했을 때 (죽 상대방을 카메라를 인식해서 추가했을떄 발생함 )
  + remoteStream를 출력함 (socketId를 통해서 즉정 유저 stream를 출력함)
  + 만약에 존재하면 (즉 이미 한번 실생되었음) addTrack를 통해서 추가해서 다시 remoteStreams의 값이 설정함
  + 만약에 없으면 MediaStream객체를 하나 생성하고 addTrack를 통해서 stream를 추가함
  + TRICK를 일반 stream나 화면공유 stream를 구분해서 저장함
  + stream를 생성한 다음에 state에 저장함
- pc.closed : 연결을 닫을 떄 (즉 pc를 연결이 끊었을때 발생하는 이벤트) - 미사용
- type에사 따라서 stream를 추가하는것이 다름 (addTrack를 통해서 추가함)
  + 만약에 type가 share-screen라면 그냥 canvas로 생성되는 stream를 추가함
  + type가 일반 유저라면 localStream를 추가함 (localStream.getTracks()를 통해서 각 track를 pc에서 추가함)
```

- socketListenerEventToWebRTC

```
- getSocket().on('online-peer') :
- getSocket().on('offer', (data) :
- getSocket().on('answer', (data) :
- getSocket().on('candidate', (data) :
-
```

- socketListenerEventToEventVideoSlide

```
- getSocket().on('alert-edit-stream-slide-rel', ({type, socketID}) :
-  getSocket().on('alert-connection-fail-user', ({remoteSocketId}) :
```

- socketListenerEventToEventBitrate

```
- getSocket().on('alert-bitrate', ({remoteSocketId}) :
- getSocket().on('alert-connection-fail-user', ({remoteSocketId}) :
```

- socketListenerEventToEventScreenShare :

```
- getSocket().on('alert-other-user-share-screen', async ({status, remoteSocketId, alert}) :
- getSocket().on('alert-other-user-share-screen-change-bitrate', async ({status, remoteSocketId}) :
- getSocket().on('alert-share-screen', async ({remoteId, shareScreenState}) :
- getSocket().on('alert-update-user-auth', async (data) :
```

- socketListenerEventToPeerDisconnected

```
- getSocket().on('peer-disconnected', (data) :
- getSocket().on('alert-room-end', (data) :
```

- socketListenerEventRequestToRoom

```
* 호스트 인경우에은
- getSocket().on('student-ask-to-join', (data) :
- getSocket().emit('student-ask-to-join-result', (data)) :

- getSocket().on('alert-user-change-device', (data) :
- getSocket().on('request-device', (data) :
- getSocket().on('alert-user-room-record', ({data}) :
```

- socketListenerEventToChatting
- getSocket().on('res-sent-files', (data) :
- getSocket().on('res-sent-message', (data) :

```

```

- handleOutRoom

```
- 해당 룸을 나가기 기능
```

- stopTracks(stream)

```
전달 stream를 중지함
```

- handleWindowSize

```
전체 사이즈를 변경함
```

- calSleepTime (peerCount)

```
sleep 시간을 계산하는 함수
```

- createPeerConnectionShare

```
- 호스트가 화면을 공유할때 특정한 RTCPeerConnection를 만들기 위함
- TRICK : 연결 상대방은 track에 추가하지 않음
- stream를 존재하면 pc.addTrack를 통해서 추가함
```

- handleScreenModeMain

```
* 화면 공유할 떄 실행하는 이벤트
- 먼저 stream의 constrains 값을 설정함, 설정한 값으로 stream를 생성한다.
- remoteStreamTemp 변수에서 stream 및 정보를 저장함 (id: share-screen, stream, userInfo)
- 생성되는 remoteStreamTemp 값이 state 및 redux에서 저장

- configSocketShare()를 통해서 socket 하나 더 생성함
- getSocketShare().on('connect') : socket연결 성공했을 때
- getSocketShare().emit('user-add-stream', {}, function(status, message) :
- getSocketShare().on('online-peer', ({socketID, userInfo}) :
- getSocketShare().on('offer', (data) :
- getSocketShare().on('answer', (data) :
- getSocketShare().on('candidate', (data) :

- 화면공유 시 stream 생성 및  새로 socket를 통해서 PeerConnection를 연결한 후에
- getSocketShare().emit('alert-other-user-share-screen', {status: true}) : 이 이벤트를 통해서 다른사람한테 화면 공유를 알람
- onended() 이벤트를 통해서 stream를 단기 이벤트를 잡음
- stream를 onended할 떄 다른 사람한테 알려주고 전체 화면공유(state 및 redux) 상태를 변경하고 socket를 닫음
```

- handleStopSharingScreen

```
- isGuestSharingScreen 상태 값을 받아서 체크함
- getSocketShare()를 출력해서 값이 체크함
- getSocketShare().emit('alert-other-user-share-screen', {status: false}) : 중지 상태 값이 전달함
- 해당 guestShareStream를 출력해서 track.stop()를 실행함
- 전체 화면 공유 상태를 변경해서 socket를 close()함
```

- handleWhiteBoard

```
- isGuestSharingScreen, paintScreen 값이 출력함
- 만약에 화면공유 하고 있음 및 Whiteboard 하고 있는 상태에서 => 화면공유 실행
- 그렇지 많으면 화면 중지
- 생태 값이 redux 및 state를 통해서 저장함
```

- handleDataAvailable

```
- 녹화 기능 사용할때 녹화되는 기간에 녹화된 데이트를 저장함
- 전에 버전인경우에는 녹화 기능 종료되면 해당 녹화 데이트를 서버한테 보냄

```

- handleScreamRecording

```
- 전에 버전에서 녹화 버튼을 클릭할때
- 녹화 화면을 선택해서 카메라를 맞게 설정하고 getDisplayMedia를 통해서 stream를 생성함

```

- recordWithStream(stream)

```
- 기존 녹화 기능에서 음성하기 위한 stream를 합침
```

- getEmptyMediaStream

```
- canvas를 통해서 빈 stream를 생성함
```

- handleClickPrevBtn

```
- renderRemoteStreams, remoteStreams, prevListRemoteStreams, nextListRemoteStreams 값들이 출력함
- 현재 연결되고 있는 stream <= 4 또는 prevListRemoteStreams 비워있으면 무시
- valuesMode 지정한 값이 출력함 (모드 값들)
let nextListRemoteStreamsTemp = nextListRemoteStreams;
let addRenderRemoteStream = prevListRemoteStreams.slice(prevListRemoteStreams.length - 2, prevListRemoteStreams.length); // 뒤stream 리스트를 2 원소를 가짐
let prevListRemoteStreamsTemp = prevListRemoteStreams.slice(0, prevListRemoteStreams.length - 2); // 앞stream를 가진 stream를 제거함
let renderRemoteStreamsTemp = [];
let k = 0;
/*
* 현재 출력stream를 row형태로 for문 돌림
* 각 row 첫원소는 뒤 stream에서 뺀 원소 하고 기존 출력 stream를 첫운소를 추가함
* 뺸원소를 앞 stream에서 추가함
* ! 예외:
* 뒤 stream원소를 하나만 존재하는 경우에는
*/
- 만약에 addRenderRemoteStream = 1일경우 (측 추가할 stream가 하나 있는경우에)
  먼저 nextListRemoteStreams 리스트를 통해서 stream를 하나 가지고옴 (추가함)
  for 문을 이용해서 각 stream를 리스트 값을 재설정 (row 방향으로)
    - 먼저 앞 stream가 남이 있는 1 원소를 출력 stream에서 추가함
    - k 증가함
    - for 문을 이용해석 각 stream를 리스트 값을 재설정 (col 방향으로)
        if 두전째 stream라면 nextListRemoteStreams에서 추가함
        반대로 renderRemoteStreams에서 추가함

- 그렇지 않으면
  for 문을 이용해서 각 stream를 리스트 값을 재설정 (row 방향으로)
  뒤 stream 리스트에서 뺀 stream를, for문 돌릴때 마다 renderStreams에서 추가함
    - for 문을 이용해석 각 stream를 리스트 값을 재설정 (col 방향으로)
        앞에 원소인지 아닌지 체크해서 renderStreams에서 추가하거나, nextListRemotes에서 추가함

각 값들이 계산한 다음에 state에서 다시 설정

```

- handleClickNextBtn

```
- renderRemoteStreams, remoteStreams, prevListRemoteStreams, nextListRemoteStreams 값들이 출력함
- 현재 연결되고 있는 stream <= 4 또는 nextListRemoteStreams 비워있으면 무시
```

- render

```
- RemoteStreamContainerAudio
  remoteStreams : 현재 연결되고 있는 전체 stream
- HeadingVideoComponent : 헤더 출력하는 component
- UserList :
  shareScreenStream : 공유하고 있는 stream
  remoteStreams : 현재 연결되고 있는 전체 stream
- ChatComponent :
  remoteStreams : 현재 연결되고 있는 전체 stream
  isMainRoom : 호스트인지 판다 저장되는 변수
  autoFocus :
- RemoteStreamContainerShare :
  shareScreenStream={guestShareScreen} : 공유하고 있는 stream
  remoteStreams : 현재 연결되고 있는 전체 stream
- RemoteStreamContainer :
  remoteStreamsTemp={remoteStreams}
  remoteStreams={modeDefault ? renderRemoteStreams : remoteStreams} : 가운테 페이지에서 출력 stream
- TabComponent :
  handleScreamRecording : 녹화 클릭 이벤트
  handleStopSharingScreen : 녹화 중지 이벤트
  handleScreenModeMain : 화면 공유 클릭 이벤트
  handleWhiteBoard : 화이드보드 클릭 이벤트
  showUserList : 유저 리스트 클릭 이벤트
  showChatWindow : 채팅 클릭 이벤트
  handleOutRoom : 종료 버튼 클릭 이벤트
  isGuestSharingScreen : 화면 공유하고 있는지 체크하는 변수
  remoteStreams : 현재 연결되고 있는 전체 stream
```

// React LiftCycle에 따라서 설명함

1. State List

- loading: 페이지 로딩 변수

// stream 관려괸 state 값

- localStream: 자시 스트림
- audioInput: 현재 선택된 오디오 정보
  value: id
  text: 이름
- videoInput: 현재 선택된 바이디오 정보
  value: id
  text: 이름
- listAudioInput: 인식되는 오디오 리스트
- listVideoInput: 인식되는 바이디오 리스트
- remoteStreams

// 이벤트 처리하는 state 값

- peerConnections: 연결되고 있는 Peer 객체 리스트
- currentUser: 현재 유저정보

- mediaRecorder: 음성 데이터가 저장변수
- peerCount: 현재 연결되고 있는 Peer 개수

// PeerConnection Config

- pc_config: iceServers 정보 (일단 무료)
- sdpConstraints: sdp 정보

- isMainRoom: 현재 접속자가 호스트가 인지 아닌지 판단 변수
- recordedBlobs: 녹화기 위한 Blob 데이터를 저장 변수
- isGuestSharingScreen: 현재 화면공유하고 있는 아닌지 판단 변수 // 체크할 필요함
- guestShareScreen: 현재 화면공유하고 있는 아닌지 판단 변수
- shareScreen: 현재 화면공유하고 있는지 아닌지 판단 변수
- userShareScreen: 화면공뷰하고 있는 사람 정보 { 이름 및 stream}

- disconnected: 연결 끓을떄 지정 값
- fullScreen: 전체 화면 판단 변수
- paintScreen: 화이드 화면 선택시 판단
- enableRecord: 녹화되고 있는 지 판단함
- startTime: 녹화 시작 시간
- errorDevice: 기계 인식 오류 변수
- chatAutoFocus: 채팅 component focus 변수

- renderRemoteStreams: 출력 화면에서 stream 리스트
- isRemoteExistRenderRemoteStreams: 참가자가 나갔을때 출력 화면에 있으면 Flag 변수
- prevListRemoteStreams: 앞에 stream 리스트
- nextListRemoteStreams: 뒤에 stream 리스트
- currentPage: 현재 페이지
- handleSlideRemoteBtn: 버튼 클릭 이벤트 (renderRemoteStreams 변경시 충복 이벤트를 해결하기 위한)

**\* 변수 정의 \*\***
getSerder 및 getReceiver로 나눔

- getSerder (outbound-rtp) - gS로 명칭으로 부름: 다른사람한테 데이터를 보내는 통계
  - bitrate (0인경우에는 보낸 데이트가 없음)
- # getReceiver로 (inbound-rtp) - gR로 명칭으로 부름: 다른사람한테 데이터를 받은는 통계
  // 해상도 안 좋을때
  - gR bitrate 값을 모니터링하면 만약에서 1000이하 하면 해상도가 안 좋을것 동일함

=====
// Peer객체를 생성되어 어떤 유저가 stream를 전송 실패하고 어떤 유저가 stream를 전송 설공함

- case 1: Peer를 연결 시 answer 또는 offer 단계에서 연결 실패함 => stream가 안 나오시 보내는 데이터가 없는것 동일함
- case 2: ...
  => 이를 만약에서 받은 데이터가 0라면 상태반한테 일단 알람하여 재연결 요청함

=====
// 아예 로컬stream를 제대로 못해서 모든 Peer객체를 stream를 전송 못함

- case 1: 로컬 stream를 제대로 출력 못하니 연결되고 있는 Peer객체들도 stream를 아무것도 전송하지 않음
- 새로 그침 하거나 아예 localStream를 다시 생성해야 됨
