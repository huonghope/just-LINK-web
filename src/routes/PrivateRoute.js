import {isAuthenticated} from './permissionChecker';
import React, {useEffect} from 'react';
import {Redirect, Route} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import userAction from '../features/UserFeature/actions';
import userSelectors from '../features/UserFeature/selector';
import userService from '../features/UserFeature/service';

const PrivateRoute = ({component: Component, ...rest}) => {
  const currentUser = useSelector(userSelectors.selectCurrentUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () =>{
      if (!currentUser && isAuthenticated()) {
        // 처음에 들어 았을때 userRoomId가 존재하지 읺을떄 유저정보만 가지고 옴
        let params = {
          userRoomId: window.localStorage.getItem('usr_id'),
        };
        let response = await userService.getCurrent(params);
        const {result, data} = response;
        if (result) {
          dispatch(userAction.setCurrentUser(data));
        }
      }
    };
    fetchData();
  }, []);
  return (
    <Route
      {...rest}
      render={(props) =>
        !isAuthenticated() ? (
          <Redirect
            to={{
              pathname: '/',
              state: {from: props.location},
            }}
          />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PrivateRoute;
