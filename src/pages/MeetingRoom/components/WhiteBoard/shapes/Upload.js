// import React, { useEffect, useRef, useState } from "react"
// import "../style.scss"
// import TextareaAutosize from "react-autosize-textarea"
// import whiteBoardService from "../WhiteBoardService"


// export default class Upload extends React.Component {
//   // const userRoomId = () => {
//   //     return JSON.parse(window.localStorage.getItem('usr_id'));
//   //   }
//   // 현재 text 및 focused 상태
//    Image() {
//     const [imageUrl, setImageUrl] = useState(null)
//     const [image, setImage] = useState(null)
//     const userRoomId = () => {
//       return JSON.parse(window.localStorage.getItem("usr_id"))
//     }
//     // handleChangeText 메소드
//     const handleSetImageUrl = event => {
//       this.setState({
//         imageUrl: event.target.value
//       })
//     }
//     //   const [imageUrl, setImageUrl] = useState(null);
//     //   const [image, setImage] = useState(null);
//     const handleValueFile = async e => {
//       // const { name, size, type } = e.target.files[0];
//       let params = {
//         userRoomId: userRoomId()
//       }
//       const { size } = e.target.files[0]
//       if (size / 1000000 < 200) {
//         let data = new FormData()
//         data.append("file", e.target.files[0])
//         data.append("params", JSON.stringify(params))

//         const response = await whiteBoardService.upFile(data)
//         const { data: resData } = response
//         const { fileInfo } = resData
//         setImageUrl(fileInfo.path)
//         // const { datas } = response;
//         //const { url } = datas;
//         //datas.append('datas', e.target.files[0]);
//         // whiteBoardService.upFile(data)
//         //     .catch((e) => {
//         //       console.log(' e --', e);
//         //     });
//       } else {
//         alert("파일 공유 용량제한이 100MB이하 입니다.")
//       }
//     }

//     // const handleChange= (e)=>{
//     //   this.setState({
//     //     file: URL.createObjectURL(e.target.files[0]),
//     //   })
//     //   s
//     const handleClickUpFile = () => {
//       // 채팅 금지된 사용자는 이용 불가
//       // 임시 input 엘리먼트 생성
//       const upFile = document.createElement("input")
//       // 타입은 파일 올리는 걸로
//       upFile.setAttribute("type", "file")

//       // name 속성은 file
//       upFile.setAttribute("name", "file")
//       // 보이지는 않게
//       //upFile.setAttribute('style', 'display: none');

//       upFile.setAttribute("accept", "image/*")
//       upFile.setAttribute("alt", "na")
//       // body에 추가
//       document.body.appendChild(upFile)
//       //document.getElementById("res").appendChild(upFile);
//       // 클릭하여 파일 고르게 하기
//       upFile.click()

//       // 파일이 선택되면 작동하는 콜백 함수 선택
//       upFile.onchange = handleValueFile
//     }
//     const handleClickImage = async (e, image) => {
//       e && e.preventDefault()
//       setImage(image)
//     }
//   }
//   render() {
//     return (

//       <image
//         // id="selection"

//         x={1000}
//         y={200}
//         // draggable
//         // onDragEnd={e => {
//         //   onChange({
//         //     ...shapeProps,
//         //     x: e.target.x(),
//         //     y: e.target.y()
//         //   });
//         // }}
//         // onTransformEnd={e => {
//         //   const node = shapeRef.current;
//         //   const scaleX = node.scaleX();
//         //   const scaleY = node.scaleY();
//         //   onChange({
//         //     ...shapeProps,
//         //     x: node.x(),
//         //     y: node.y(),
//         //     width: node.width() * scaleX,
//         //     height: node.height() * scaleY
//         //   });
//         // }}
//         href={`${process.env.REACT_APP_SERVER_API}/${window.imageUrl}`}
//         style={{
//           display: "block",
//           maxWidth: "50vh",
//           maxHeight: "50vh",
//           width: "auto",
//           height: "auto",
//           overflow: "hidden"
//         }}
//         onChange={""}
//         onClick={this.onMove}
//       />
//     )
//   }
// }

import React from 'react';
import {Image, Transformer} from 'react-konva';
import useImage from 'use-image';
const Upload = ({shapeProps, isSelected, onSelect, onChange, imageUrl}) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();
  const [image] = useImage(imageUrl);
  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.setNode(shapeRef.current);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);
  return (
    <React.Fragment>
      <Image
        onClick={onSelect}
        image={image}
        ref={shapeRef}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: node.width() * scaleX,
            height: node.height() * scaleY,
          });
        }}
      />
      {isSelected && <Transformer ref={trRef} />}
    </React.Fragment>
  );
};
export default Upload;


