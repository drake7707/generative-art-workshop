import { PoissonDisc } from "./helper/poisson-disc-sampling";
import { Random } from "./helper/random";


export function star(ctx: CanvasPath, posX: number, posY: number, scale: number, startAngle: number = 0, innerRadius: number = 0.5) {
  const maxSteps = 2 * 5;

  for (let step: number = 0; step <= maxSteps; step++) {
    const t = step / maxSteps;

    const angle = Math.PI + Math.PI / 10 + startAngle + t * (2 * Math.PI);

    const halfScale = scale / 2;
    const radius = step % 2 == 0 ? halfScale : halfScale * innerRadius;
    let x = posX + halfScale + radius * Math.cos(angle);
    let y = posY + halfScale + radius * Math.sin(angle);

    // the first step we move to the first point, then draw a line from there
    // if we don't do that and draw another shape somewhere else then we would connect
    // a line from that last position to the current x,y
    if (step == 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
}

export function drawStars(ctx: CanvasPath, starSize: number, starSpacing: number, width: number, height: number) {
  let minDistance = starSpacing;
  const retries = 200;
  const rng = new Random();

  let pd = new PoissonDisc(width, height, minDistance, retries, rng, (x, y) => {
    // this is a inline function (or lambda function)
    // (x,y) => { .... } is the same as writing function(x,y) { return .... } (well almost the same)
    // it basically gives you the option to restrict the placement of stars 
    // the algorithm will evaluate this function before trying to place a star and if it returns false
    // then it won't place a star there. So if you for example if you want to restrict placement of stars 
    // within 200 pixels from the center:
    //
    //   const distanceFromCenter = Math.sqrt((x - (width/2))*(x - (width/2)) + (y - (height/2))*(y - (height/2)));
    //   return distanceFromCenter < 200;

    return true; // stars can be placed anywhere
  });
  // add the initial star in the middle
  pd.addInitialSample(width / 2, height / 2);
  // run until it's done
  while (!pd.isDone) {
    pd.step();
  }

  
  for (let sample of pd.samples) {

    star(ctx, sample.x, sample.y, starSize, rng.next()*Math.PI*2);
  }
}
