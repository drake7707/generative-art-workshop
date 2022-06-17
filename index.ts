import { animate, initialize, run, setStatus } from "./boilerplate";
import { star } from "./examples/star";
import { heart } from "./examples/heart";
import { getPoissonDiscSamples } from "./examples/helper/poisson-disc-sampling";
import { rose } from "./examples/rose";
import { epicycloid, hypocycloid } from "./examples/spirograph";
import { hexagon, regularShape } from "./examples/regular-shapes";
import { getReactionDiffusionPath } from "./examples/reaction-diffusion";
import { gear } from "./examples/gear";
import { Random } from "./examples/helper/random";
import { welcome } from "./examples/welcome";
import { voronoiTiling } from "./examples/helper/voronoi";
import { DiamondSquare } from "./examples/helper/diamond-square";
import { circleCircleIntersection, distance, doesSegmentsIntersect } from "./examples/helper/math";
import { rgb } from "./examples/helper/colors";

// create a context to use as a "toolbox"
const svgWidth = 600;
const svgHeight = 600;
var ctx = initialize(svgWidth, svgHeight);
// --------------------------------------------------------------------------------------

// This is the template for the generative art workshop
// Some handy pointers:
// - Stackblitz supports code formatting so it's nicely indented (ctrl+alt+F) or the P icon on the upper right of the code window
// - There is a very nice smart suggestion available, use CTRL+SPACE to trigger it. It shows you which functions there are and what its parameters are

// You can play around with these values. The context has a number of properties that will
// affect the drawing.
ctx.lineWidth = 1;
ctx.strokeStyle = "black"; // the stroke color, try changing it to another color like "red"
ctx.fillStyle = "lightgray"; // the fill color

// +-------------------+
// + Welcome animation +
// +-------------------+
welcome(ctx);
// ---------------------

// +-------------------------------------------------------------------------------------------------------------------------+
// + Below are various patterns, uncomment the animate() function call to show a step by step drawing of the pattern,        +
// + you can slow it down or speed it up if you change (or add) the second parameter,  that's the milliseconds between steps +
// + The red dotted path is the current open path built up since the last ctx.beginPath() call                               +
// +                                                                                                                         +
// + If you want the instant result instead then uncomment the run() function call instead                                   +
// +                                                                                                                         +
// + Commented lines are prefixed with //, this will let the computer ignore that line), so if you remove the // it will     +
// + execute that line                                                                                                       +
// +-------------------------------------------------------------------------------------------------------------------------+

// +--------------------------------------------+
// +              Simple circles pattern        +
// +--------------------------------------------+
//animate(circlesPattern, 100);
//run(circlesPattern); // or this to show it immediate
function* circlesPattern() {
  // Play around with these variable values and see what it affects visually
  // Can you think of what the result will be before you change a value?
  const boardWidth = 11;
  const boardHeight = 11;
  const scale = 30;
  const minRadius = 0.1; // range: 0-1
  const maxRadius = 0.8; // range: 0-1
  // Code snippet that uses the variables to generate the pattern, you don't need to change this

  for (let y = 0; y < boardHeight; y++) {
    for (let x = 0; x < boardWidth; x++) {
      ctx.beginPath();

      const offsetX = x * scale;
      const offsetY = y * scale;

      let radiusCircle = minRadius + Math.random() * (maxRadius - minRadius);

      radiusCircle = (radiusCircle * scale) / 2;
      // drawing a circle starts from the right middle of the circle so move the pen in position
      // otherwise it will automatically draw a line from its last position, comment the line below to see the issue
      // (but only if you make it one single path, if you start a new path for every circle it doesn't start from a previous pen posiiton)
      //ctx.moveTo(offsetX + scale / 2 + radiusCircle, offsetY + scale / 2);
      ctx.arc(offsetX + scale / 2, offsetY + scale / 2, radiusCircle, 0, Math.PI * 2);

      yield;
      ctx.stroke();
    }
  }
}

