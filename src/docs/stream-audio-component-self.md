StreamAudioComponentSelf

1. 추가 Component

2. Redux 구조
2. index.js

##### status:
Props
- audioTrack : 부모 component를 track를 받아서 각 audio를 출력함

##### function:
- SoundMeter()
```
  - 유저를 말하고 있는지 인식해서 다른사람한테 알람
  - 
```
- render : `
  - audio 태크를 통해서 audio를 출력함
` 
###### React life cycle

- componentDidMount() :
```
  컴포넌트 노출 시 한번만 실행함, 또는 새로 고침하면 실행함
```
- componentWillReceiveProps[props] :
```
  - props부터 audioTrack 받아서 MediaStream를 생성하고 audioStream를 출력함
  - 그리고 자기가 오디오 상태를 변경할 떄 audio 상태를 업데이트함 (유저 및 props 상태 체크함), stream[0].enabled 상태 변경함
  - roomReconrdInfo: 녹화되는 상태에서
  - useEffect((), [audioTrack]) 일반적함
```