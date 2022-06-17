import Delaunator = require("delaunator");
import { CanvasRenderingContext2DWrapper, render } from "../boilerplate";

import { getPoissonDiscSamples } from "./helper/poisson-disc-sampling";
import { Random } from "./helper/random";
import { voronoiTiling } from "./helper/voronoi";

export function welcome(ctx: CanvasRenderingContext2DWrapper) {
  document.getElementById("download").hidden =true; // can't download as the animation never finishes

  const width = ctx.canvas.width + 200;
  const height = ctx.canvas.height + 200;
  const offsetX = -100;
  const offsetY = -100;

  const minDistance = 30; // minimum distance between the center points of the voronoi cells
  const randomSeed = 12345;
  const doFill = true;
  let hue = 200; // 0 - 360
  const minSaturation = 50;
  const minLightness = 50;
  const maxSaturation = 100;
  const maxLightness = 100;
  
  const doStroke = true;

  // Code snippet that uses the variables to generate the pattern, you don't need to change this
  const rng = new Random(randomSeed);
  // get some random distributed points with poisson disc sampling
  const points = getPoissonDiscSamples(width, height, width / 2, height / 2, minDistance, rng).map((s) => {
    return { x: s.x, y: s.y };
  });

  let voronoiResult = voronoiTiling(points);

  let colorAngles: number[] = [];

  const drawingFunc = () => {

    ctx.globalAlpha=0.7;

    // fill
    if (doFill) {
      let facetIndex = 0;

      for (let vertices of voronoiResult.polygons) {
        if (facetIndex >= colorAngles.length) {
          colorAngles.push(rng.next()*Math.PI*2);
        }
            const randomValue = (1+Math.sin(colorAngles[facetIndex]))/2;
          const saturation = minSaturation + randomValue * (maxSaturation - minSaturation);
          const lightness = minLightness + randomValue * (maxLightness - minLightness);
        ctx.fillStyle = `hsl(${hue},${saturation.toFixed()}%,${lightness.toFixed()}%)`;
  
        ctx.beginPath();
        ctx.moveTo(offsetX + vertices[0].x, offsetY + vertices[0].y);
        for (let i = 1; i < vertices.length; i++) {
          ctx.lineTo(offsetX+ vertices[i].x, offsetY+vertices[i].y);
        }
  
        ctx.fill();
        facetIndex++;
      }
    }

    // draw the edges
    if (doStroke) {
      ctx.beginPath();

      for (let edge of voronoiResult.edges) {
        ctx.moveTo(offsetX + edge.x1, offsetY + edge.y1);
        ctx.lineTo(offsetX + edge.x2, offsetY + edge.y2);
      }
      ctx.stroke();
      
    }

    
    
    const str = "Welcome to the generative art workshop";
    ctx.font = "30px Tahoma";
    const measurements = ctx.measureText(str);
    ctx.beginPath();
    ctx.rect(0, ctx.canvas.height/2-50, ctx.canvas.width, 75);
    ctx.globalAlpha=0.8;
    ctx.fillStyle= "white";
    ctx.fill();
    ctx.globalAlpha=1;
    ctx.fillStyle ="black";
    ctx.fillText(str, ctx.canvas.width/2-measurements.width/2,ctx.canvas.height/2);
  };


  const loop = () => {
    ctx.reset();

    drawingFunc();

    // cycle through indidual facet colors
    const angleStep = (2*Math.PI) / 100;
    for (let c = 0; c < colorAngles.length; c++) {
      colorAngles[c]+= angleStep;
      if(colorAngles[c] > Math.PI*2)
      colorAngles[c]-= Math.PI*2;
    }
    //cycle through hue
   hue+=0.1;
   if(hue >= 360) hue = hue-360;

    window.setTimeout(loop, 25);
  };

  loop();
  
}
