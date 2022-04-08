RemoteStreamContainerAudio

1. 추가 Component
2. Redux 구조
2. index.js
##### status:
Original Status
- rVideos : 화면공유 stream를 출력함
- loading : 로딩 변수
- viewListRemote : 연결되어 있는 stream의 video 리스트를 보기 여부
- loadingStream : Video의 출력 delay

Props Status
- remoteStreams : 해당 룸의 연결되어 있는 stream
- shareScreenStream : 화면 공유하고 있는 stream
##### function:
- handleClickViewListRemote()
```
  - 하단에 전체 stream를 출력 여부 클릭함
```
- SlideRemoteStream()
```
  - 현재 연결되어 있는 전체 stream를 받아서 slide형태로 출력함
  - 화면 공유하고 있는 stream를 제외하고 출력함
  - userInfo.user_idx === currentUser.user_idx를 통해서 해당 stream를 어떤 사람인지 구분해서 정보를 출력함
  - onClickPrevSlide() 전에 stream를 보기 클릭함
  - onClickNextSlide() 앞에 stream를 보기 클릭함
```
- StreamVideoSlideItemInfoSelf()
```
  - 해당 출력 stream의 정보를 출력함 (본인)
  - audio상태를 같이 출력해함
```
- StreamVideoSlideItemInfoOther() 
```
  - 해당 출력 stream의 정보를 출력함 (상대방)
```
- SetVideos()
```
  - 전달받은 화면공유 stream를 StreamVideoComponentShare를 통해서 출력함
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
  - props부터 remoteStreams를 받아서 video 컴포넌트를 출력함
```