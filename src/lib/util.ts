/* eslint camelcase: [0] */
/* eslint no-unused-vars: [0] */
import { Point2, Rect, Arc } from '../types';

const print = (s: string): void => console.log(`[util] ${s}`);

export const rand = (min: number, max: number): number => Math.random() * (max - min) + min;

export const randInt = (min: number, max: number): number => Math.trunc(Math.random() * (max - min + 1)) + min;

// Get the norm for `val` between `min` and `max`.
// Ex. norm(75, 0, 100) ---> 0.75
export const norm = (val: number, min: number, max: number): number => (val - min) / (max - min);

// Apply `norm` (the linear interpolate value) to the range
// between `min` and `max` (usually between `0` and `1`).
// Ex. lerp(0.5, 0, 100) ---> 50
export const lerp = (norm: number, min: number, max: number): number => min + (max - min) * norm;

// Limit the value to a certain range.
// Ex. clamp(5000, 0, 100) ---> 100
export const clamp = (val: number, min: number, max: number) => Math.min(
  Math.max(val, Math.min(min, max)),
  Math.max(min, max)
);

// Get a distance between two points.
export const distance = (p1: Point2, p2: Point2 | Arc): number => {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt((dx * dx) + (dy * dy));
};

export const deg = (a: number): number => a * (180 / Math.PI);
export const rad = (a: number): number => a * (Math.PI / 180);

// Find the radian from `p2` to `p1`.
// Ex. deg(angle({ x: 10, y: 10 }, { x: 0, y: 0 })) ---> 45
export const angle = (p1: Point2, p2: Point2): number => Math.atan2(p1.y - p2.y, p1.x - p2.x);

// See if the value falls within the given range.
export const inRange = (val: number, min: number, max: number): boolean => (val >= min && val <= max);

// See if `x` and `y` falls into the bounds made by `rect`.
export const withinRect = (p: Point2, rect: Rect): boolean => (
  inRange(p.x, rect.x, rect.x + rect.width) &&
    inRange(p.y, rect.y, rect.y + rect.height)
);

// See if the given point falls within the arc's radius.
export const withinArc = (p: Point2, a: Arc): boolean => distance(p, a) <= a.radius;

/**
 * Restricts the sequential calls to allow only one call per given period of time.
 * @function
 * @param {Function} f - Function for which you want the debounce effect.
 * @param {number} wait - Period of time to limit the function call.
 * @param {Object} [context=] - Optional. Specify when a certain context is needed upon the function call.
 * @returns {Function}
 * @example
 * window.addEventListener(
 *   'resize',
 *   debounce(resize.bind(this), 150),
 *   false
 * );
 */
// export const debounce = (f: Function, wait: number, context: object = this): Function => {
//   let timeout: any = null;
//   let args: any[] | any = null;
//   const g = () => (Reflect as any).apply(f, context, args);
//   return (...o: any[]): void => {
//     args = o;
//     if (timeout) {
//       clearTimeout(timeout);
//     }
//     else {
//       g(); // For the first time...
//     }
//     timeout = setTimeout(g, wait);
//   };
// };

export default {
  rand,
  randInt,
  norm,
  lerp,
  clamp,
  distance,
  deg,
  rad,
  angle,
  inRange,
  withinRect,
  withinArc,
  // debounce,
}
