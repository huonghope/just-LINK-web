import React from 'react';
import EventBus from '../events/EventBus';
import Store from '../constants/Store';
import Selection from './Selection';
import {getShapeRect} from '../constants/Utils';
import {shapes} from 'konva/lib/Shape';
import {v1 as uuidv1} from 'uuid';

export default class WhiteBoard extends React.Component {
  constructor() {
    super();

    Store.subscribe(() => {
      this.setState({data: Store.data});
    });

    // new useState
    this.state = {
      data: Store.data,
      images: [],
      selectedId: [],
      shapes: [],
      imageList: [],
      width: 100,
      height: 200,
    };

    // New CreatRef
    this.stageEL = React.createRef();
    this.layerEL = React.createRef();
    this.fileUploadEl = React.createRef();
    this.shapeRef = React.createRef();
    // this.uuidv1= require("uuidv1");

    this.pressed = false;
    this.startMove = this.startMove.bind(this);
    this.endMove = this.endMove.bind(this);
    this.onMove = this.onMove.bind(this);
    this.startPoint = null;
    this.increaseSize= this.increaseSize.bind(this);
    this.decreaseSize= this.decreaseSize.bind(this);
  }
  componentDidMount() {
    document.addEventListener('pointerdown', this.mouseDown.bind(this));
    document.addEventListener('pointermove', this.mouseMove.bind(this));
    document.addEventListener('pointerup', this.mouseUp.bind(this));
    document.addEventListener('pointercancel', this.mouseCancel.bind(this));
    document.addEventListener('keydown', this.keyDown.bind(this));

    window.addEventListener('resize', this.onResize.bind(this));
    // document.addEventListener("keydown", (event) => {
    //   if(event.code==="Delete"){
    //     let index=images.findIndex((c) => c.id===selectedId);
    //     if(index!==-1){
    //       circles.splice(index, 1);
    //       this.setState({images});
    //     }
    //     forceUpdate();
    //   }
    // });


    this.setState({height: this.height+30});

    this.onResize();
    this.setState({data: Store.data});

    this.setState({
      images: {},
      shapes: {},
      selectedId: {},
      imageList: {},
    });
  }
  startMove(e) {
    e.preventDefault();
    this.startPoint = {x: e.clientX, y: e.clientY};
  }
  endMove(e) {
    e.preventDefault();
    this.startPoint = null;
  }

  onMove(e) {
    if (this.startPoint) {
      e.preventDefault();
      const move = {
        x: e.clientX - this.startPoint.x,
        y: e.clientY - this.startPoint.y,
      };
      this.props.move(move);
      this.startPoint = {x: e.clientX, y: e.clientY};
    }
  }

  onDragStart(e) {
    const id = e.target.id();
    // setImage(

    // )
  }
  onResize() {
    try {
      if (this._svg !== null) {
        this.rect = this._svg.getBoundingClientRect();
      }
    } catch (error) {
      console.log(error);
    }
  }

  mousePos(e) {
    let round = 2;
    return {
      x: round * Math.round(e.clientX / round) - this.rect.left,
      y: round * Math.round(e.clientY / round) - this.rect.top,
    };
  }

  _insideRect(rect, point) {
    return (
      point.x > rect.left &&
      point.x < rect.right &&
      point.y > rect.top &&
      point.y < rect.bottom
    );
  }

  mouseDown(e) {
    if (this._insideRect(this.rect, {x: e.clientX, y: e.clientY})) {
      this.pressed = true;
      EventBus.emit(EventBus.START_PATH, this.mousePos(e));
      // setDisplay(false);
    }
  }
  mouseCancel(e) {
    if (this._insideRect(this.rect, {x: e.clientX, y: e.clientY})) {
      this.pressed = true;
      EventBus.emit(EventBus.START_PATH, this.mousePos(e));
    }
  }


  mouseMove(e) {
    if (this.pressed) {
      EventBus.emit(EventBus.MOVE_PATH, this.mousePos(e));
    }
  }

