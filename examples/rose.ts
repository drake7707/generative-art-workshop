export function rose(ctx: CanvasPath, offsetX: number, offsetY: number, scale: number,n:number, d:number) {
  const maxSteps = 1000;
  const r = scale/2;

  for (let step = 0; step < maxSteps; step++) {

    let t = step / maxSteps;
    let angle = t * Math.PI * 2*d;
    const k = n/d;
    let x = r * Math.cos(k * angle) * Math.cos(angle);
    let y = r * Math.cos(k * angle) * Math.sin(angle);
    
    x += scale/2;
    y += scale/2;

    // move it in position
    x += offsetX;
    y += offsetY;

    if (step == 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

}
