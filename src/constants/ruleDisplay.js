export const defineValueMode = [
  {
    // 2x2 사이즈 모드
    sizeName: '2x2',
    addValue: {
      startIndex: 1,
      endIndex: 3,
    },
    row: {
      rowLimit: 4,
      rowIncrease: 2,
    },
    col: {
      colLimit: 2,
      colIncrease: 1,
    },
  }, {
    // 3x3 사이즈 모드
    sizeName: '3x3',
    addValue: {
      startIndex: 1,
      endIndex: 4,
    },
    row: {
      rowLimit: 8,
      rowIncrease: 3,
    },
    col: {
      colLimit: 3,
      colIncrease: 1,
    },
  }, {
    // 4x4 사이즈 모드
    sizeName: '4x4',
    addValue: {
      startIndex: 1,
      endIndex: 5,
    },
    row: {
      rowLimit: 14,
      rowIncrease: 4,
    },
    col: {
      colLimit: 4,
      colIncrease: 1,
    },
  }, {
    // 5x5 사이즈 모드
    sizeName: '5x5',
    addValue: {
      startIndex: 1,
      endIndex: 6,
    },
    row: {
      rowLimit: 22,
      rowIncrease: 5,
    },
    col: {
      colLimit: 5,
      colIncrease: 1,
    },
  }, {
    // 6x6 사이즈 모드
    sizeName: '6x6',
    addValue: {
      startIndex: 1,
      endIndex: 7,
    },
    row: {
      rowLimit: 32,
      rowIncrease: 6,
    },
    col: {
      colLimit: 6,
      colIncrease: 1,
    },
  },
];


// ! 일반 3 x 3
// handleClickPrevBtn = () => {
//   const {renderRemoteStream, prevQueue} = this.state;

//   if (prevQueue.length === 0) return;


//   let valueAddQueue = [];
//   let addArray = prevQueue[prevQueue.length - 1];
//   let disabledArrayTemp = [];
//   let k = 0;

//   for (let i = 0; i < 8; i += 3) {
//     disabledArrayTemp.push(addArray[k++]);
//     for (let j = i; j < i + 3; j++) {
//       if (j + 1 >= i + 3) {
//         valueAddQueue.push(renderRemoteStream[j]);
//       } else {
//         disabledArrayTemp.push(renderRemoteStream[j]);
//       }
//     }
//   }
//   let newPrevQueue = prevQueue.slice(0, prevQueue.length - 1);

//   this.setState((prevState) => {
//     return {
//       renderRemoteStream: disabledArrayTemp,
//       currentPage: prevState.currentPage - 1,
//       prevQueue: newPrevQueue,
//       nextQueue: [...prevState.nextQueue, valueAddQueue],
//     };
//   });
//   // setDisplayArray(disabledArrayTemp);
//   // setCurrentPage(currentPage - 1);
//   // setPrevQueue(newPrevQueue);
//   // setNextQueue([...nextQueue, valueAddQueue]);
// };


// handleClickNextBtn = () => {
//   const {renderRemoteStream, remoteStreams} = this.state;

//   // 마지막 요수를 3개 곱해서 출력함
//   let valueAddQueue = [];
//   let lastItem = renderRemoteStream[renderRemoteStream.length - 1];
//   let indexOfLastItem = remoteStreams.findIndex(
//       (item) => item.index === lastItem.index,
//   );
//   if (indexOfLastItem === -1) return;

//   // 추가된 3개 요수
//   let addArray = remoteStreams.slice(
//       indexOfLastItem + 1,
//       indexOfLastItem + 4,
//   );
//   let disabledArrayTemp = [];
//   let k = 0;
//   for (let i = 0; i < 8; i += 3) {
//     for (let j = i; j < i + 3; j++) {
//       if (i === j) {
//         valueAddQueue.push(renderRemoteStream[j]);
//       } else {
//         disabledArrayTemp.push(renderRemoteStream[j]);
//       }
//     }
//     disabledArrayTemp.push(addArray[k++]);
//   }

//   this.setState((prevState) => {
//     return {
//       currentPage: prevState.currentPage + 1,
//       renderRemoteStream: disabledArrayTemp,
//       prevQueue: [...prevState.prevQueue, valueAddQueue],
//     };
//   });

//   // setCurrentPage(currentPage + 1);
//   // setDisplayArray(disabledArrayTemp);
//   // setPrevQueue([...prevQueue, valueAddQueue]);
// };