// +------------------------------------------------+
// +              Ziggy zaggy pattern               +
// +   https://en.wikipedia.org/wiki/Truchet_tiles  +
// +------------------------------------------------+
//animate(ziggyZaggyPattern);
//run(ziggyZaggyPattern);
function* ziggyZaggyPattern() {
  // Play around with these variable values and see what it affects visually
  // Can you think of what the result will be before you change a value?
  const boardWidth = 10;
  const boardHeight = 10;
  const scaleX = 50;
  const scaleY = 50;
  const probability = 0.5; // range: 0-1
  // Code snippet that uses the variables to generate the pattern, you don't need to change this

  for (let y = 0; y < boardHeight; y++) {
    for (let x = 0; x < boardWidth; x++) {
      ctx.beginPath();
      const offsetX = x * scaleX;
      const offsetY = y * scaleY;

      if (Math.random() < probability) {
        ctx.moveTo(offsetX + 0, offsetY + 0);
        ctx.lineTo(offsetX + 1 * scaleX, offsetY + 1 * scaleY);
      } else {
        ctx.moveTo(offsetX + 1 * scaleX, offsetY + 0);
        ctx.lineTo(offsetX + 0 * scaleX, offsetY + 1 * scaleY);
      }

      yield;
      ctx.stroke();
    }
  }
}
// -------------------------------------------------

// +------------------------------------------------+
// +   Quarter circles truchet tiles pattern        +
// +   https://en.wikipedia.org/wiki/Truchet_tiles  +
// +------------------------------------------------+
//animate(quarterCirclesTruchetTiles);
//run(quarterCirclesTruchetTiles);
function* quarterCirclesTruchetTiles() {
  // Play around with these variable values and see what it affects visually
  // Can you think of what the result will be before you change a value?
  const boardWidth = 30;
  const boardHeight = 30;
  const scale = 20;
  const probability = 0.5; // range 0-1
  // Code snippet that uses the variables to generate the pattern, you don't need to change this

  for (let y = 0; y < boardHeight; y++) {
    for (let x = 0; x < boardWidth; x++) {
      ctx.beginPath();

      const offsetX = x * scale;
      const offsetY = y * scale;

      //ctx.rect(offsetX, offsetY, scale, scale);

      const radiusCircle1 = scale / 2;
      const radiusCircle2 = scale / 2;
      if (Math.random() < probability) {
        // tile 1
        // quarter circle left top
        ctx.moveTo(offsetX + radiusCircle1, offsetY);
        ctx.arc(offsetX, offsetY, radiusCircle1, 0, Math.PI / 2);
        // quarter circle right bottom
        ctx.moveTo(offsetX + scale - radiusCircle2, offsetY + scale);
        ctx.arc(offsetX + scale, offsetY + scale, radiusCircle2, Math.PI, Math.PI + Math.PI / 2);
      } else {
        // tile 2
        // quarter circle right top
        ctx.moveTo(offsetX + scale, offsetY + radiusCircle1);
        ctx.arc(offsetX + scale, offsetY, radiusCircle1, Math.PI / 2, Math.PI / 2 + Math.PI / 2);
        // quarter circle left bottom
        ctx.moveTo(offsetX, offsetY + scale - radiusCircle2);
        ctx.arc(offsetX, offsetY + scale, radiusCircle2, (3 * Math.PI) / 2, 0);
      }

      yield;
      ctx.stroke();
    }
  }
}
// -------------------------------------------------

