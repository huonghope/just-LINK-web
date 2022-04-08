import {FIGURE_ELLIPSE_LINE, DRAW, FIGURE_ELLIPSE_FILL, TEXT, FIGURE_TRIANGLE_LINE, BRUSH, UPLOAD} from './ToolStore';
// import imageUrl from '../components/Tools'
// import imageUrl from "./Tools.js"
export function pointInsideRect(point, rect) {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

export function getShapeRect(shape) {
  const end = shape.path.length - 1;
  if (shape.type === FIGURE_ELLIPSE_LINE) {
    const halfWidth = Math.abs(shape.path[0].x - shape.path[end].x);
    const halfHeight = Math.abs(shape.path[0].y - shape.path[end].y);
    return {
      x: Math.min(shape.path[0].x, shape.path[end].x) - halfWidth,
      y: Math.min(shape.path[0].y, shape.path[end].y) - halfHeight,
      width: 2 * halfWidth,
      height: 2 * halfHeight,
    };
  } else if (shape.type === DRAW) {
    const minX = Math.min(...shape.path.map((p) => p.x));
    const maxX = Math.max(...shape.path.map((p) => p.x));
    const minY = Math.min(...shape.path.map((p) => p.y));
    const maxY = Math.max(...shape.path.map((p) => p.y));
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
    // ellipse 수정한 부분
  } else if (shape.type === FIGURE_ELLIPSE_FILL) {
    const halfWidth = Math.abs(shape.path[0].x - shape.path[end].x);
    const halfHeight = Math.abs(shape.path[0].y - shape.path[end].y);
    return {
      x: Math.min(shape.path[0].x, shape.path[end].x) - halfWidth,
      y: Math.min(shape.path[0].y, shape.path[end].y) - halfHeight,
      width: 2 * halfWidth,
      height: 2 * halfHeight,
    };
  }
  else if (shape.type === BRUSH) {
    const halfWidth = Math.abs(shape.path[0].x - shape.path[end].x);
    const halfHeight = Math.abs(shape.path[0].y - shape.path[end].y);

    return {
      x: Math.min(shape.path[0].x, shape.path[end].x) - halfWidth,
      y: Math.min(shape.path[0].y, shape.path[end].y) - halfHeight,
      width: 2 * halfWidth,
      height: 2 * halfHeight,
    };
  }
  // text 수정한 부분
  else if (shape.type === TEXT) {
    const halfWidth = Math.abs(shape.path[0].x - shape.path[end].x);
    const halfHeight = Math.abs(shape.path[0].y - shape.path[end].y);
    return {
      x: Math.min(shape.path[0].x, shape.path[end].x),
      y: Math.min(shape.path[0].y, shape.path[end].y),
      width: halfWidth,
      height: halfHeight,
    };
  }
  // triangle 수정한 부분
  else if (shape.type === FIGURE_TRIANGLE_LINE) {
    console.log('1');
    const halfWidth = Math.abs(shape.path[0].x - shape.path[end].x);
    const halfHeight = Math.abs(shape.path[0].y - shape.path[end].y);
    return {
      x: Math.min(shape.path[0].x, shape.path[end].x) - halfWidth,
      y: Math.min(shape.path[0].y, shape.path[end].y),
      width: 2 * halfWidth,
      height: halfHeight,
    };
  }
  else if (shape.type === UPLOAD) {
    console.log('');
    const halfWidth = Math.abs(shape.path[0].x - shape.path[end].x);
    const halfHeight = Math.abs(shape.path[0].y - shape.path[end].y);
    return {
      x: Math.min(shape.path[0].x, shape.path[end].x) - halfWidth,
      y: Math.min(shape.path[0].y, shape.path[end].y) - halfHeight,
      width: 2 *halfWidth,
      height: halfHeight,
    };
  }
  else {
    return {
      x: Math.min(shape.path[0].x, shape.path[end].x),
      y: Math.min(shape.path[0].y, shape.path[end].y),
      width: Math.abs(shape.path[0].x - shape.path[end].x),
      height: Math.abs(shape.path[0].y - shape.path[end].y),
    };
  }
}
