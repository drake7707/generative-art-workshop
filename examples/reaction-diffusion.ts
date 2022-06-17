import simplify = require("simplify-js");
import { GrayScott } from "./helper/gray-scott";
import { MarchingSquareCell, marchingSquares } from "./helper/marching-squares";
import { Random } from "./helper/random";

// default values for the reaction diffusion k,f are based on https://mrob.com/pub/comp/xmorphia/F540/F540-k630.html
function getMarchingSquaresResultFromReactionDiffusion(randomSeed: number, nrOfSeeds: number, grayScottSize: number, k: number, f: number, steps: number) {
  const gs = new GrayScott(grayScottSize, grayScottSize, k, f);

  const rng = new Random(randomSeed);

  for (let k: number = 0; k < nrOfSeeds; k++) {
    let x = Math.floor(rng.next() * (grayScottSize - 2));
    let y = Math.floor(rng.next() * (grayScottSize - 2));
    gs.addInitialSeed(x, y, rng);
  }

  console.log("running gs");
  for (let i: number = 0; i < steps; i++) {
    gs.step();
  }

  const cells: number[][] = [];
  for (let i = 0; i < grayScottSize; i++) {
    cells.push([]);
    for (let j = 0; j < grayScottSize; j++) {
      cells[i].push(0);
    }
  }
  gs.foreachCell((i, j, val) => {
    cells[i][j] = 255 - val;
  });
  console.log("done running gs");

  console.log("running marching squares");
  let result = marchingSquares(cells, 128, grayScottSize, grayScottSize);
  return result;
}

export function getReactionDiffusionSegments(
  scale: number,
  randomSeed: number = 12345,
  numberOfSeeds: number = 150,
  grayScottSize: number = 250,
  k: number = 0.063,
  f: number = 0.05,
  steps: number = 2000
) {
  const cellSize = scale / grayScottSize;

  const result = getMarchingSquaresResultFromReactionDiffusion(randomSeed, numberOfSeeds, grayScottSize, k, f, steps);

  let segments: LineSegment[] = [];
  for (let j: number = 0; j < grayScottSize; j++) {
    for (let i: number = 0; i < grayScottSize; i++) {
      const cell = result[j][i];
      if (cell.nr != 0 && cell.nr != 15) {
        let xOffset = i * cellSize;
        let yOffset = j * cellSize;

        let x1 = xOffset + cellSize * cell.p1.x + cellSize / 2;
        let y1 = yOffset + cellSize * cell.p1.y + cellSize / 2;
        let x2 = xOffset + cellSize * cell.p2.x + cellSize / 2;
        let y2 = yOffset + cellSize * cell.p2.y + cellSize / 2;

        segments.push(new LineSegment(x1, y1, x2, y2));
      }
    }
  }

  return segments;
}

export function getReactionDiffusionPath(
  scale: number,
  randomSeed: number = 12345,
  numberOfSeeds: number = 150,
  grayScottSize: number = 250,
  k: number = 0.060,
  f: number = 0.06,
  steps: number = 2000,
  simplifyPathTolerance: number = 0.01
) {
  const cellSize = scale / grayScottSize;

  const result = getMarchingSquaresResultFromReactionDiffusion(randomSeed, numberOfSeeds, grayScottSize, k, f, steps);

  console.log("rendering marching squares");
  const polygons = getPathsFromMarchingSquaresResult(result, grayScottSize, grayScottSize, cellSize);

  // reduce paths segments without losing quality much
  let segmentsRemovedCount = 0;
  let totalSegmentCount = 0;

  for(let polygon of polygons) {
  for (let p = 0; p < polygon.segments.length; p++) {
    let reducedPath = simplify(polygon.segments[p], simplifyPathTolerance, true);
    segmentsRemovedCount += polygon.segments[p].length - reducedPath.length;
    totalSegmentCount += polygon.segments[p].length;
    polygon.segments[p] = reducedPath;
  }
}
  console.log("Number of path segments removed: " + segmentsRemovedCount + "/" + totalSegmentCount);

  return polygons;
}

