StreamAudioComponentRemote

1. 추가 Component

2. Redux 구조
2. index.js

##### status:
Props
- audioTrack : 부모 component를 track를 받아서 각 audio를 출력함

##### function:
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
```