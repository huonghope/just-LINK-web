import React, {useEffect} from 'react';
import ErrorWrapper from './style';

const Error404Page = () => {
  useEffect(() => {
    localStorage.clear();
  }, []);
  return (
    <ErrorWrapper>
      <div className="exception">
        <div className="imgBlock">
          <div
            className="imgEle"
            style={{
              backgroundImage: `https://webartdevelopers.com/blog/wp-content/uploads/2018/09/404-SVG-Animated-Page-Concept.png`,
            }}
          />
        </div>
        <div className="content">
          <h1>403</h1>
          <div className="desc">현 페이지를 접근 권한이 없습니다.</div>
          {/* <div className="actions">
            <Link to="/">
              <button type="primary">홈 페이지 다시 돌아가지</button>
            </Link>
          </div> */}
        </div>
      </div>
    </ErrorWrapper>
  );
};

export default Error404Page;
