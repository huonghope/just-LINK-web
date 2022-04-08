StreamVideoSlideItem

1. 추가 Component
  - UserListItem: 유저별 출력하는 Component
2. Redux 구조
- Action :
  - handleFixUser: 특정 유저를 고정함
- Contants :
  - SET_FIX_USER : 특정 유저를 고정함
- Reducer :
  ```js
  initialState = {
    fixUser: null,// 유저 리스트
  };
  ```
- Selector :
  - fixUser : 고정한 유저의 정보를 출력함
- Service :
2. index.js
##### status:
Status
```
- connectingUsers: 유저 연결되어 있는지
- filterConnectingUsers: 검색 시 결과를 나오는 유저리스트 저장함
- isShowMoreUser: 하단에 추가 기능 옵션 부분 출력 여부
- userFilter: 특정 검색 나오는 유저의 정보
```
Props
- remoteStreams: 현재 연결되어 있는 stream 

##### function:
- handleUserFix: 
```
- 유저 id를 받아서 유저리스트 순서를 다시 설정함
```
- showUserSearchResult:
```
- 검색해서 나오는 유저의 정보를 저장함
```
- render : `
  - 화면공유를 전달받은stream를 출력함
` 
###### React life cycle

- useEffect[remoteStreams] :
```
  - 전달받은 전체 stream를 받아서 유저정보를 분리함
  - 유저정보를 분리해서 저장함
```