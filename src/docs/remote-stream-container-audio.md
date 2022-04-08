RemoteStreamContainerAudio

1. 추가 Component
2. Redux 구조
2. index.js
##### status:
Original Status
- listAudio : 각 audio component 저장함
- loading : 로딩 변수

Props Status
- remoteStreams : 해당 룸의 연결되어 있는 stream
##### function:
- AudioItem()
```
  - StreamAudioComponentSelf & StreamAudioComponentRemote 통해서 audio stream를 전달해서 출력함 (본인건이 상태방건지 구분함)
  - audioType: "localVideo" 본인stream, "remoteVideo": 상대방 stream
  - audioTrack: audio track
  - userInfo: 해당 stream의 유저정보
```
- setAudios()
```
  - 잔달받은 remoteStream를 AudioItem를 전달해서 리턴함
```
- render() 
```
  - loading 또는 remoteStream의 길이 0라면 WrapperLoading Component 출력함
  - 그렇지만 listAudio 통해서 연결되어 있는 stream를 출력함
```
###### React life cycle

- componentDidMount() :
```
  컴포넌트 노출 시 한번만 실행함, 또는 새로 고침하면 실행함
```
- componentWillReceiveProps[props] :
```
  - props부터 remoteStreams를 받아서 audio 컴포넌트를 출력함
```