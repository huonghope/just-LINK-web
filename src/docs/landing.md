Landing component
1. 추가 Component
LocalVideo : 로컬 카메라를 출력하는 Component 
SoundMeter : 음성 부분을 출력하는 Component

2. Redux 구조
- Action : 
  + setCurrentVideoId : 현재 선택된 Video Id 값을 설정함
  + setListVideoInput : 현재 인식되는 카메라 리스트 값을 설정함
  + setCurrentAudioId : 현재 선택된 Audio Id 값을 설정함
  + setListAudioInput : 현재 인식되는 오디오 리스트 값을 설정함
  + setDevices : listDetectAudioInput, selectedAudioInput, listDetectVideoInput, selectedVideoInput 값들 설정함
- Contants : 
  + SET_LIST_VIDEO : 카메라 리스트
  + SET_CURRENT_VIDEO : 선택된 카메라 id
  + SET_LIST_AUDIO : 오디오 리스트
  + SET_CURRENT_AUDIO : 선택된 오디오 id
  + SET_LIST_DEVICES : Devices 리스트
- Reducer :
  + initialState = {
      currentAudio: {}, //현재 audio id
      listAudioInput: [], // 인식되는 audio 리스트
      currentVideo: {}, //현재 video id
      listVideoInput: [],// 인식되는 video 리스트
    };
- Selector : 
  + selectCurrentVideo : 현재 선택된 video id 출력함
  + selectListVideoInput : 인식되는 video 리스트
  + selectCurrentAudio : 현재 선택된 audio id 출력함  
  + selectListAudioInput : 인식되는 audio 리스트
- Service :
  + setUpRoomForHost : 룸 기존정보를 설정
  + updatePassword : 비발번호 설정 api
  + updateNickName : 닉네임을 설정 api
  + fetJoinRoom : 룸정보를 출력 api


2. index.js 
##### function: 
- gotDevices : 
video 및 audio를 인식하여 리스트 저장함 <br>
localStorage에서 저장되고 있는 video id 및 audio id가 있는 없는지 체크함, 있으면 그 값이 선택한 값이 default 함 <br>
인식한 다음에 모든 값들이 redux를 통해서 저장함 <br>
- handleError :  <br>
stream 생성시 오류를  출력해주는 함수 <br>
- gotStream : 
stream를 받아서 출력함 <br>
redux를 통해서 stream를 저장함 (meeting 페이지를 들어가 stream를 있으면 바로 출력하고, 없으면 다시 출력함) <br>
- init : <br>
windows.stream를 통해서 모든 track를 stop를 실행함 <br>
localStorage에서 video id 및 audio id를 저장되고 있는 출력해서 (저장하지 않으면 null) <br>
contranints 값을 설정해서 stream를 생성함 (카메라 디폴트 값이 1280 * 720) 
- getAudioStream : audio를 출력하기 위한 함수
- handleChangeAudio : audio를 변경할 때 마다 audio steam 및 값이 설정함
- handleChangeMicStatus : 마이크 상태를 선택했 을 떄 on 또는 off
- handleChangeVideo : 오디오를 변경할 때 video id를 변경함
- handleJoin : 입장 클릭 시 처리하는 함수
- JoinWithHost : 호스트를 입장하는 경우 <br>
카메라 및 audio의 길이 한번 체크함, 만약에서 없으면 입장 불가능함 <br>
현 페이지에서 설정한 값이 (비밀번호, 유저룸 id, 카메라 및 오디오 상태, 닉네임) 서버한테 보냄 <br>
이상이 없면 룸을생성 성공하면 /meeting/open?room={room_name}&user={user_idx}로 입장함 <br>
그 외에 다른 오류가 있으면 alert()를 통해서 출력함
- JoinWithGuest : 게이트를 입장하는 경우 <br>
socket를 통해서 호스트를 한테 입장 요청 보냄 (요청 보내시 닉네님 및 비밀번호 같이 보냄) <br>
응답 오류 발생 시 : 호스트 offline, 비빌번호가 있는데 안 입력함, 룸을 존재하 지않음, 호스트가 입장 거절함 <br>
만약에 입장 등의했으면 입력한 정보들이 서버한테 보고, /meeting/open?room={room_name}&user={user_idx} 링크로 입장 <br>
그 외에 발생하는 오류를 출력함