// +---------------------------------------------------------------------+
// +   Quarter circles* truchet tiles pattern                            +
// +   but with more tiles:                                              +
// +   https://www.instructables.com/A-Maze-ing-Fun-with-Truchet-Tiles/  +
// +---------------------------------------------------------------------+
//animate(advancedQuarterCirclesTruchetTiles);
//run(advancedQuarterCirclesTruchetTiles);
function* advancedQuarterCirclesTruchetTiles() {
  // Play around with these variable values and see what it affects visually
  // Can you think of what the result will be before you change a value?
  const boardWidth = 40;
  const boardHeight = 40;
  const scale = 15;
  // Code snippet that uses the variables to generate the pattern, you don't need to change this

  for (let y = 0; y < boardHeight; y++) {
    for (let x = 0; x < boardWidth; x++) {
      ctx.beginPath();
      const offsetX = x * scale;
      const offsetY = y * scale;

      // ctx.rect(offsetX, offsetY, scale, scale);

      const radiusCircle1 = scale / 2;
      const radiusCircle2 = scale / 2;

      let val = Math.random();
      if (val < 0.25) {
        // tile 1
        // quarter circle left top
        ctx.moveTo(offsetX + radiusCircle1, offsetY);
        ctx.arc(offsetX, offsetY, radiusCircle1, 0, Math.PI / 2);
        // quarter circle right bottom
        ctx.moveTo(offsetX + scale - radiusCircle2, offsetY + scale);
        ctx.arc(offsetX + scale, offsetY + scale, radiusCircle2, Math.PI, Math.PI + Math.PI / 2);
      } else if (val < 0.5) {
        // tile 2
        // quarter circle right top
        ctx.moveTo(offsetX + scale, offsetY + radiusCircle1);
        ctx.arc(offsetX + scale, offsetY, radiusCircle1, Math.PI / 2, Math.PI / 2 + Math.PI / 2);
        // quarter circle left bottom
        ctx.moveTo(offsetX, offsetY + scale - radiusCircle2);
        ctx.arc(offsetX, offsetY + scale, radiusCircle2, (3 * Math.PI) / 2, 0);
      } else if (val < 0.75) {
        // tile 3 (+ shape)
        // vertical line
        ctx.moveTo(offsetX + scale / 2, offsetY);
        ctx.lineTo(offsetX + scale / 2, offsetY + scale);
        // horizontal line
        ctx.moveTo(offsetX, offsetY + scale / 2);
        ctx.lineTo(offsetX + scale, offsetY + scale / 2);
      } else if (val < 1) {
        // tile 4 (roundabout shape)
        // circle in the middle
        ctx.moveTo(offsetX + scale / 2 + radiusCircle1 / 2, offsetY + scale / 2);
        ctx.arc(offsetX + scale / 2, offsetY + scale / 2, radiusCircle1 / 2, 0, Math.PI * 2);
        // vertical top line
        ctx.moveTo(offsetX + scale / 2, offsetY);
        ctx.lineTo(offsetX + scale / 2, offsetY + scale / 2 - radiusCircle1 / 2);
        // vertical bottom line
        ctx.moveTo(offsetX + scale / 2, offsetY + scale / 2 + radiusCircle1 / 2);
        ctx.lineTo(offsetX + scale / 2, offsetY + scale);
        // horizontal left line
        ctx.moveTo(offsetX, offsetY + scale / 2);
        ctx.lineTo(offsetX + scale / 2 - radiusCircle1 / 2, offsetY + scale / 2);
        // horizontal right line
        ctx.moveTo(offsetX + scale / 2 + radiusCircle1 / 2, offsetY + scale / 2);
        ctx.lineTo(offsetX + scale, offsetY + scale / 2);
      }

      yield;
      ctx.stroke();
    }
  }
}
// -------------------------------------------------

// +--------------------------------------------+
// +              Poisson disc sampling         +
// +  https://www.jasondavies.com/poisson-disc/ +
// +--------------------------------------------+
//animate(poissonDiscSampling);
//run(poissonDiscSampling);
function* poissonDiscSampling() {
  // Play around with these variable values and see what it affects visually
  // Can you think of what the result will be before you change a value?
  const width = 500;
  const height = 500;
  const scale = 20;
  const starIndentFactor = 0.6; // range 0-1
  const minDistance = 50; // minimum distance between the center points of the circle
  const probabilityOfAStar = 0.5; // range 0-1
  const randomRotation = false; // either 'true' or 'false'
  // Code snippet that uses the variables to generate the pattern, you don't need to change this

  const samples = getPoissonDiscSamples(width, height, width / 2, height / 2, minDistance);
  for (let sample of samples) {
    ctx.beginPath();
    // draw a star on the sample position, with a random rotation
    const angle = randomRotation ? Math.random() * Math.PI * 2 : 0;
    if (Math.random() < probabilityOfAStar) {
      star(ctx, sample.x, sample.y, scale, angle, starIndentFactor);
    } else {
      heart(ctx, sample.x, sample.y, scale, angle);
    }

    yield;
    ctx.stroke();
  }
}
// -------------------------------------------------

