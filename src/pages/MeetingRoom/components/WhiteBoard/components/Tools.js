import React, {useEffect, useRef, useState} from 'react';
import EventBus from '../events/EventBus';
import whiteBoardService from '../WhiteBoardService';
import fileUploadEl from '../components/WhiteBoard';
import Draggable from 'react-draggable';

import ToolStore, {
  // POINTER, PEN, LINE, ELLIPSE, RECT,
  // not level
  SELECT,
  TEXT,
  DRAW,
  ERASER,
  LINE,
  LINE_THINK,
  LINE_MEDIUM,
  LINE_BOLD,
  LINE_DASH,
  FIGURE,
  FIGURE_REC_LINE,
  FIGURE_ELLIPSE_LINE,
  FIGURE_TRIANGLE_LINE,
  FIGURE_REC_FILL,
  FIGURE_ELLIPSE_FILL,
  FIGURE_TRIANGLE_FILL,
  COLOR,
  COLOR_WHITE,
  COLOR_SUNGLOW,
  COLOR_RED,
  COLOR_PURPLE,
  COLOR_BLUE,
  COLOR_ROYAl_BLUE,
  COLOR_SHAMROCK,
  COLOR_BLACK,
  RESET,
  RESET_CANCEL,
  DEL,
  UPLOAD,
  BRUSH,
  // DEL_ALL,
  // DEL_MY,
  // DEL_OTHER,
  // have level
  // CHECK,
  // CHECK_ARROW,
  // CHECK_CHECK,
  // CHECK_X,
  // CHECK_START,
  // CHECK_HEART,
  // CHECK_QUESTION,
  // TAG,
  SAVE,
  BOARD_HIDDEN,
} from '../constants/ToolStore';
import Upload from '../shapes/Upload';
import {saveSvgAsPng} from 'save-svg-as-png';
import Icon from '../../../../../constants/icons';
// import ColorPicker from "./ColorPicker"
import './tools.scss';

