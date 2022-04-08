ChatComponent

1. 추가 Component
- FileComponent : 파일을 관리하는 Component

2. Redux 구조
- Action :
  - changeDirectMessageToUser : 다이렉트 메시지를 보낼때 해당 유저한테 클릭해서 메시지를 보냄
- Contants :
  - CHAT_STATE_CHANGE : 채팅상태를 변경
- Reducer :
  ```js
  - initialState = {
  chattingState: false, // 채팅 상태
  };
  ```
- Selector :
  - selectDirectMessageToUser : 다이렉트 메시지를 보내는 유저정보를 출력함
- Service :
  - getListUser : 현재룸의 유저리스트를 호출함

3. index.js

##### status:
Original Status
- message : 메시지
- messages : 메시지 리스트

Selector Status
- listUser : 유저릐 리스트

##### function:

- scrollToBottom : 채팅 부분 scroll 부분
```
  - 현재 채팅 스크롤을 아래 끝으로 내리기위한 함수
```
- handleSubmit : 채팅 전송 버튼
```
  전달 데이터 예제
```
- FileComponentCaller : 파일 출력하는 component

```
  - type, 및 resData를 전달하여 출력함
```
- renderMessage: 메시지를 받아서 형태 맞게 출력함
```
  - text형 : MessagComponent를 통해서 일반 테스트 출력함
```
- handleClickUpFile : 파일 업데이트 1차 
```
  - 파일을 클릭하여 금지상태를 한번 체크하고 파일정보를 전달해서 2차 검토
```
- handleValueFile : 파일 업데이트 2차
```
  - 메시지창에서 선택된 파일이 업데이트함, 파일 용량이 100MB 이하 하고, png, jpg, jpeg 및 pdf, presentation만 가능함
```
- showEnlargedImage : 이미지를 올렸을때 사이즈를 확장함
```
  - 메시지에서 전달을 받는 url를 전달해서 출력함
```
- autoExpand : expand를 계산함
```
```
- render : `
  - opacity를 통해서 채팅 전체 부분 opacity 값을 설정함
` 
###### React life cycle

- useEffect[showChatState] :
```
  fetchMessages()함수를 통해서 전체 메시지를 출력함
```
- useEffect[props] :
```
  - props부터 remoteStreams를 받아서 map를 통해서 유저 Info부분만 분리하여 listUserFromRemoteStream에서 저장함
```