// +--------------------------------------------+
// +              Spirograph                    +
// +  https://en.wikipedia.org/wiki/Epicycloid  +
// +  https://en.wikipedia.org/wiki/Hypocycloid +
// +--------------------------------------------+
//animate(spirograph);
//run(spirograph);
function* spirograph() {
  // Play around with these variable values and see what it affects visually
  // Can you think of what the result will be before you change a value?
  const maxSteps = 500;
  const revolutions = 5; // range 1+
  const k = 19 / 5; // range 1+ (check wikipedia)

  const hypocycloid = true;

  const scale = 500;
  const offsetX = 50;
  const offsetY = 50;

  // Code snippet that uses the variables to generate the pattern, you don't need to change this
  ctx.beginPath();
  for (let step = 0; step < maxSteps; step++) {
    let t = step / maxSteps;
    let angle = t * Math.PI * 2 * revolutions;
    const r = 1; // doesn't matter because we scale to 0-1 so we end up cancelling out r
    let x, y;
    if (hypocycloid) {
      x = r * (k - 1) * Math.cos(angle) + r * Math.cos((k - 1) * angle);
      y = r * (k - 1) * Math.sin(angle) - r * Math.sin((k - 1) * angle);
    } else {
      x = r * (k + 1) * Math.cos(angle) - r * Math.cos((k + 1) * angle);
      y = r * (k + 1) * Math.sin(angle) - r * Math.sin((k + 1) * angle);
    }
    // let's scale it down to 0-1
    let fullRadius;
    if (hypocycloid) {
      // the smaller circle is contained within the larger one so just the radius of the larger circle k*r
      fullRadius = k * r;
    } else {
      // k*r is the radius of the inner circle and 2*r is the diameter of the outer circle
      fullRadius = k * r + 2 * r;
    }
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

    yield;
  }
  ctx.stroke();
}

// -------------------------------------------------

// +---------------------------------------------------------------+
// +              Various shapes                                   +
// +  Various shapes have been implemented in the examples folder  +
// +  as functions                                                 +
// +  This shows how to use them                                    +
// +---------------------------------------------------------------+
//animate(variousShapes);
//run(variousShapes);
function* variousShapes() {
  // Play around with these variable values and see what it affects visually
  // Can you think of what the result will be before you change a value?
  const width = 500;
  const height = 500;
  const scale = 50;
  const minDistance = 75; // minimum distance between the center points of the circle

  // Code snippet that uses the variables to generate the pattern, you don't need to change this
  // though you can change the function parameters below to change the shapes

  const samples = getPoissonDiscSamples(width, height, width / 2, height / 2, minDistance);

  let idx = 0;
  for (let idx = 0; idx < samples.length; idx++) {
    ctx.beginPath();
    const sample = samples[idx];
    // draw a star on the sample position, with a random rotation
    switch (idx % 5) {
      case 0:
        epicycloid(ctx, sample.x, sample.y, scale, 19 / 5, 5);
        break;

      case 1:
        hypocycloid(ctx, sample.x, sample.y, scale, 19 / 5, 5);
        break;

      case 2:
        // https://en.wikipedia.org/wiki/Rose_(mathematics)
        rose(ctx, sample.x, sample.y, scale, 6, 1);
        break;

      case 3:
        const sides = 3 + Math.floor(Math.random() * 6); // take random sides between 3 and 8
        regularShape(ctx, sample.x, sample.y, scale, sides, 0);
        break;

      case 4:
        const nrOfTeeth = 5 + Math.floor(Math.random() * 6);
        const innerRadiusFactor = 0.5 + Math.random() * 0.3;
        gear(ctx, sample.x, sample.y, scale, nrOfTeeth, 0, innerRadiusFactor);
        break;
    }

    yield;
    ctx.stroke();
  }
}

// -------------------------------------------------