function getPathsFromMarchingSquaresResult(result: MarchingSquareCell[][], width: number, height: number, cellSize: number): Polygon[] {
  let polygons: Polygon[] = [];

  const visited: boolean[][] = [];
  for (let j: number = 0; j < height; j++) {
    visited.push([]);
    for (let i: number = 0; i < width; i++) {
      visited[j].push(false);
    }
  }

  //  let debugCanvas: HTMLCanvasElement = document.createElement("canvas");
  //  debugCanvas.width = width;
  //  debugCanvas.height = height;
  //  document.getElementById("container").parentNode.appendChild(debugCanvas);
  //  let debugCtx = debugCanvas.getContext("2d");

  const log = false;
  for (let j: number = 0; j < height; j++) {
    for (let i: number = 0; i < width; i++) {
      if (!visited[j][i]) {
        let nr = result[j][i].nr;
        if (nr != 0 && nr != 15) {
          let stepX = 0;
          let stepY = 0;

          let subSegment: Point[] = [];
          if (log) console.log("new subsegment at " + (i + "," + j));

          let curY = j + stepY;
          let curX = i + stepX;

          while (!visited[curY][curX]) {
            let oldNr = nr;

            nr = result[curY][curX].nr;
            if (nr != 0 && nr != 15) {
              let cellP1 = result[curY][curX].p1;
              let cellP2 = result[curY][curX].p2;

              let xOffset = (i + stepX) * cellSize;
              let yOffset = (j + stepY) * cellSize;

              let x1 = xOffset + cellSize * cellP1.x + cellSize / 2;
              let y1 = yOffset + cellSize * cellP1.y + cellSize / 2;
              let x2 = xOffset + cellSize * cellP2.x + cellSize / 2;
              let y2 = yOffset + cellSize * cellP2.y + cellSize / 2;

              if (oldNr == nr || (oldNr != nr && nr != 5 && nr != 10)) {
                // if we wrapped around don't flag it as visited
                visited[curY][curX] = true;
              }

              // debugCtx.fillStyle = `rgb(255, ${nr}, 255)`;
              // debugCtx.fillRect(i + stepX, j + stepY, 1, 1);
              if (subSegment.length == 0) {
                subSegment.push({ x: x1, y: y1 });
              }
              switch (nr) {
                case 4:
                case 12:
                case 13:
                  //right
                  //     console.log(nr + " going right");
                  //if (i + stepX + 1 < width)
                  stepX++;
                  if (x1 < x2) subSegment.push({ x: x2, y: y2 });
                  else subSegment.push({ x: x1, y: y1 });
                  break;

                case 5:
                  if (log) console.log(nr + " saddle point at " + (i + stepX) + ", " + (j + stepY));
                  if (oldNr == 2 || oldNr == 6 || oldNr == 14) {
                    // came from the bottom -> to right
                    if (log) console.log("came from bottom, go to right");
                    //if (i + stepX + 1 < width)
                    stepX++;
                    if (x1 < x2) subSegment.push({ x: x2, y: y2 });
                    else subSegment.push({ x: x1, y: y1 });
                  } else {
                    // came from the top -> to left
                    if (log) console.log("came from top, go to left");
                    //if (i + stepX - 1 >= 0)
                    stepX--;
                    if (x2 < x1) subSegment.push({ x: x2, y: y2 });
                    else subSegment.push({ x: x1, y: y1 });
                  }

                  break;
                case 10:
                  if (log) console.log(nr + " saddle point at " + (i + stepX) + ", " + (j + stepY));
                  if (oldNr == 1 || oldNr == 3 || oldNr == 7) {
                    // came from the right -> to right
                    if (log) console.log("came from bottom, go up");
                    //if (j + stepY - 1 >= 0)
                    stepY--;
                    if (y2 < y1) subSegment.push({ x: x2, y: y2 });
                    else subSegment.push({ x: x1, y: y1 });
                  } else {
                    // came from the left -> to bottom
                    if (log) console.log("came from left, go down");
                    //if (j + stepY + 1 < height)
                    stepY++;
                    if (y1 < y2) subSegment.push({ x: x2, y: y2 });
                    else subSegment.push({ x: x1, y: y1 });
                    break;
                  }

                  break;

                case 2:
                case 6:
                case 14:
                  //up
                  if (log) console.log(nr + " going up");
                  //if (j + stepY - 1 >= 0)
                  stepY--;
                  if (y2 < y1) subSegment.push({ x: x2, y: y2 });
                  else subSegment.push({ x: x1, y: y1 });
                  break;
                case 9:
                case 11:
                case 8:
                  //down
                  if (log) console.log(nr + " going down");
                  //if (j + stepY + 1 < height)
                  stepY++;
                  if (y1 < y2) subSegment.push({ x: x2, y: y2 });
                  else subSegment.push({ x: x1, y: y1 });
                  break;
                case 1:
                case 3:
                case 7:
                  // left
                  if (log) console.log(nr + " going left");
                  //if (i + stepX - 1 >= 0)
                  stepX--;
                  if (x2 < x1) subSegment.push({ x: x2, y: y2 });
                  else subSegment.push({ x: x1, y: y1 });
                  break;

                default:
              }
            } else {
              break;
            }

            curY = j + stepY;
            curX = i + stepX;
            if (curX < 0) curX += width; // wrap around
            if (curY < 0) curY += height;
            if (curX >= width) curX -= width;
            if (curY >= height) curY -= height;
          }
          if (subSegment.length > 0) {
            if (polygons.length > 0) {
              if (subSegment.every((p) => inside(p, polygons[polygons.length - 1].segments[0]))) {
                polygons[polygons.length - 1].segments.push(subSegment);
              } else {
                polygons.push({
                  segments: [subSegment],
                });
              }
            } else
              polygons.push({
                segments: [subSegment],
              });
          }
        }
      }
    }
  }
  return polygons;
}

function inside(point: Point, vs: Point[]) {
  // ray-casting algorithm based on
  // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html

  var x = point.x,
    y = point.y;

  var inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    var xi = vs[i].x,
      yi = vs[i].y;
    var xj = vs[j].x,
      yj = vs[j].y;

    var intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}

class LineSegment {
  constructor(public x1: number, public y1: number, public x2: number, public y2: number) {}
}

interface Point {
  x: number;
  y: number;
}

interface Polygon {
  segments: Point[][];
}
