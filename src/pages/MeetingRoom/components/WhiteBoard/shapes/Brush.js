import React from 'react';
// import './style.scss';
export default class Brush extends React.Component {
  prepareData() {
    let d = [`M ${this.props.path[0].x} ${this.props.path[0].y}`];

    let collector = this.props.path.map((point) => {
      let xNext = point.x;
      let yNext = point.y;
      return `L ${xNext} ${yNext}`;
    });

    return d.concat(collector).join();
  }

  render() {
    let d = this.prepareData();
    return <path d={d} stroke="#FF69B4" strokeWidth={6} fill="none"
      strokeLinecap="round" />;
    // stroke-dasharray="10,0,0,0,0,10"
  }
}