// +---------------------------------------------------------------+
// +              Hexagon grid                                     +
// +  Tiling is a bit more difficult than a rectangular grid       +
// +  because it requires offsets between even and odd rows        +
// +  And it also supports hor. en vert. spacing between tiles     +
// +---------------------------------------------------------------+
//animate(hexagonTiling, 100);
//run(hexagonTiling);
function* hexagonTiling() {
  // Play around with these variable values and see what it affects visually
  // Can you think of what the result will be before you change a value?
  const boardWidth: number = 10;
  const boardHeight: number = 10;
  const widthSpacing: number = 0;
  const heightSpacing: number = 0;
  const cellWidth: number = 40;
  const cellHeight: number = 40;
  const randomizeAngles: boolean = false;

  // Code snippet that uses the variables to generate the pattern, you don't need to change this
  const baseOffsetX = 1 + Math.cos((1 * Math.PI) / 3); // 1 + that little bit to align the odd row with
  const baseOffsetY = Math.sin((1 * Math.PI) / 3) / 2; // the height of a hexagon is actually not 1 but 0.87 because both selected points are not at the max y of the circle
  const oddRowOffsetX = 0.5 + Math.cos((1 * Math.PI) / 3) / 2;

  for (let j: number = 0; j < boardHeight; j++) {
    for (let i: number = 0; i < boardWidth; i++) {
      const angle = randomizeAngles ? Math.PI * Math.random() : 0;

      ctx.beginPath();
      if (j % 2 == 0) {
        // even row
        let x = i * (cellWidth * baseOffsetX); // base position the tiling but make it slightly larger to align with the odd row
        x += i * widthSpacing; // horizontal spacing
        let y = j * (cellHeight * baseOffsetY); // base vertical position in the tiling
        y += j * heightSpacing; // vertical spacing
        hexagon(ctx, x, y, cellWidth, angle);
      } else {
        // odd row
        let x = i * (cellWidth * baseOffsetX); // base horizontal position the tiling but make it slightly larger to align with the odd row
        x += widthSpacing * i; // horizontal spacing
        x += oddRowOffsetX * cellWidth; // offset the odd rows to interlink with the even rows above and below
        x += widthSpacing / 2; // center the odd row hexagons in the middle of the spacing
        let y = j * (cellHeight * baseOffsetY); // base vertical position in the tiling
        y += heightSpacing * j; // vertical spacing
        hexagon(ctx, x, y, cellWidth, angle);
      }

      setStatus("i = ", i, "j = ", j);
      yield; // set the status and then yield so it can draw and update the sceen
      ctx.fill();
      ctx.stroke();
    }
  }
}
// -------------------------------------------------

// +---------------------------------------------------------------+
// +              Voronoi cells                                    +
// + https://en.wikipedia.org/wiki/Voronoi_diagram                 +
// +---------------------------------------------------------------+
//animate(voronoi);
//run(voronoi);
function* voronoi() {
  // Play around with these variable values and see what it affects visually
  // Can you think of what the result will be before you change a value?
  const width = 500;
  const height = 500;
  const minDistance = 20; // minimum distance between the center points of the voronoi cells
  const randomSeed = 123645; // range any number really
  const doFill = true;
  const hue = 200; // range 0 - 360
  const minSaturation = 50; // range 0-100
  const minLightness = 50; // range 0-100
  const maxSaturation = 100; // range 0-100
  const maxLightness = 100; // range 0-100
  const doStroke = true;

  // Code snippet that uses the variables to generate the pattern, you don't need to change this
  const rng = new Random(randomSeed);
  // get some random distributed points with poisson disc sampling
  const points = getPoissonDiscSamples(width, height, width / 2, height / 2, minDistance, rng).map((s) => {
    return { x: s.x, y: s.y };
  });

  let voronoiResult = voronoiTiling(points);

  // fill
  if (doFill) {
    for (let vertices of voronoiResult.polygons) {
      const randomValue = rng.next();
      const saturation = minSaturation + randomValue * (maxSaturation - minSaturation);
      const lightness = minLightness + randomValue * (maxLightness - minLightness);
      ctx.fillStyle = `hsl(${hue},${saturation.toFixed()}%,${lightness.toFixed()}%)`;

      ctx.beginPath();
      ctx.moveTo(vertices[0].x, vertices[0].y);
      for (let i = 1; i < vertices.length; i++) {
        ctx.lineTo(vertices[i].x, vertices[i].y);
      }

      yield;
      ctx.fill();
    }
  }

  // draw the edges
  if (doStroke) {
    ctx.beginPath();

    for (let edge of voronoiResult.edges) {
      ctx.moveTo(edge.x1, edge.y1);
      ctx.lineTo(edge.x2, edge.y2);
      yield;
    }
    ctx.stroke();
  }
}
// --------------------------------------------------------------------------------------