  mouseUp(e) {
    this.pressed = false;
    EventBus.emit(EventBus.END_PATH, this.mousePos(e));
    this.keyDown(e);
  }

  // keyDownDelete(){
  //   this.pressed=false
  //   EventBus.emit(EventBus.DEL)

  // }

  keyDown(e) {
    switch (e.keyCode) {
      case 27: // escape
        EventBus.emit(EventBus.UNDO);
        break;
      case 46: // Delete
        EventBus.emit(EventBus.DEL);
        break;

      default:
        break;
    }
  }

  onMove(shape) {
    return (move) => {
      EventBus.emit(EventBus.MOVE, {shape, move});
      // EventBus.emit(EventBus.MOVE, {imageUrl,move})
    };
  }

  // New file change event
  fileChange(e) {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.addEventListener(
        'load',
        () => {
          const id = uuidv1();
          this.images.push({
            content: reader.result,
            id,
          });
          this.fileUploadEl.current.value = null;
          this.shapes.push(id);
          this.setState({shapes});
        },
        false,
    );
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  onTransformEnd(e) {
    const node = this.shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
  }


  increaseSize =(e)=>{
    this.setState((prevState) =>({
      height: prevState.height+30,
      width: prevState.width+30,
    }));
  }

  decreaseSize =(e)=>{
    this.setState((prevState) =>({
      height: prevState.height-30,
      width: prevState.width-30,
    }));
  }


  // DeleteButton = () => {
  //   // setImageUrl(null);
  //   document.addEventListener("click", function (event) {
  //     event.target.parentNode.removeChild(event.target)
  //   })
  // }

  render() {
    const data = this.state.data;
    console.log(data);
    let selection = null;
    const shapes = data.shapes.map((shape, i, imageUrl) => {
      if (shape.selected) {
        selection = (
          <Selection rect={getShapeRect(shape)} move={this.onMove(shape)} />
        );
      }
      // imageUrl Selection
      if (imageUrl.selected) {
        selection = (
          <Selection
            rect={getShapeRect(imageUrl)}
            move={this.onMove(imageUrl)}
          />
        );
      }
      return <shape.class key={i} path={shape.path} color={shape.color} />;
    });
    // shapes.push(x,y, image_width, image_height);
    let current = null;
    if (data.mouseTracker && data.mouseTracker.class) {
      current = (
        <data.mouseTracker.class
          color={data.mouseTracker.color}
          path={data.mouseTracker.path}
        />
      );
    }

    const {width, height} =this.state;

    return (
      <svg
        id="whiteBoard"
        width={this.props.width}
        height={this.props.height}
        ref={(canvas) => (this._svg = canvas)}
        data-html2canvas-ignore="true"
      >
        {shapes}

        {
          // <Draggable>
          // <image
          //     classname="imgs"
          //     x={1000}
          //     // top={}
          //     y={200}
          //     width={this.width}
          //     height={this.height}
          //     // width={1000}
          //     // height={1000}
          //     href={`${process.env.REACT_APP_SERVER_API}/${window.imageUrl}`}
          //     //draggable
          //     // keyDown={this.keyDownDelete()}
          //     //onMouseDown={window.onDragStart}
          //     //onResize={`$('.resizable').resizable()`}
          //     // onClick={this.increaseSize()}
          //     style={{
          //       display: "hidden",
          //       // maxWidth: "50vh",
          //       // height: "50vh",
          //       // backgroundposition: "center",
          //       // maxHeight: "50vh",
          //       // width: "auto",
          //       // height: "auto",
          //       // top:"10px", /*it pushes away div element from top 10px down Remember with
          //       // browser window*/
          //       // left:"20px",
          //       // right:"10px",
          //       // bottom:"20px",
          //       position:"absolute",
          //       cursor: "move",
          //       // paddingLeft:"1000px",
          //       overflow: "hidden"
          //     }}
          //   />

          //   </Draggable>


        }


        {current}

        {/* </input> */}

        {selection}


      </svg>
    );
  }
}
