StreamVideoSlideItem

1. 추가 Component
2. Redux 구조
- Action :
  - handleChangeShareScreenState: 화면 공유 상태값을 설정
  - handleChangeShowListUserState: 유저 리스트값을 설정
  - handleChangeShowChatState: 채팅 출력 부분 설정
  - handleChangeMicState: 마이크 상태 설정
  - handleChangeCamState: 카메라 상태 설장
  - handleChangeRecordState: 녹화 상태 값을 설정
  - handChangeWhiteBoard: 캔버스 값을 설정함
- Contants :
  - CHANGE_MIC_ALL_USER_STATE :
  - CHANGE_SHARE_SCREEN_STATE :
  - CHANGE_SHOW_LIST_USER_STATE :
  - CHANGE_SHOW_CHAT_STATE :
  - CHANGE_MIC_STATE :
  - CHANGE_CAM_STATE :
  - CHANGE_SHOW_WHITEBOARD :
  - CHANGE_RECORD_STATE :
- Reducer :
  ```js
    // default true
  - initialState = {
    shareScreenState: false,
    showListUserState: false,
    showWhiteBoard: false,
    showChatState: false,
    micState: false,
    camState: true,
    recordState: false,
  };
  ```
- Selector :
  - getShareScreenState,
  - getMicAllUserState,
  - getShowListUserState,
  - getShowChatState,
  - getMicState,
  - getCamState,
  - getRecordState,
  - getWhiteBoardState,
- Service :
  - userCamStatus : 유저 카메라 값을 업데이트 API
  - userMicStatus : 유저 오디오 값을 업데이트 API

3. index.js
##### status:
Status
- showTask: Task전체 UI를 출력 여부
Props
```
- myInfo: 해당 유저 정보
- shareScreen: 화면 공유 상태
- showListUserState: 유저리스트를 출력 여부 변수
- showWhiteBoard: 캔버서를 출력 여부 변수
- showChatState: 채팅 부분을 출력 여부 변수
- micState: 오디오 출력 여부 변수
- camState: 카메라 출력 여부 변수
- numberOfNewMessages: 새로 메시지 출력 여부 변수
```

##### function:
handleChangeMicState
```
- 마이크 상태를 변경 값이 설정함
```
handleChangeCamState
```
- 카레마 상태를 변경 값이 설정함
```
handleShareScreen
```
- 화면 공유 이벤트
- 유저 타입을 체크해야 함, 화면 공유 상태를 수정해서 업데이트함
```
handleClickWhiteBoard
```
- 캔버스 이벤트
- 유저 타입을 체크해야 함
```
handleChangeShowChatState
```
- 채팅창을 출력 여부 변수
```
handleChangeShowListUserState
```
- 유저 리스트을 출력 여부 변수
```
userListLength
```
- 참여자 개수를 계산하는 함수
```
- render : `
  - 화면공유를 전달받은stream를 출력함
` 
###### React life cycle

- useEffect[numberOfNewMessages] :
```
  - 새로온 메시지 갯수 값을 설정함
```
- useEffect[shareScreen] :
```
  - 화면공유 상태 값을 설장함
```