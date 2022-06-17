export function hexagon(ctx: CanvasPath, posX: number, posY: number, scale: number, startAngle: number = 0) {
  const maxSteps = 6;
  regularShape(ctx, posX, posY, scale, maxSteps, startAngle);
}

export function regularShape(ctx: CanvasPath, posX: number, posY: number, scale: number, maxSteps:number, startAngle: number = 0) {

  for (let step: number = 0; step <= maxSteps; step++) {
    const t = step / maxSteps;

    const angle = startAngle + t * (2 * Math.PI);
    let x = posX + (scale * (1 + Math.cos(angle))) / 2;
    let y = posY + (scale * (1 + Math.sin(angle))) / 2;

    if (step == 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
}

export function drawBoard(
  ctx: CanvasPath,
  boardWidth: number,
  boardHeight: number,
  widthSpacing: number = 0,
  heightSpacing: number = 0,
  cellWidth: number = 100,
  cellHeight: number = 100,
  randomizeAngles: boolean = false
) {
  const offsetX = 1 + Math.cos((1 * Math.PI) / 3); // 1 + that little bit to align the alt row with
  const offsetY = Math.sin((1 * Math.PI) / 3) / 2; // the height of a hexagon is actually not 1 but 0.87 because both selected points are not at the max y of the circle
  const altRowOffset = 0.5 + Math.cos((1 * Math.PI) / 3) / 2;

  for (let j: number = 0; j < boardHeight; j++) {
    for (let i: number = 0; i < boardWidth; i++) {
      const angle = randomizeAngles ? Math.PI * Math.random() : 0;

      if (j % 2 == 0) {
        hexagon(ctx, i * (cellWidth * offsetX) + widthSpacing * i, j * (cellHeight * offsetY) + heightSpacing * j, cellWidth, angle);
      } else {
        hexagon(
          ctx,
          altRowOffset * cellWidth + widthSpacing / 2 + i * (cellWidth * offsetX) + widthSpacing * i,
          j * (cellHeight * offsetY) + heightSpacing * j,
          j % 2 == 0 ? cellWidth : cellWidth,
          angle
        );
      }
    }
  }
}