export default function Tools() {
  const [tools, setTools] = useState([
    {
      id: SELECT,
      label: Icon.selectIcon,
      type: 'select',
      child: [],
      text: '선택',
    },
    {id: TEXT, label: Icon.textIcon, type: 'text', child: [], text: '텍스트'},
    {
      id: DRAW,
      label: Icon.drawIcon,
      type: 'draw',
      child: [],
      text: '그리기',
      selected: true,
    },
    {
      id: ERASER,
      label: Icon.eraserIcon,
      type: 'eraser',
      child: [],
      text: '지우개',
    },
    {
      id: LINE,
      label: Icon.lineIcon,
      type: 'line',
      child: [
        {id: LINE_THINK, label: Icon.lineThinkIcon, type: 'link-think'},
        {id: LINE_MEDIUM, label: Icon.lineMediumIcon, type: 'link-medium'},
        {id: LINE_BOLD, label: Icon.lineBoldIcon, type: 'link-bold'},
        {id: LINE_DASH, label: Icon.lineDashIcon, type: 'link-dash'},
      ],
      text: '선',
    },
    {
      id: FIGURE,
      label: Icon.figureIcon,
      type: 'figure',
      child: [
        {
          id: FIGURE_REC_LINE,
          label: Icon.figureRecLineIcon,
          type: 'figure-rec-line',
        },
        {
          id: FIGURE_ELLIPSE_LINE,
          label: Icon.ellipseLineIcon,
          type: 'figure-ellipse-line',
        },
        {
          id: FIGURE_TRIANGLE_LINE,
          label: Icon.triangleLineIcon,
          type: 'figure-triangle-line',
        },
        {
          id: FIGURE_REC_FILL,
          label: Icon.figureRecFillIcon,
          type: 'figure-rec-fill',
        },
        {
          id: FIGURE_ELLIPSE_FILL,
          label: Icon.ellipseFillIcon,
          type: 'figure-ellipse-fill',
        },
        {
          id: FIGURE_TRIANGLE_FILL,
          label: Icon.triangleFillIcon,
          type: 'figure-triangle-fill',
        },
      ],
      text: '도형',
    },
    {
      id: COLOR,
      label: Icon.colorIcon,
      type: 'color',
      child: [
        {id: COLOR_WHITE, label: '#ffffff', type: 'color-white'},
        {id: COLOR_SUNGLOW, label: '#ffbd32', type: 'color-sunglow'},
        {id: COLOR_RED, label: '#fb1d1d', type: 'color-red'},
        {id: COLOR_PURPLE, label: '#f153ff', type: 'color-purple'},
        {id: COLOR_BLUE, label: '#3ec0ff', type: 'color-blue'},
        {id: COLOR_ROYAl_BLUE, label: '#3f65e0', type: 'color-royal-blue'},
        {id: COLOR_SHAMROCK, label: '#3ac084', type: 'color-shamrock'},
        {id: COLOR_BLACK, label: '#000000', type: 'color-black'},
      ],
      text: '색상',
    },
    {
      id: UPLOAD,
      label: Icon.uploadIcon,
      type: 'Upload',
      child: [],
      text: '사진',
    },
    {
      id: BRUSH,
      label: Icon.laserIcon,
      type: 'brush',
      child: [],
      text: 'laser-pen',
    },

    {
      id: RESET,
      label: Icon.resetIcon,
      type: 'reset',
      child: [],
      text: '재실행',
    },
    {
      id: RESET_CANCEL,
      label: Icon.resetCancelIcon,
      type: 'reset-cancel',
      child: [],
      text: '실행취소',
    },
    {
      id: DEL,
      label: Icon.delIcon,
      type: 'del',
      child: [
        // {
        //   id: DEL_ALL,
        //   label: Icon.lineIcon,
        //   type: "del-all",
        //   text: "모두 지우기"
        // },
        // {
        //   id: DEL_MY,
        //   label: Icon.lineIcon,
        //   type: "del-my",
        //   text: "내 도로잉 지우기"
        // },
        // {
        //   id: DEL_OTHER,
        //   label: Icon.lineIcon,
        //   type: "del-other",
        //   text: "학생 도로잉 지우기"
        // }
      ],
      text: '지우기',
    },
    // {
    //   id: CHECK,
    //   label: Icon.checkIcon,
    //   type: "check",
    //   child: [
    //     { id: CHECK_ARROW, label: Icon.checkArrowIcon, type: "check-arrow" },
    //     { id: CHECK_CHECK, label: Icon.checkCheckIcon, type: "check-check" },
    //     { id: CHECK_X, label: Icon.checkXIcon, type: "check-x" },
    //     { id: CHECK_START, label: Icon.checkStartIcon, type: "check-start" },
    //     { id: CHECK_HEART, label: Icon.checkHeartIcon, type: "check-heart" },
    //     {
    //       id: CHECK_QUESTION,
    //       label: Icon.checkQuestionIcon,
    //       type: "check-question"
    //     }
    //   ],
    //   text: "스탬프"
    // },
    // { id: TAG, label: Icon.tagIcon, type: "tag", child: [], text: "태그" },
    {id: SAVE, label: Icon.saveIcon, type: 'save', child: [], text: '저장'},
    {
      id: BOARD_HIDDEN,
      label: Icon.boardHidden,
      type: 'board-hidden',
      child: [],
      text: '숨기기',
    },
  ]);

  useEffect(() => {
    localStorage.setItem('history', 0);
    ToolStore.subscribe(() => {
      const _toolsTemp = tools.map((tool) => ({
        ...tool,
        selected: ToolStore.tool === tool.id,
      }));
      setTools(_toolsTemp);
    });
  }, []);
  const handleSaveAs = () => {
    const fnCurrentTime = () => {
      let _now = new Date();
      let year = _now.getFullYear();
      let month = _now.getMonth() + 1;
      let date = _now.getDate();
      let hour = _now.getHours();
      let minutes = _now.getMinutes();
      let seconds = _now.getSeconds();
      if (10 > date) date = '0' + date;
      if (10 > _now.getMinutes()) minutes = '0' + minutes;
      return (
        date + '' + month + '' + year + '' + hour + '' + minutes + '' + seconds
      );
    };
    saveSvgAsPng(
        document.getElementById('whiteBoard'),
        `${fnCurrentTime()}.png`,
        {backgroundColor: 'ffffff'},
    );
  };
  // const handleValueFile = (e) => {
  //   // const { name, size, type } = e.target.files[0];
  //   // let params = {
  //   //   userRoomId: userRoomId(),
  //   // };
  //     let data = new FormData();
  //     data.append('file', URL.createObjectURL(e.target.files[0]));

  // };

  const userRoomId = () => {
    return JSON.parse(window.localStorage.getItem('usr_id'));
  };
  // const forceUpdate = React.useCallback(() => updateState({}), [])
  const [imageUrl, setImageUrl] = useState(false);
  const [image, setImage] = useState([]);
  const [images, setImages] = useState([]);
  const [del, setDel] = useState(false);
  const [height, setHeight] = useState(400);
  const [width, setWidth] = useState();
  const [top, setTop] = useState();
  const [left, setLeft] = useState();
  const [display, setDisplay] = useState(false);
  const [rotateAngle, setRotateAngle] = useState();
  // const forceUpdate = React.useCallback(() => updateState({}), [])
  const handleDrag = (deltaX, deltaY) => {
    setLeft({
      left: left + deltaX,
    });
    setTop({
      top: top + deltaY,
    });
  };

  const increaseButton = () => {
    setHeight(height + 100);
  };

  const decreaseButton = () => {
    setHeight(height - 100);
  };

  const handleToggleDisplay = () => {
    setDisplay(!display);
  };

  const handleClickOutside =()=>{
    // if(display) {
    //   setDisplay(null);
    // }
    // handleToggleDisplay();
    // event.stopPropagation();
  // if(handleToggleDisplay){
  //   setDisplay(false);
  //   // setDisplay(!display);
  // }
  // else{
  //   return handleToggleDisplay
  // }
  };
  const handleValueFile = async (e) => {
    // const { name, size, type } = e.target.files[0];
    let params = {
      userRoomId: userRoomId(),
    };
    const {size} = e.target.files[0];
    if (size / 1000000 < 200) {
      let data = new FormData();
      data.append('file', e.target.files[0]);
      data.append('params', JSON.stringify(params));
      const response = await whiteBoardService.upFile(data);
      const {data: resData} = response;
      const {fileInfo} = resData;
      setImageUrl(fileInfo.path);
      window.imageUrl = fileInfo.path;
      setImageUrl(fileInfo.path);
      // window.imageUrl = fileInfo.path
      // else {
      //   alert("파일 공유 용량제한이 100MB이하 입니다.")
      // }
    }
    // data.append("file", e.target.files[0])
    // data.append("params", JSON.stringify(params))

    // forceUpdate();
  };

  // Delete button
  const DeleteButton = () => {
    // setImageUrl(null);
    document.addEventListener('click', function(event) {
      event.target.parentNode.removeChild(event.target);
    });
  };

  const handleClickUpFile = () => {
    // 채팅 금지된 사용자는 이용 불가
    // 임시 input 엘리먼트 생성
    const upFile = document.createElement('input');
    // 타입은 파일 올리는 걸로
    upFile.setAttribute('type', 'file');

    // name 속성은 file
    upFile.setAttribute('name', 'file');
    // 보이지는 않게
    // upFile.setAttribute('style', 'display: none');

    // upFile.setAttribute('accept', 'image/*');
    // upFile.setAttribute('alt', 'na');
    // body에 추가
    document.body.appendChild(upFile);
    // document.getElementById("res").appendChild(upFile);
    // 클릭하여 파일 고르게 하기
    upFile.click();

    // 파일이 선택되면 작동하는 콜백 함수 선택
    upFile.onchange = handleValueFile;
    // upFile.onclick = handleOnClick;
  };

  const handleClickImage = async (e, image) => {
    e && e.preventDefault();

    setImage(image);
    // setImage({
    //   image: this.state.index+1
    // });
  };
  const drawImage = () => {
    fileUploadEl.current.click();
  };

  const onResize = () => {
    setHeight(height);
    setWidth(width);
  };

  let prevConunt = useRef(Number(localStorage.getItem('history')));
  // var prevConunt = Number(localStorage.getItem('history'));

  useEffect(() => {
    prevConunt.current = Number(localStorage.getItem('history'));
  }, [localStorage.getItem('history')] - 1);

  const handleClickTool = (type, index, key) => {
    // Save Event
    if (type === 'Save') {
      handleSaveAs();
      return;
    }

    if (type === 'Upload') {
      // Upload();

      handleClickUpFile();
      // fileChange()

      // return;
    }

    // 툴이 숨기는 기능
    if (type === 'Board_hidden') {
      setHidden(!hidden);
    }

    // if(type==="Eraser"){
    //   EventBus.emit(EventBus.DEL)
    // }

    // 재실행
    if (type === 'Reset') {
      EventBus.emit(EventBus.REDO);
      if (!setImageUrl(null)) {
        setImageUrl(imageUrl);
      }
      // if(setImageUrl(null)){
      //   setImageUrl(imageUrl)
      // }
    }

    // 실행 취소
    if (type === 'Reset_cancel') {
      EventBus.emit(EventBus.UNDO);
      // if(setImageUrl(null)){
      //   setImageUrl(imageUrl)
      // }
      if (setImageUrl(null)) {
        setImageUrl(imageUrl);
      }
    }
    if (type == 'Brush') {
      EventBus.emit(EventBus.DEL);
    }

    // 전체 지우기
    if (type === 'Del') {
      EventBus.emit(EventBus.DEL);
      setImageUrl(null);
    }

    // Color Change Event
    if (type === 'Color') {
      const filter = tools.filter((tool) => tool.id === type)[0];
      const {child} = filter;
      const tool = child[index];
      EventBus.emit(EventBus.COLOR_CHANGE, tool.label);
      return;
    }

    // if(type === 'brush'){
    //   const filter = tools.filter((tool) => tool.id === type)[0];
    //   const {child} = filter;
    //   const tool = child[index];
    //   EventBus.emit(EventBus.COLOR_CHANGE, !tool.label);
    // }

    const filter = tools.filter((tool) => tool.id === type)[0];
    if (filter.child.length !== 0) {
      // Click Parent Event - default 첫번쨰요소
      if (key) {
        EventBus.emit(EventBus.TOOL_CHANGE, filter.child[0].id);
      } else {
        const {child} = filter;
        const tool = child[index];
        EventBus.emit(EventBus.TOOL_CHANGE, tool.id);
      }
    } else {
      EventBus.emit(EventBus.TOOL_CHANGE, tools[index].id);
    }
  };
  const [hidden, setHidden] = useState(false);
  const [current, setCurrentTool] = useState();
  const checkCurrentTool = (toolId) => {
    setCurrentTool(toolId);
  };
  // const fileChange = (ev) => {
  //   let file = ev.target.files[0];
  //   let reader = new FileReader();
  //   reader.addEventListener(
  //     "load",
  //     () => {
  //       const id = uuidv1();
  //       images.push({
  //         content: reader.result,
  //         id
  //       });
  //       setImages(images);
  //       fileUploadEl.current.value = null;
  //       shapes.push(id);
  //       setShapes(shapes);
  //       forceUpdate();
  //     },
  //     false
  //   );
  //   if (file) {
  //     reader.readAsDataURL(file);
  //   }
  // };
  // console.log(`${process.env.REACT_APP_SERVER_API}$/{imageUrl}`)

  // const ResizableContent = (props) => {
  //   const [width, setWidth] = useState(props.width);
  //   const [height, setHeight] = useState(props.height);
  //   const [top, setTop] = useState(props.top);
  //   const [left, setLeft] = useState(props.left);
  //   const [rotateAngle, setRotateAngle] = useState(props.rotateAngle);

  //   const contentStyle = {
  //     top,
  //     left,
  //     width,
  //     height,
  //     position: "absolute",
  //     transform: `rotate(${rotateAngle}deg)`
  //   };

  //   const handleResize = (style, isShiftKey, type) => {
  //     const { top, left, width, height } = style;
  //     setWidth(Math.round(width));
  //     setHeight(Math.round(height));
  //     setTop(Math.round(top));
  //     setLeft(Math.round(left));
  //   };

  //   const handleRotate = (rotateAngle) => {
  //     setRotateAngle(rotateAngle);
  //   };

  //   const handleDrag = (deltaX, deltaY) => {
  //     setLeft(left + deltaX);
  //     setTop(top + deltaY);
  //   };
  console.log(`${process.env.REACT_APP_SERVER_API}/${imageUrl}`);
  // const ref = useRef();
  // useEffect(() => {
  //   const checkIfClickedOutside = (e) => {
  //     // If the menu is open and the clicked target is not within the menu,
  //     // then close the menu
  //     if (display && ref.current && !ref.current.contains(e.target)) {
  //       setDisplay(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", checkIfClickedOutside);

  //   return () => {
  //     // Cleanup the event listener
  //     document.removeEventListener("mousedown", checkIfClickedOutside);
  //   };
  // }, [display,ref ]);

  return (

    <div className="tools-list" onMouseDown={()=>handleClickOutside()}>
      <div className={hidden ? 'hidden' : 'full'}>
        {tools.length !== 0 && hidden ? (
          <div>
            <button
              className={'tool-parent'}
              onClick={() => setHidden(!hidden)}
            >
              <img src={Icon.boardDisplay} alt="view" />
              <p>보기</p>
            </button>
          </div>
        ) : (
          tools.map((tool, idx, imageUrl) => (
            <ToolWrapperCom
              index={idx}
              tool={tool}
              current={current}
              activeClass={current === tool.id}
              hidden={hidden}
              imageUrl={imageUrl}
              handleClickTool={handleClickTool}
              checkCurrentTool={checkCurrentTool}
            />
          ))
        )}
      </div>

      {/* Changed the code the other side */}
      <div className="image">
        <div>
          {imageUrl && (
            <Draggable>
              <div>
                <div className="user-more-options-list-whiteboard" onClick={() =>handleToggleDisplay()}>
                  {/* <i class="fa fa-colon"></i> */}
                  <i className="fa fa-ellipsis-v" aria-hidden="true" onClick={() => handleToggleDisplay()}></i>
                </div>
                {display &&
              <div className="user-more-options-list2">
                <ul>
                  <li onClick={() => increaseButton()}>
                    <i className="fa fa-search-plus"></i> 확대
                  </li>
                  <li onClick={() => decreaseButton()}>
                    <i className="fa fa-search-minus"></i> 축소
                  </li>
                  <li onClick={() => setImageUrl(null)}>
                    <i className="fa fa-trash"></i> 삭제
                  </li>
                </ul>
              </div>
                }
                <div className="img-border">
                  <img
                    src={`${process.env.REACT_APP_SERVER_API}/${imageUrl}`}
                    width={width}
                    height={height}
                    style={{
                      position: 'relative',
                      // overflow: "hidden",
                      // margin: "50px",
                      display: 'hidden',
                      marginleft: 'auto',
                      marginright: 'auto',
                      cursor: 'move',
                      onhover: 'blue',
                    }}
                  />
                </div>
                <ul>
                </ul>
              </div>
            </Draggable>
          )}
        </div>
      </div>
    </div>
  );
}