// +----------------------------------------------------------------------------------+
// +              Reaction diffusion                                                  +
// + https://www.karlsims.com/rd.html                                                 +
// + https://mrob.com/pub/comp/xmorphia/index.html                                    +
// + https://sarah.skyon.be/Content/Projects/reactiondiffusion/reactiondiffusion.html +
// +----------------------------------------------------------------------------------+
//animate(reactionDiffusion,100);
//run(reactionDiffusion);
function* reactionDiffusion() {
  // Play around with these variable values and see what it affects visually
  // Can you think of what the result will be before you change a value?
  const scale = 200;
  const tileWidth = 3;
  const tileHeight = 3;
  const tileOutsideArea = true; // set to true to make sure the outside area is still drawn on the edges
  const simplifyPathTolerance = 0.01; // reduces the line segments to within a tolerance (reduces the laser cutter number of instructions draw a line)
  const randomSeed: number = 12345;
  const fill = true;

  const k: number = 0.063; // make very tiny changes to this, the more steps, the more it will diverge
  const f: number = 0.05;

  const numberOfInitialSeeds: number = 150; // the number of starting points to introduce the other gas to diffuse
  const grayScottSize: number = 200; // the area of the simulation, bigger means slower.
  const steps: number = 4000; // the more steps, the longer the simulation will run

  const colorPalette: string[] = ["rgb(224,91,75)", "rgb(224,147,54)", "rgb(218,181,82)", "rgb(219,217,166)", "rgb(218,181,82)", "rgb(135,180,156)", "rgb(75,138,126)"];

  // Code snippet that uses the variables to generate the pattern, you don't need to change this

  const reactionDiffusionPaths = getReactionDiffusionPath(scale, randomSeed, numberOfInitialSeeds, grayScottSize, k, f, steps, simplifyPathTolerance);

  // define a clip path to contain
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, scale * tileWidth, scale * tileHeight);
  ctx.clip();

  let colorIndex = 0;
  for (let j = tileOutsideArea ? -1 : 0; j < tileWidth + (tileOutsideArea ? 1 : 0); j++) {
    for (let i = tileOutsideArea ? -1 : 0; i < tileHeight + (tileOutsideArea ? 1 : 0); i++) {
      let offsetX = i * scale;
      let offsetY = j * scale;

      for (let polygon of reactionDiffusionPaths) {
        ctx.beginPath();

        for (let segment of polygon.segments) {
          ctx.moveTo(offsetX + segment[0].x, offsetY + segment[0].y);
          for (let i = 1; i < segment.length; i++) {
            ctx.lineTo(offsetX + segment[i].x, offsetY + segment[i].y);
          }
        }
        //const val = Math.random() * 360;
        //ctx.fillStyle = `hsl(${val},100%,75%)`; // hue - saturation - lightness

        // take a color from the color palette and increment the color index, but make sure to keep
        // within bounds of the palette (module operator wraps around)
        ctx.fillStyle = colorPalette[colorIndex++ % colorPalette.length];

        if (i >= 0 && j >= 0) {
          yield;
        }
        if (fill) ctx.fill();
        ctx.stroke();
      }
    }
  }
  // remove the clip path by reverting to the state when we called ctx.save()
  ctx.restore();
}
// -------------------------------------------------

