
export function epicycloid(ctx: CanvasPath, offsetX: number, offsetY: number, scale: number, k: number, revolutions: number) {
  const maxSteps = 1000;
  const r = 1; // doesn't matter because we scale to 0-1 so we end up cancelling out r

  let equationFunc = (step) => {
    let t = step / maxSteps;
    let angle = t * Math.PI * 2 * revolutions;
    const x = r * (k + 1) * Math.cos(angle) - r * Math.cos((k + 1) * angle);
    const y = r * (k + 1) * Math.sin(angle) - r * Math.sin((k + 1) * angle);
    return { x, y };
  };
  // k*r is the radius of the inner circle and 2*r is the diameter of the outer circle
  const fullRadius = k * r + 2 * r;
  spirograph(ctx, offsetX, offsetY, scale, equationFunc, fullRadius, maxSteps);
}

export function hypocycloid(ctx: CanvasPath, offsetX: number, offsetY: number, scale: number, k: number, revolutions: number) {
  const maxSteps = 1000;
  const r = 1; // doesn't matter because we scale to 0-1 so we end up cancelling out r

  let equationFunc = (step) => {
    let t = step / maxSteps;
    let angle = t * Math.PI * 2 * revolutions;
    const x = r * (k - 1) * Math.cos(angle) + r * Math.cos((k - 1) * angle);
    const y = r * (k - 1) * Math.sin(angle) - r * Math.sin((k - 1) * angle);
    return { x, y };
  };
  // the smaller circle is contained within the larger one so just the radius of the larger circle k*r
  const fullRadius = k * r;
  spirograph(ctx, offsetX, offsetY, scale, equationFunc, fullRadius, maxSteps);
}

function spirograph(ctx: CanvasPath, offsetX: number, offsetY: number, scale: number, equationFunc: (step: number) => { x: number; y: number }, fullRadius: number, maxSteps: number) {
  const hypocycloid = true;

  for (let step = 0; step < maxSteps; step++) {
    let { x, y } = equationFunc(step);

    // let's scale it down to 0-1

    // shift the circle from the center origin point so it's fully visible
    x += fullRadius;
    y += fullRadius;
    // divide by the diameter to get the x,y values to a [0,1] range
    x /= 2 * fullRadius;
    y /= 2 * fullRadius;
    // now that we have a 0-1 range we can just multiple by scale to get the correct size
    x *= scale;
    y *= scale;
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
