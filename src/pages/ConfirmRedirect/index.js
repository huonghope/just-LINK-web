import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import './style.scss';

import Loading from '../../components/Loading';
import {fetchSignIn, fetchSignInWithLink} from './ConfirmRedirect.Service';
import userUtils from '../../features/UserFeature/utils';
import {isMobile} from 'react-device-detect';
import Errors from '../../components/Error/error';

import qs from 'query-string';

/**
 * 이 Component는 처음에 접근자를 구분해서 인증을 함
 * 만약에서 redirect_key, sl_idx, user_idx 인 존재하는 유저라면 LMS부터 또는 회원유저임
 * 그렇지 않으면 초대 링크를 통해서 들어가는유저임
 */
function ConfirmRedirect(props) {
  const dispatch = useDispatch();
  const query = qs.parse(window.location.search.slice(1));
  useEffect(() => {
    const init = async () => {
      localStorage.clear();
      const {redirect_key, sl_idx, user_idx, link} = query;
      if (redirect_key && sl_idx && user_idx) { // 정상 회원으로 들어감
        try {
          const userInfo = {redirect_key, sl_idx, user_idx};
          const response = await fetchSignIn(userInfo);
          const {result} = response;
          // 해당 정보로 인증 성공함
          if (result) {
            window.localStorage.setItem('asauth', JSON.stringify(response.data));
            window.localStorage.setItem('redirect_key', redirect_key);
            window.localStorage.setItem('sl_idx', sl_idx);
            props.history.push('/meeting');
          } else {
            alert('정보를 인증 실패합니다');
            props.history.push('/401');
          }
        } catch (error) {
          Errors.handle(error);
        }
      } else if (link) { // link부터 들어가는유저
        const userInfo = userUtils.getUserInfo();
        window.localStorage.setItem('link', link);
        // 링크를 들어가지만 localStorage에서 유저정보를 저장되고 있을 때
        let userInfoParameter;
        if (userInfo) {
          const {userId} = userInfo;
          userInfoParameter = {
            user_idx: userId,
            link: link,
          };
        } else { // localStorage don't save user info
          userInfoParameter = {
            link: link,
          };
        }
        const response = await fetchSignInWithLink(userInfoParameter);
        const {result}= response;
        // 해당 정보로 인증 성공함
        if (result) {
          window.localStorage.setItem('asauth', JSON.stringify(response.data));
          props.history.push('/meeting');
        } else {
          alert('정보를 인증 실패합니다');
          props.history.push('/401');
        }
      }
      else {
        // url부터 받은값이 아무것도 없을떄
        props.history.push('/401');
      }
    };
    init();
  }, []);
  return (
    <div className="create-room">
      <Loading type={'bars'} color={'white'} />
    </div>
  );
}

export default ConfirmRedirect;
