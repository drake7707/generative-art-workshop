import { Random } from "./random";

class Cell {
  a: number;
  b: number;
}

export class GrayScott {
  private dt: number = 1;

  private _t: number = 0;
  public get t() {
    return this._t;
  }

  private minB: number;
  private maxB: number;
  private minA: number;
  private maxA: number;

  private buffer: Cell[][];
  private nextFrameBuffer: Cell[][];

  constructor(public width: number, public height: number, public k: number, public f: number, public DA: number = 1, public DB: number = 0.5) {
    this.buffer = this.createArray();
    this.nextFrameBuffer = this.createArray();
  }

  private createArray() {
    let arr: Cell[][] = new Array(this.width);
    for (let i: number = 0; i < this.width; i++) {
      arr[i] = new Array(this.height);
      for (let j: number = 0; j < this.height; j++) {
        let c = new Cell();
        c.a = 1;
        c.b = 0;
        arr[i][j] = c;
      }
    }
    return arr;
  }

  addInitialSeed(x: number, y: number, rng:Random) {
    for (let i: number = 0; i < 2; i++) {
      for (let j: number = 0; j < 2; j++) {
        this.buffer[Math.floor(x + i)][Math.floor(y + j)].a = 1;
        this.buffer[Math.floor(x + i)][Math.floor(y + j)].b = rng.next();
      }
    }
  }

  step() {
    this.minA = Number.POSITIVE_INFINITY;
    this.minB = Number.POSITIVE_INFINITY;
    this.maxA = Number.NEGATIVE_INFINITY;
    this.maxB = Number.NEGATIVE_INFINITY;

    for (let x: number = 0; x < this.width; x++) {
      for (let y: number = 0; y < this.height; y++) {
        let oldA = this.buffer[x][y].a;
        let oldB = this.buffer[x][y].b;

        let middle = 0;
        let adjacent = 0;
        let diag = 0;

        middle = oldA * -1;

        let left = x - 1;
        let right = x + 1;
        let top = y - 1;
        let bottom = y + 1;
        if (left < 0) left = this.width - 1;
        if (right >= this.width) right %= this.width;
        if (top < 0) top = this.height - 1;
        if (bottom >= this.height) bottom %= this.height;

        adjacent += this.buffer[x][bottom].a * 0.2;
        adjacent += this.buffer[x][top].a * 0.2;
        adjacent += this.buffer[left][y].a * 0.2;
        adjacent += this.buffer[right][y].a * 0.2;

        diag += this.buffer[right][bottom].a * 0.05;
        diag += this.buffer[right][top].a * 0.05;
        diag += this.buffer[left][top].a * 0.05;
        diag += this.buffer[left][bottom].a * 0.05;

        let factor2 = oldA * oldB * oldB;
        let laplaceA = middle + adjacent + diag;
        let newA = (oldA + (this.DA * laplaceA - factor2) + this.f * (1 - oldA)) * this.dt;

        middle = oldB * -1;
        adjacent = 0;
        diag = 0;
        adjacent += this.buffer[x][bottom].b * 0.2;
        adjacent += this.buffer[x][top].b * 0.2;
        adjacent += this.buffer[left][y].b * 0.2;
        adjacent += this.buffer[right][y].b * 0.2;

        diag += this.buffer[right][bottom].b * 0.05;
        diag += this.buffer[right][top].b * 0.05;
        diag += this.buffer[left][top].b * 0.05;
        diag += this.buffer[left][bottom].b * 0.05;

        let laplaceB = middle + adjacent + diag;

        let newB = (oldB + (this.DB * laplaceB + factor2) - (this.k + this.f) * oldB) * this.dt;

        if (newB < this.minB) this.minB = newB;
        if (newA < this.minA) this.minA = newA;
        if (newB > this.maxB) this.maxB = newB;
        if (newA > this.maxA) this.maxA = newA;

        this.nextFrameBuffer[x][y].a = newA;
        this.nextFrameBuffer[x][y].b = newB;
        // A' = A + (lapl - A*B²  + F * (1-A))* dt
        // B' = B + (lapl + A*B²  - (k+F) * B)* dt
      }
    }

    this.swapBuffers();
    this._t++;
  }

  private swapBuffers() {
    let tmp = this.buffer;
    this.buffer = this.nextFrameBuffer;
    this.nextFrameBuffer = tmp;
  }

  foreachCell(func: (i: number, j: number, value: number) => void) {
    for (let x: number = 0; x < this.width; x++) {
      for (let y: number = 0; y < this.height; y++) {
        let c = this.buffer[x][y];
        let val = 0;
        // normalize
        //val += Math.floor((c.b - this.minB) / (this.maxB - this.minB) * 255);
        val += this.maxA - this.minA > 0 ? Math.floor(((c.a - this.minA) / (this.maxA - this.minA)) * 255) : 0;

        func(x, y, val);
      }
    }
  }
}