StreamVideoComponentSelf

1. 추가 Component
2. Redux 구조
2. index.js
##### status:
Status
```
- loading: 로딩
- showDropDownList: 하단에 출력되는 리스트
- userName: 유저 이름
```
Props
- audioTrack : 부모 component를 track를 받아서 각 audio를 출력함

##### function:
- render : `
  - localStream를 출력함
` 
###### React life cycle

- componentDidMount() :
```
  - 컴포넌트 노출 시 한번만 실행함, 또는 새로 고침하면 실행함.
  - video stream를 받아서 출력함
  - props
    + camState: 카메라 상태를 한번 체크해서 출력함
    + userInfo: 유저정보를 받아서 userName값이 설정해서 출력함
  - socket Event(): 
    + my-update-username: 유저가 이름을 변경할때
    + alert-user-speaking: 해당 유저를 말하고 있으면 표시함

```
- componentWillReceiveProps[props] :
```
  - props부터 video 받아서 MediaStream를 생성하고 video stream 출력함
  - video stream를 받아서 출력함
  - props
    + camState: 카메라 상태를 한번 체크해서 출력함
  
```