// +----------------------------------------------------------------------------------+
// +              Flow field                                                          +
// + https://medium.com/@bit101/flow-fields-part-i-3ebebc688fd8                       +
// + https://tylerxhobbs.com/essays/2020/flow-fields                                  +
// + https://en.wikipedia.org/wiki/Diamond-square_algorithm                           +
// +----------------------------------------------------------------------------------+
//animate(flowField, 1);
//run(flowField);
function* flowField() {
  // Play around with these variable values and see what it affects visually
  // Can you think of what the result will be before you change a value?
  const width = 500;
  const height = 500;
  const minDistance = 10;
  const segmentLineSize = 10;
  const randomSeed = 12345;
  const noiseRoughness = 0.2;

  // Code snippet that uses the variables to generate the pattern, you don't need to change this

  const rng = new Random(randomSeed);
  const diamondSquareNoise = new DiamondSquare(width, rng, noiseRoughness);

  //const fieldAngleAt = (x, y) => ((x / width + y / height) / 2) * (Math.PI * 2);
  // take random angles from the noise field
  const fieldAngleAt = (x, y) => diamondSquareNoise.getValue(x, y) * Math.PI * 2;

  let flowField: number[][] = [];
  for (let y = 0; y < height; y++) {
    flowField.push([]);
    for (let x = 0; x < width; x++) {
      const value = fieldAngleAt(x, y);
      flowField[y].push(value);
    }
  }

  let segments: { x: number; y: number; x2: number; y2: number }[] = [];

  const samples = getPoissonDiscSamples(width, height, width / 2, height / 2, minDistance, rng);

  for (let s of samples) {
    let x = s.x;
    let y = s.y;

    const angle = fieldAngleAt(x, y);
    let x2 = x + segmentLineSize * Math.cos(angle);
    let y2 = y + segmentLineSize * Math.sin(angle);

    let segmentIntersects = false;
    let currentSegment = { x, y, x2, y2 };
    for (let seg of segments) {
      if (doesSegmentsIntersect(seg.x, seg.y, seg.x2, seg.y2, currentSegment.x, currentSegment.y, currentSegment.x2, currentSegment.y2)) {
        segmentIntersects = true;
        break;
      }
    }

    if (!segmentIntersects) {
      ctx.beginPath();
      ctx.lineWidth = 3 * rng.next();
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      segments.push(currentSegment);

      yield;
    }
  }
}
// -------------------------------------------------

// +----------------------------------------------------------------------------------+
// +              Particles in a flow field                                           +
// + Rather than drawing line segments, drop a particle at some place and follow its  +
// + path along the flow field
// +----------------------------------------------------------------------------------+
//animate(particles, 1);
//run(particles);
function* particles() {
  // Play around with these variable values and see what it affects visually
  // Can you think of what the result will be before you change a value?
  const width = 500;
  const height = 500;

  const randomSeed = 12345;
  const noiseRoughness = 0.5;
  const alpha = 0.2;
  const nrOfParticles = 1000;
  const nrOfSteps = 400;
  // Code snippet that uses the variables to generate the pattern, you don't need to change this
  const rng = new Random(randomSeed);
  const diamondSquareNoise = new DiamondSquare(width, rng, noiseRoughness);

  ctx.globalAlpha = alpha;
  for (let i = 0; i < nrOfParticles; i++) {
    let x = Math.floor(rng.next() * width);
    let y = Math.floor(rng.next() * height);

    ctx.beginPath();
    ctx.moveTo(x, y);

    for (let step = 0; step < nrOfSteps; step++) {
      let angle = diamondSquareNoise.getValue(Math.floor(x), Math.floor(y)) * Math.PI * 2;
      x += Math.cos(angle);
      y += Math.sin(angle);

      ctx.lineTo(x, y);

      if (x < 0 || y < 0 || x >= width || y >= height) break; // stop when reaching the edge
      if (step % 10 == 0) yield;
    }
    ctx.stroke();
  }
}
// -------------------------------------------------

// +----------------------------------------------------------------------------------------+
// +              Vogel's model                                                             +
// + https://en.wikipedia.org/wiki/Fermat%27s_spiral#The_golden_ratio_and_the_golden_angle  +                                                           +
// +----------------------------------------------------------------------------------------+
//animate(vogelsModel);
//run(vogelsModel);
function* vogelsModel() {
  // Play around with these variable values and see what it affects visually
  // Can you think of what the result will be before you change a value?
  const maxSteps = 500;
  const maxRadiusOfCirclePoints = 4;
  const offsetX = svgWidth / 2;
  const offsetY = svgHeight / 2;
  const n = 1;
  const c = 6;
  const goldenAngle = 137.508; // in degrees

  // Code snippet that uses the variables to generate the pattern, you don't need to change this
  for (let step = 0; step < maxSteps; step++) {
    const t = step / maxSteps;
    const angle = step * ((goldenAngle / 180) * Math.PI);

    const radius = c * Math.sqrt(n);

    let x = offsetX + radius * Math.sqrt(angle) * Math.cos(angle);
    let y = offsetY + radius * Math.sqrt(angle) * Math.sin(angle);

    ctx.beginPath();
    ctx.arc(x, y, 2 + t * maxRadiusOfCirclePoints, 0, Math.PI * 2);
    ctx.fillStyle = rgb(255, t * 255, 0);
    ctx.fill();
    ctx.stroke();

    yield;
  }
}
// -------------------------------------------------

