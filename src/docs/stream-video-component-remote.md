StreamVideoComponentRemote

1. 추가 Component
2. Redux 구조
2. index.js
##### status:
Status
```
- loading: 로딩
- remoteCamStatus: 카메라 상태
- showDropDownList: 하단에 출력되는 리스트
- isSpeak: 음성 인식 표시함
```
Props
- audioTrack : 부모 component를 track를 받아서 각 audio를 출력함

##### function:
- StateList(): stream를 개별에 하단에 표시하는부분임
```
  - localUserInfo: 로컬의 유저 정보
  - userInfo: 해당 stream의 유저정보
  - socket: 해당 stream를 Id
  - mic: 해당 stream를 음성 상태
  - uuserName: 해당 stream의 유저 이름
  - useEffect[userInfo] :
    socket event 
    + alert-user-change-device-status: 해당 유저가 기계를 수정하면
    + update-username: 해당 유저가 이름을 수정하면
  - useEffect[peerConnections, userInfo]:
    - peerConnections 및 socketId를 통해서 개별 peer연결되어 있는 객체 분리해서 저장함
  - useEffect[showDropDownList]: 하단부분을 외부에 클릭해서 단을 도락함
  - handleUserKick(): 특정한 유저를 강퇴함
    + emitHandleUserKick() 실행
  - handleResolution(): 특정한 유저의 해상도를 올리는 것을 요청함
    + edit-stream-slide-user: 실행
  - Direct 메시지를 보내기
  - 강퇴하기
  - 해상도 요청
```
- render : `
  - 각 연결되고 있는 유저 stream를 출력함
` 
###### React life cycle

- componentDidMount() :
```
  - 컴포넌트 노출 시 한번만 실행함, 또는 새로 고침하면 실행함.
  - video stream를 받아서 출력함
  - props
    + userInfo를 통해서 해당유저의 카메라 출력함
  - socket Event(): 
    + alert-user-change-device-status: 해당 유저를 카메라의 상태를 변경하면 반영함
    + alert-user-speaking: 해당 유저를 말하고 있으면 표시함

```
- componentWillReceiveProps[props] :
```
  - props부터 video 받아서 MediaStream를 생성하고 video stream 출력함
  - listUserBadNetwork를 통해서 네트워크를 안 좋은 유저의 값이 카마라를 사진으로 표시함
  
```