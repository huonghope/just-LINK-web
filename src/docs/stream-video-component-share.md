StreamVideoComponentShare

1. 추가 Component
2. Redux 구조
2. index.js
##### status:
Status
```
Props
- rVideoTrack : 부모 component를 track를 받아서 각 video를 출력함
- userInfo: 화면공유stream의 유저정보

##### function:
- render : `
  - 화면공유를 전달받은stream를 출력함
` 
###### React life cycle

- componentDidMount() :
```
  - 컴포넌트 노출 시 한번만 실행함, 또는 새로 고침하면 실행함.
  - video stream를 받아서 출력함
```
- componentWillReceiveProps[props] :
```
 - props부터 video 받아서 MediaStream를 생성하고 video stream 출력함
```