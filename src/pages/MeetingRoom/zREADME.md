MeetingRoom Component의 복잡도 낲은 것으로 설명 추가함
// React LiftCycle에 따라서 설명함

1. State List

- loading: 페이지 로딩 변수

// stream 관려괸 state 값

- localStream: 자시 스트림
- audioInput: 현재 선택된 오디오 정보
  value: id
  text: 이름
- videoInput: 현재 선택된 바이디오 정보
  value: id
  text: 이름
- listAudioInput: 인식되는 오디오 리스트
- listVideoInput: 인식되는 바이디오 리스트
- remoteStreams

// 이벤트 처리하는 state 값

- peerConnections: 연결되고 있는 Peer 객체 리스트
- currentUser: 현재 유저정보

- mediaRecorder: 음성 데이터가 저장변수
- peerCount: 현재 연결되고 있는 Peer 개수

// PeerConnection Config

- pc_config: iceServers 정보 (일단 무료)
- sdpConstraints: sdp 정보

- isMainRoom: 현재 접속자가 호스트가 인지 아닌지 판단 변수
- recordedBlobs: 녹화기 위한 Blob 데이터를 저장 변수
- isGuestSharingScreen: 현재 화면공유하고 있는 아닌지 판단 변수 // 체크할 필요함
- guestShareScreen: 현재 화면공유하고 있는 아닌지 판단 변수
- shareScreen: 현재 화면공유하고 있는지 아닌지 판단 변수
- userShareScreen: 화면공뷰하고 있는 사람 정보 { 이름 및 stream}

- disconnected: 연결 끓을떄 지정 값
- fullScreen: 전체 화면 판단 변수
- paintScreen: 화이드 화면 선택시 판단
- enableRecord: 녹화되고 있는 지 판단함
- startTime: 녹화 시작 시간
- errorDevice: 기계 인식 오류 변수
- chatAutoFocus: 채팅 component focus 변수

- renderRemoteStreams: 출력 화면에서 stream 리스트
- isRemoteExistRenderRemoteStreams: 참가자가 나갔을때 출력 화면에 있으면 Flag 변수
- prevListRemoteStreams: 앞에 stream 리스트
- nextListRemoteStreams: 뒤에 stream 리스트
- currentPage: 현재 페이지
- handleSlideRemoteBtn: 버튼 클릭 이벤트 (renderRemoteStreams 변경시 충복 이벤트를 해결하기 위한)

**\* 변수 정의 \*\***
getSerder 및 getReceiver로 나눔

- getSerder (outbound-rtp) - gS로 명칭으로 부름: 다른사람한테 데이터를 보내는 통계
  - bitrate (0인경우에는 보낸 데이트가 없음)
- # getReceiver로 (inbound-rtp) - gR로 명칭으로 부름: 다른사람한테 데이터를 받은는 통계
  // 해상도 안 좋을때
  - gR bitrate 값을 모니터링하면 만약에서 1000이하 하면 해상도가 안 좋을것 동일함

=====
// Peer객체를 생성되어 어떤 유저가 stream를 전송 실패하고 어떤 유저가 stream를 전송 설공함

- case 1: Peer를 연결 시 answer 또는 offer 단계에서 연결 실패함 => stream가 안 나오시 보내는 데이터가 없는것 동일함
- case 2: ...
  => 이를 만약에서 받은 데이터가 0라면 상태반한테 일단 알람하여 재연결 요청함

=====
// 아예 로컬stream를 제대로 못해서 모든 Peer객체를 stream를 전송 못함

- case 1: 로컬 stream를 제대로 출력 못하니 연결되고 있는 Peer객체들도 stream를 아무것도 전송하지 않음
- 새로 그침 하거나 아예 localStream를 다시 생성해야 됨
