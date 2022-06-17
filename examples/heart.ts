/*
   Each .ts file is seen as a separate self contained module. Only the functions etc. that are exported 
   (by adding 'export' before function) are available to use in other modules.

   To use the function you need to add an import statement that references this module, like so:

   import { heart } from "./examples/heart";

   After that statement the function will be recognized and you will be able to use it as if it was defined in your own module
*/

/**
 * Adds a heart on given position and given size to the current path
 * This is an example of a parametric equation in function of t, with t sweeping the angle from 0 to 360° or 2*PI
 * The formula to determine x and y is.
 *
 * Nice visualisation can be found on https://www.geogebra.org/m/rqtfrhk9
 * Both x and y parts are scaled to 0-1 range before multiplying them with scale and moving the heart to the correct position
 * That way a heart is always the exact size given by the scale parameter
 */
export function heart(ctx: CanvasPath, offsetX: number, offsetY: number, scale: number, initialAngle: number = 0) {
  const maxSteps = 100;

  for (let step: number = 0; step <= maxSteps; step++) {
    const t = step / maxSteps;

    const angle = t * (2 * Math.PI);
    let x = (scale * (1 + (16 * Math.sin(angle) * Math.sin(angle) * Math.sin(angle)) / 16)) / 2;
    let y = (scale / 30) * (13 - (13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle)));

    // rotation matrix https://en.wikipedia.org/wiki/Rotation_matrix
    // to transform the points around its center, then offset
    let xx = x * Math.cos(initialAngle) - y * Math.sin(initialAngle);
    let yy = x * Math.sin(initialAngle) + y * Math.cos(initialAngle);
    xx += offsetX;
    yy += offsetY;

    // the first step we move to the first point, then draw a line from there
    // if we don't do that and draw another shape somewhere else then we would connect
    // a line from that last position to the current x,y
    if (step == 0) {
      ctx.moveTo(xx, yy);
    } else {
      ctx.lineTo(xx, yy);
    }
  }
}
