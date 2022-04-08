HeadingVideoComponent

1. 추가 Component
- DialogContainer: 
- DialogDeviceComponent: 
- DialogMode:
- DialogRoomInfoComponent:
- RecordSupport: 

2. Redux 구조
- Action :
  - handleChangeSetMode: // 모델모드를 설정
- Contants :
  - CHANGE_SET_MODE: // 모델모드를 설정
- Reducer :
  ```js
  - initialState = {
  mode: '2x2' // 현재 출력되고 있는 화면 모델 모드
  };
  ```
- Selector :
  - getLocalStreamMicState : 로컬의 마이크 상태를 출력함
- Service :
2. index.js

##### status:
Original Status
- showSplitOption : 출력화면에서 하단부분을 출력됨
- userType : 유저 타입
- ref : 외부에서 하단부분을 클릭 시 창을 닫기 기능

Selector Status
- myInfo : 유저의 정보

##### function:
###### React life cycle

- useEffect[myInfo] :

```
- 유저의 정보를 받아서 설정함
```
- useEffect[showSplitOption] :

```
- 외부에 클릭해도 하단부분이 닫을 도록
```