//animate(flowerOfLife, 1);
function* flowerOfLife() {
  const offsetX = 200;
  const offsetY = 200;
  const radius = 20;

  ctx.beginPath();
  ctx.arc(offsetX, offsetY, radius, 0, Math.PI * 2);
  ctx.stroke();

  const maxSteps = 3;
  let circlePoints: { x: number; y: number; baseCircleX: number; baseCircleY: number }[] = [];
  for (let step = 0; step < maxSteps; step++) {
    const t = step / maxSteps;
    const angle = t * Math.PI * 2;

    let x = radius * Math.cos(angle);
    let y = radius * Math.sin(angle);
    circlePoints.push({ x, y, baseCircleX: 0, baseCircleY: 0 });
  }

  let pointsVisitedSet = new Set();
  const maxRounds = 5;

  let colors = ["black", "red", "green", "blue", "cyan", "yellow"];
  for (let round = 0; round < maxRounds; round++) {
    const pointsForNextRound: { x: number; y: number; baseCircleX: number; baseCircleY: number }[] = [];

    for (let p = 0; p < circlePoints.length; p++) {
      let pt = circlePoints[p];
      let nextPt = circlePoints[(p + 1) % circlePoints.length];

      if (!pointsVisitedSet.has(`${pt.x.toFixed(2)}_${pt.y.toFixed(2)}`)) {
        pointsVisitedSet.add(`${pt.x.toFixed(2)}_${pt.y.toFixed(2)}`);

        ctx.beginPath();
        ctx.arc(offsetX + pt.x, offsetY + pt.y, radius, 0, Math.PI * 2);
        //ctx.strokeStyle = colors[round];
        ctx.stroke();
      }
      let intersectionPoints = circleCircleIntersection(pt.x, pt.y, radius, nextPt.x, nextPt.y, radius);

      const eps = 0.01;

      if (Math.abs(intersectionPoints[0]) >= eps || Math.abs(intersectionPoints[2]) >= eps) {
        pointsForNextRound.push({ x: intersectionPoints[0], y: intersectionPoints[2], baseCircleX: pt.x, baseCircleY: pt.y });
        // ctx.fillStyle = colors[round];
        // ctx.beginPath();
        // ctx.arc(offsetX + intersectionPoints[0], offsetY + intersectionPoints[2], 5, 0, Math.PI * 2);
        // ctx.fill();
      }
      if (Math.abs(intersectionPoints[1]) >= eps || Math.abs(intersectionPoints[3]) >= eps) {
        pointsForNextRound.push({ x: intersectionPoints[1], y: intersectionPoints[3], baseCircleX: pt.x, baseCircleY: pt.y });
        // ctx.fillStyle = colors[round];
        // ctx.beginPath();
        // ctx.arc(offsetX + intersectionPoints[1], offsetY + intersectionPoints[3], 5, 0, Math.PI * 2);
        // ctx.fill();
      }

      intersectionPoints = circleCircleIntersection(pt.x, pt.y, radius, pt.baseCircleX, pt.baseCircleY, radius);

      if (Math.abs(intersectionPoints[0]) >= eps || Math.abs(intersectionPoints[2]) >= eps) {
        pointsForNextRound.push({ x: intersectionPoints[0], y: intersectionPoints[2], baseCircleX: pt.x, baseCircleY: pt.y });
        // ctx.fillStyle = colors[round];
        // ctx.beginPath();
        // ctx.arc(offsetX + intersectionPoints[0], offsetY + intersectionPoints[2], 5, 0, Math.PI * 2);
        // ctx.fill();
      }
      if (Math.abs(intersectionPoints[1]) >= eps || Math.abs(intersectionPoints[3]) >= eps) {
        pointsForNextRound.push({ x: intersectionPoints[1], y: intersectionPoints[3], baseCircleX: pt.x, baseCircleY: pt.y });
        // ctx.fillStyle = colors[round];
        // ctx.beginPath();
        // ctx.arc(offsetX + intersectionPoints[1], offsetY + intersectionPoints[3], 5, 0, Math.PI * 2);
        // ctx.fill();
      }

      yield;
    }
    circlePoints = pointsForNextRound;
  }
}
