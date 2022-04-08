ChatComponent

1. 추가 Component
- FileComponent : 파일을 관리하는 Component
- List : 리스트형을 출력하는 Component

2. Redux 구조
- Action :
  - changeDirectMessageToUser : 다이렉트 메시지를 보낼때 해당 유저한테 클릭해서 메시지를 보냄
  - changeNumberOfNewMessages : 새로 온 메시지의 개수값을 설정함
  - incrementNumberOfNewMessages : 새로 온 메시지의 개수값이 하나 증가함
  - chattingStateChange : 채팅 상태를 변경함
  - disableChatUser : 특정 유저의 채팅 권한 비활성함
  - disableAllChatting : 모든 유저의 채팅 권한 비활성
- Contants :
  - CHAT_STATE_CHANGE : 채팅상태를 변경
  - DISABLE_CHAT_USER : 특정 유저으 채팅 권한 비활성함
  - DISABLE_ALL_CHAT : 모든 유저의 채팅 권한 비활성
  - NUMBER_OF_NEW_MESSAGES : 새로 이미지 개수를 세는 변수
  - INCREMENT_NEW_MESSAGES : 새로 이미지 개수를 증가함
  - DIRECT_MESSAGE_TO_USER : 특정 유저의 다이렉트 메시지
- Reducer :
  ```js
  - initialState = {
  chattingState: false, // 채팅 상태
  disableChatUser: [], // 특정한유저 채팅 비활성
  disableAllChat: false, // 모든유저 채팅 비활성
  numberOfNewMessages: 0, // 새로 온 메시지의 개수
  directMessageToUser: null, // 특정한 유저 다이렉트
  };
  ```
- Selector :
  - selectDirectMessageToUser : 다이렉트 메시지를 보내는 유저정보를 출력함
  - selectNumberOfNewMessages : 새론 온 메시지의 개수를 출력함
  - selectCurrentChattingState : 현재 채팅의 상태를 출력함
  - selectDisableChatUser : 비활성 특정한 유저의 정보를 출력함
  - selectDisableAllChat : 비활성 모든 유저의 상태값을 출력함
- Service :
  - getListUser : 현재룸의 유저리스트를 호출함
  - upFile : 파일을 업데이트하는 Api를 호출함
  - getListMessageByUserId : 특정한 유저의 메시지를 호출함
  - getRoomInfo : 룸의 정보를 호출함
  - getUserDeivceInfo : 특정한 유저의 Device의 정보를 출력함
  - getMuteAllMicForRoom : 룸의 음성 상태를 출력함
  - getTurnOffAllCamForRoom : 룸의 카메라 상태를 출력함
  - setMuteAllMicForRoom : 룸의 전체 음성 상태값을 설정함
  - setTurnOffAllCamForRoom : 룸의 전체 카메라 상태값을 설정함
  - updateUserAuth : 유저의 권함을 업데이트함

2. index.js

##### status:
Original Status
- message : 메시지
- messages : 메시지 리스트
- allDisable : 모든 유저 채팅 비활성
- boxedListUser : 유저으 리스트 박스
- disableChatUser : 채팅 비활성 유저
- disableChatInput : 채팅 부분이 비활성의 상태
- imageZoom : 이미지의 사이즈를 확정함
- selectedImage : 특정한 이미지를 설정함
- chatContentHeight : 채팅 부분의 높이
- chatFormHeight : 채팅 component의 높이
- textareaHeight : 채팅 내용의 높이
- usernameString : 유저 이름
- userNumber : 유저의 개수
- opacity : 채팅 부분의 Opacity
- inputBackground : 입력 부분 백그라운드

Selector Status

- listUser : 유저릐 리스트
- showChatState : 채팅의 상태
- directMessageToUser : 다이렉트 메시지를 특정한 유저

##### function:

- scrollToBottom : 채팅 부분 scroll 부분

```
  - 현재 채팅 스크롤을 아래 끝으로 내리기위한 함수
  - getElementById를 통해서 chatList id를 출력해서 chat.scrollTop를 설정함
```

- handleSubmit : 채팅 전송 버튼

```
  전달 데이터 예제
  const payload = {
    type: 'text',
    message: {
      sender: {
        uid: getToken().userId,
        username: userName(),
        user_type: props.userType,
      },
      receiver: {},
      data: {text: message},
    },
  };
  - 함수에 들어갈떄 derect 메시지를 보내는건지 체크함
```

- FileComponentCaller : 파일 출력하는 component

```
  - type, 및 resData를 전달하여 출력함
```

- renderMessage: 메시지를 받아서 형태 맞게 출력함
```
  - text형 : MessagComponent를 통해서 일반 테스트 출력함
  - file형 : FileComponentCaller를 통해서 전송되는 파일 출력함
  모든 유형에 따라서 div의 구촉을 한 다음에 출력함
```
- handleClickUpFile : 파일 업데이트 1차 
```
  - 파일을 클릭하여 금지상태를 한번 체크하고 파일정보를 전달해서 2차 검토
```
- handleValueFile : 파일 업데이트 2차
```
  - 메시지창에서 선택된 파일이 업데이트함, 파일 용량이 100MB 이하 하고, png, jpg, jpeg 및 pdf, presentation만 가능함
  - 유저정보도 추가해서 api를 통해서 데이트를 전송함 (FormData로 전송함)
```
- showEnlargedImage : 이미지를 올렸을때 사이즈를 확장함
```
  - 메시지에서 전달을 받는 url를 전달해서 출력함
```
- autoExpand : expand를 계산함
```
```
- handleChangeShowChatState : 채팅의 상태를 설정하는 함수
- render : `
  - opacity를 통해서 채팅 전체 부분 opacity 값을 설정함
  - 선택되는 이미지가 있는지 없는지 체크해서 출력함
  - 유저의이름 및 참여자의 갯수를 출력함 
  - setOpacity()를 통해서 채

` 
###### React life cycle

- useEffect[showChatState] :

```
  fetchMessages()함수를 통해서 전체 메시지를 출력함
  result값을 통해서 api를 호출 오류가 있는 체크함
  try-catch를 통해서 데이터를 저장 체크함
```

- useEffect[props] :

```
- props부터 remoteStreams를 받아서 map를 통해서 유저 Info부분만 분리하여 listUserFromRemoteStream에서 저장함
- listUserFromRemoteStream에서를 map를 통해서 유저이름을 결합함
- 유저의 개수를 설장함
- scrollToBottom()를 실행함
```

- useEffect[] :

```
- ref를 통해서 입력한 부분이 focus
- getSocket().on('alert-user-warning') : 사용자에게 경고 메시지 전달 받음
- getSocket().on('alert_user_disable_chat') : 사용자한테 채팅 비활성 전달 받음
- getSocket().on('res-sent-files') : 파일을 전달했을 떄
- getSocket().on('res-sent-message') : 일반 메시지를 받았을 떄
- getSocket().on('action_user_disable_chat') : 특정 유저에게 채팅 금지 액션이 받았을 떄
```
