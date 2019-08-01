import { Vec2 } from './Vec2';

export interface Point2 {
  x: number;
  y: number;
}

export interface Rect {
  x?: number;
  y?: number;
  width: number;
  height: number;
}

export interface Arc {
  x: number;
  y: number;
  radius: number;
}

export interface WebAssemblyInstance {
  readonly exports: any;
}

export interface WebAssemblyResult {
  module: any;
  instance: WebAssemblyInstance;
}

export interface Particle {
  pos: Vec2;
  update: Function;
  draw: Function;
}

// @todo
// Consider the definition:
// ------------------------------------------------
// export interface WindLib {
//   perlin: Function;
// }
// export interface WindLibConstructor {
//     new (): WindLib;
//     perlin(): WindLib;
// }
// export var WindLib: WindLibConstructor;
// ------------------------------------------------
export interface WindLib {
  // new (): object;
  perlin: Function;
  simplex: Function;
}
