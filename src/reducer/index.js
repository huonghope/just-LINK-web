import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';
import user from '../features/UserFeature/reducer';
import room from '../pages/MeetingRoom/MeetingRoom.Reducer';
import tabComponent from '../pages/MeetingRoom/components/TabComponent/TabComponent.Reducer';
import headingVideoComponent from '../pages/MeetingRoom/components/HeadingVideoComponent/HeadingVideoComponent.Reducer';
import userListComponent from '../pages/MeetingRoom/components/UserList/UserList.Reducer';
import remoteStream from '../pages/MeetingRoom/components/RemoteStreamContainer/RemoteStreamContainer.Reducer';
import chat from '../pages/MeetingRoom/components/ChatComponent/ChatComponent.Reducer';
import landingPage from '../pages/LandingPage/LandingPage.Reducer';

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    user,
    tabComponent,
    remoteStream,
    userListComponent,
    room,
    chat,
    landingPage,
    headingVideoComponent,
  });
