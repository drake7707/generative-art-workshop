declare class C2S extends CanvasRenderingContext2D {
  constructor(width: number, height: number);
  getSerializedSvg(val: boolean): string;
}

let ctx: CanvasRenderingContext2DWrapper;

let currentPathCanvas: HTMLCanvasElement;
let currentPathContext: CanvasRenderingContext2D;
let renderedCanvas: HTMLCanvasElement;
let renderedContext: CanvasRenderingContext2D;

export function initialize(width: number, height: number): CanvasRenderingContext2DWrapper {
  let c2s = new C2S(width, height);

  currentPathCanvas = <HTMLCanvasElement>document.getElementById("currentPathCanvas");
  currentPathContext = currentPathCanvas.getContext("2d");
  currentPathCanvas.width = width;
  currentPathCanvas.height = height;
  currentPathContext.strokeStyle = "red";
  currentPathContext.lineWidth = 1;
  currentPathContext.setLineDash([2, 2]);
  renderedCanvas = <HTMLCanvasElement>document.getElementById("renderedCanvas");
  renderedContext = renderedCanvas.getContext("2d");
  renderedCanvas.width = width;
  renderedCanvas.height = height;

  document.getElementById("canvas-container").setAttribute("style", `width:${width}px;height:${height}px`);

  document.getElementById("download").onclick = () => {
    const svgData = (<any>c2s).getSerializedSvg(true);
    var svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    var svgUrl = URL.createObjectURL(svgBlob);
    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "myfile.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  ctx = new CanvasRenderingContext2DWrapper(c2s, renderedContext);
  return ctx;
}

export function render(ctx: CanvasRenderingContext2DWrapper) {
  document.getElementById("container").innerHTML = ctx.getSerializedSvg();
  setStatus("");
}

export function run(func: Function) {
  if (func.constructor.name === "GeneratorFunction") {
    let generator = func();
    let result = generator.next();
    while (!result.done) {
      result = generator.next();
    }
    render(ctx);
  } else {
    func();
    render(ctx);
  }
}

export function animate(func: Function, delayBetweenSteps: number = 100) {
  setStatus(func.name);

  if (func.constructor.name === "GeneratorFunction") {
    let generator = func();
    let stepFunc = () => {
      let result = generator.next();
      if (!result.done) {
        drawCurrentPath(ctx);
        window.setTimeout(stepFunc, delayBetweenSteps);
      } else {
        render(ctx);
      }
    };
    stepFunc();
  } else {
    run(func);
  }
}

export function setStatus(...text: (string | number)[]) {
  document.getElementById("statusLabel").innerText = text.join(" ");
}

export function drawCurrentPath(ctx: CanvasRenderingContext2DWrapper) {
  currentPathContext.clearRect(0, 0, currentPathContext.canvas.width, currentPathContext.canvas.height);
  currentPathContext.beginPath();
  let pathActions = ctx.getCurrentPath();
  for (let action of pathActions) {
    action(currentPathContext);
  }
  currentPathContext.stroke();
}

export class CanvasRenderingContext2DWrapper {
  private pathActions: ((ctx: CanvasRenderingContext2D) => void)[] = [];

  public constructor(private ctx: C2S, private renderedContext: CanvasRenderingContext2D) {}

  public restore(): void {
    this.ctx.restore();
    this.renderedContext.restore();
  }

  public save(): void {
    this.ctx.save();
    this.renderedContext.save();
  }

  public arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void {
    this.pathActions.push((ctx) => ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise));
    this.ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
    this.renderedContext.arc(x, y, radius, startAngle, endAngle, anticlockwise);
  }

  public arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
    this.pathActions.push((ctx) => ctx.arcTo(x1, y1, x2, y2, radius));
    this.ctx.arcTo(x1, y1, x2, y2, radius);
    this.renderedContext.arcTo(x1, y1, x2, y2, radius);
  }

  public bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void {
    this.pathActions.push((ctx) => ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y));
    this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    this.renderedContext.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
  }

  public closePath(): void {
    this.pathActions.push((ctx) => ctx.closePath());
    this.ctx.closePath();
    this.renderedContext.closePath();
  }

  public ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void {
    this.pathActions.push((ctx) => ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise));
    this.ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise);
    this.renderedContext.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise);
  }

  public lineTo(x: number, y: number): void {
    this.pathActions.push((ctx) => ctx.lineTo(x, y));
    this.ctx.lineTo(x, y);
    this.renderedContext.lineTo(x, y);
  }

  public moveTo(x: number, y: number): void {
    this.pathActions.push((ctx) => ctx.moveTo(x, y));
    this.ctx.moveTo(x, y);
    this.renderedContext.moveTo(x, y);
  }

  public quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
    this.pathActions.push((ctx) => ctx.quadraticCurveTo(cpx, cpy, x, y));
    this.ctx.quadraticCurveTo(cpx, cpy, x, y);
    this.renderedContext.quadraticCurveTo(cpx, cpy, x, y);
  }

  public rect(x: number, y: number, w: number, h: number): void {
    this.pathActions.push((ctx) => ctx.rect(x, y, w, h));
    this.ctx.rect(x, y, w, h);
    this.renderedContext.rect(x, y, w, h);
  }

  public beginPath(): void {
    this.pathActions = [];
    this.ctx.beginPath();
    this.renderedContext.beginPath();
  }

  public clip(fillRule?: CanvasFillRule): void {
    this.ctx.clip(fillRule);
    this.renderedContext.clip(fillRule);
  }

  public fill(fillRule?: CanvasFillRule): void {
    this.ctx.fill(fillRule);
    this.renderedContext.fill(fillRule);
  }

  public isPointInPath(x: number, y: number, fillRule?: CanvasFillRule): boolean {
    return this.ctx.isPointInPath(x, y, fillRule);
  }

  public isPointInStroke(x: number, y: number): boolean {
    return this.ctx.isPointInStroke(x, y);
  }

  public stroke(): void {
    this.ctx.stroke();
    this.renderedContext.stroke();
  }

  public getSerializedSvg(): string {
    return this.ctx.getSerializedSvg(true);
  }

  public get lineWidth(): number {
    return this.ctx.lineWidth;
  }
  public set lineWidth(value: number) {
    this.ctx.lineWidth = value;
    this.renderedContext.lineWidth = value;
  }

  public get strokeStyle(): string | CanvasGradient | CanvasPattern {
    return this.ctx.strokeStyle;
  }
  public set strokeStyle(value: string | CanvasGradient | CanvasPattern) {
    this.ctx.strokeStyle = value;
    this.renderedContext.strokeStyle = value;
  }

  public get fillStyle(): string | CanvasGradient | CanvasPattern {
    return this.ctx.fillStyle;
  }
  public set fillStyle(value: string | CanvasGradient | CanvasPattern) {
    this.ctx.fillStyle = value;
    this.renderedContext.fillStyle = value;
  }

  public get canvas() {
    return this.ctx.canvas;
  }

  public get globalAlpha(): number {
    return this.ctx.globalAlpha;
  }
  public set globalAlpha(value: number) {
    this.ctx.globalAlpha = value;
    this.renderedContext.globalAlpha = value;
  }

  public clearRect(x: number, y: number, w: number, h: number): void {
    this.ctx.clearRect(x, y, w, h);
    this.renderedContext.clearRect(x, y, w, h);
  }

  fillText(text: string, x: number, y: number, maxWidth?: number): void {
    this.ctx.fillText(text,x,y, maxWidth);
    this.renderedContext.fillText(text,x,y,maxWidth);
  }

  measureText(text: string): TextMetrics {
    this.ctx.font
    return this.ctx.measureText(text);
  }
    
  strokeText(text: string, x: number, y: number, maxWidth?: number): void {
    this.ctx.strokeText(text,x,y,maxWidth);
    this.renderedContext.strokeText(text,x,y,maxWidth);
  }

  public get font(): string {
    return this.ctx.font;
  }

  public set font(value:string) {
    this.ctx.font = value;
    this.renderedContext.font = value;
  }

  public getCurrentPath() {
    return this.pathActions;
  }

  public reset() {
    this.ctx = new C2S(ctx.canvas.width, ctx.canvas.height);
    this.renderedContext.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.renderedContext.beginPath(); // reset path
    this.pathActions = [];
  }
}
