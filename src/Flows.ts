/**
 * Based on Johan Karlsson's blog post:
 * https://codepen.io/DonKarlssonSan/post/particles-in-simplex-noise-flow-field
 */
import Victor from 'victor';
import { Rect, WindLib, Particle } from './types';
import { rand, withinRect } from './lib/util';
import WindLibFactory from './lib/WindLib';

Victor.prototype.setAngle = function (angle) {
  const length = this.length();
  this.x = Math.cos(angle) * length;
  this.y = Math.sin(angle) * length;
};

Victor.prototype.setLength = function (length) {
  const angle = this.angle();
  this.x = Math.cos(angle) * length;
  this.y = Math.sin(angle) * length;
};

const ZONE_SIZE = 18;
const PARTICLE_SIZE = 3;

const int = Math.trunc;
const print = (s: string): void => console.log(`[Flow] ${s}`);

interface CreateParticle {
  ctx: any;
  index: number;
  width: number;
  height: number;
}

/**
 * @public
 * @param {Object} [canvas]
 * @returns {Object}
 */
export default async function factory (canvas: HTMLCanvasElement) {
  const wind: WindLib = await WindLibFactory();

  // @todo
  // TS2339: Property 'strokeStyle' does not exist on type 'HTMLCanvasElement'.
  const ctx: any = canvas && (canvas as any).getContext('2d');

  const zsize = ZONE_SIZE;
  
  let width = 0;
  let height = 0;
  let cols = 1;
  let rows = 1;
  let zin = 0;
  let particles: any[] = [];
  let field: any[] = [];

  // --------------------------
  // Reset
  // --------------------------
  
  const resetParticles = (num: number): void => {
    particles.length = 0;
    zin = 0;
    for (let index = 0; index < num; index++) {
      particles.push(
        createParticle({ ctx, index, width, height })
      );
    }
  };

  const resetField = (): void => {
    field = new Array(cols);
    for (let x = 0; x < cols; x++) {
      field[x] = new Array(rows);
      for (let y = 0; y < rows; y++) {
        field[x][y] = new Victor(0, 0);
      }
    }
  };

  /**
   * @protected
   * @param {Object} [o]
   * @param {number} [o.num] Number of partcles.
   * @param {number} [o.width] Canvas width
   * @param {number} [o.height] Canvas height
   */
  const reset = (args: any = {}) => {
    print('+++++++ reset()');
    const { num, width: w, height: h }: { num: number, width: number, height: number } = args;

    width = canvas.width = w;
    height = canvas.height = h;

    // "fill" would be the same, but "stroke" changes.
    ctx.strokeStyle = 'hsla(0, 0%, 100%, 1)';
    ctx.fillStyle = 'hsla(0, 0%, 100%, 0.9)';

    cols = Math.round(width / zsize) + 1;
    rows = Math.round(height / zsize) + 1;

    resetParticles(num);
    resetField();
  };

  // --------------------------
  // Update
  // --------------------------

  // Perlin noise to set new "angle" for each in the field.
  // const angleZoom = (n: number): number => n/20;
  const angleZoom = (n: number): number => n/20;
  // const angleZoom = (n: number): number => n/50;
  const getPerlinAngle = (x: number, y: number, zin: number): number => (
    wind.perlin(angleZoom(x), angleZoom(y), zin) * Math.PI * 2
  );

  // Perlin noise to set new "length" for each in the field.
  const disZoom = (n: number): number => n/40 + 40000;
  // const disZoom = (n: number): number => n/10 + 40000;
  const getPerlinDist = (x: number, y: number, zin: number): number => (
    wind.perlin(disZoom(x), disZoom(y), zin)
  );

  const updateField = (): void => {
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        const p: Victor = field[x][y];
        p.setAngle(getPerlinAngle(x, y, zin));
        p.setLength(getPerlinDist(x, y, zin));
      }
    }
  };

  const updateParticles = (): void => {
    const rect: Rect = { x: 0, y: 0, width: cols, height: rows };
    particles.forEach((p: Particle): void => {
      const copy = p.pos.clone().divide({ x: zsize, y: zsize }); // (x, y)
      let v: Victor;
      if (withinRect(copy, rect)) {
        v = <Victor> field[int(copy.x)][int(copy.y)];
      }
      p.update(v);
    });
  };

  /**
   * @protected
   */
  const update = (): void => {
    updateField();
    updateParticles();
    zin += 0.001;
  };

  // --------------------------
  // Draw
  // --------------------------
  
  const drawField = (): void => {
    ctx.strokeStyle = 'hsla(0, 0%, 100%, 0.4)';
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        const px0 = x * zsize;
        const py0 = y * zsize;
        const px1 = px0 + field[x][y].x * zsize * 2;
        const py1 = py0 + field[x][y].y * zsize * 2;
        ctx.beginPath();
        ctx.moveTo(px0, py0);
        ctx.lineTo(px1, py1);
        ctx.stroke();
      }
    }
  };

  const drawParticles = (): void => {
    ctx.strokeStyle = 'hsla(0, 0%, 100%, 1)';
    particles.forEach((p: Particle) => p.draw());
  };

  /**
   * @protected
   */
  const draw = (args: any = {}) => {
    const { bg }: { bg: any } = args; // @todo: Give a specific type to `bg`.
    if (!ctx) { throw new Error('No context for flows.'); }
    if (bg) {
      ctx.putImageData(bg, 0, 0);
    }
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.stroke();
    drawField();
    drawParticles();
  };

  return {
    reset,
    update,
    draw
  };
}

/**
 * @private
 * @param {Object} [o]
 * @param {Object} [o.ctx] Canvas context
 * @param {number} [o.index] Index for the instance stored in "particles".
 * @param {number} [o.width] Canvas width
 * @param {number} [o.height] Canvas height
 * @returns {Object}
 */
function createParticle ({ ctx, index, width, height }: CreateParticle): Particle {

  const psize = PARTICLE_SIZE;
  const pos = new Victor(rand(0, width), rand(0, height));
  const vel = new Victor(rand(-1, 1), rand(-1, 1));
  
  return {
    pos,
    update: (v: Victor) => {
      if (v) {
        vel.add(v);
      }
      pos.add(vel);

      if (vel.length() > 2) {
        vel.setLength(2);
      }
      if (pos.x > width) {
        pos.x = 0;
      } else if (pos.x < -psize) {
        pos.x = width - 1;
      }
      if (pos.y > height) {
        pos.y = 0;
      } else if (pos.y < -psize) {
        pos.y = height - 1;
      }
    },
    draw: () => {
      ctx.fillRect(pos.x, pos.y, psize, psize);
    }
  };
}