const ToolWrapperCom = ({
  tool,
  handleClickTool,
  index,
  current,
  activeClass,
  checkCurrentTool,
}) => {
  const [display, setDisplay] = useState(false);
  useEffect(() => {
    setDisplay(activeClass);
  }, [current]);
  const handleOnClick = () => {
    checkCurrentTool(tool.id);
    if (tool.child.length !== 0) {
      handleClickTool(tool.id, index, 'parent');
      setDisplay(!display);
    } else {
      handleClickTool(tool.id, index);
      setDisplay(!display);
    }
  };
  return (
    <div className="tool">
      <button
        className={tool.selected ? 'tool-parent selected' : 'tool-parent'}
        onClick={() => handleOnClick()}
      >
        <img src={tool.label} alt="tool" />
        <p>{tool.text}</p>
      </button>
      {display && tool.child.length !== 0 && (
        <div className={`tool-childs ${tool.type}`}>
          {tool.type === 'del' ?
            tool.child.map((child, idx) => (
              <p
                onClick={() => {
                  handleClickTool(tool.id, idx);
                  setDisplay(!display);
                }}
              >
                {child.text}
              </p>
            )) :
            tool.type === 'color' ?
            tool.child.map((child, idx) => (
              <button
                onClick={() => {
                  handleClickTool(tool.id, idx);
                  setDisplay(!display);
                }}
                style={
                    child.label === '#000000' ?
                      {borderColor: 'white', background: child.label} :
                      {background: child.label}
                }
              ></button>
            )) :
            tool.child.map((child, idx) => (
              <button
                onClick={() => {
                  handleClickTool(tool.id, idx);
                  setDisplay(!display);
                }}
              >
                <img src={child.label} alt="tool" />
              </button>
            ))}
        </div>
      )}
    </div>
  );
};
