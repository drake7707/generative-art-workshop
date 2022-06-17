export function gear(ctx: CanvasPath, posX: number, posY: number, scale: number, nrOfTeeth: number = 5, startAngle: number = 0, innerRadiusFactor: number = 0.5) {
  const maxSteps = 2 * nrOfTeeth;

  for (let step: number = 0; step <= maxSteps; step++) {
    const t = step / maxSteps;

    const angle = startAngle + t * (2 * Math.PI);

    const halfScale = scale / 2;
    const outerRadius = halfScale;
    const innerRadius = halfScale * innerRadiusFactor;

    let outerX = posX + halfScale + outerRadius * Math.cos(angle);
    let outerY = posY + halfScale + outerRadius * Math.sin(angle);

    let innerX = posX + halfScale + innerRadius * Math.cos(angle);
    let innerY = posY + halfScale + innerRadius * Math.sin(angle);

    // the first step we move to the first point, then draw a line from there
    // if we don't do that and draw another shape somewhere else then we would connect
    // a line from that last position to the current x,y
    if (step == 0) {
      ctx.moveTo(outerX, outerY);
    } else {
      if (step % 2 == 0) {
        // inner -> outer
        ctx.lineTo(innerX, innerY);
        ctx.lineTo(outerX, outerY);
      } else {
        // outer -> inner
        ctx.lineTo(outerX, outerY);
        ctx.lineTo(innerX, innerY);
      }
    }
  }
}
