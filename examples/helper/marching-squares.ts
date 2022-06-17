class Point {
  constructor(public x: number, public y: number) {}
}
export class MarchingSquareCell {
  constructor(public nr: number, public p1?: Point, public p2?: Point) {}
}
/**
 *
 * https://en.wikipedia.org/wiki/Marching_squares
 */
export function marchingSquares(values: number[][], threshold: number, width: number, height: number, wrapAround: boolean = true) {
  let mask: boolean[];

  let cells: MarchingSquareCell[][] = [];
  for (let j: number = 0; j < height; j++) cells.push([]);

  for (let j: number = 0; j < height; j++) {
    for (let i: number = 0; i < width; i++) {
      if(!wrapAround) {
      mask = [
        j + 1 >= height ? values[j][i] > threshold : values[j + 1][i] > threshold,
        i + 1 >= width || j + 1 >= height ? values[j][i] > threshold : values[j + 1][i + 1] > threshold,
        i + 1 >= width ? values[j][i] > threshold : values[j][i + 1] > threshold,
        values[j][i] > threshold,
      ];
    } else {
      let nextX = i+1 >= width ? i+1-width: i+1;
      let nextY = j+1 >= height? j+1-height : j+1;
      mask = [
        values[nextY][i] > threshold,
         values[nextY][nextX] > threshold,
        values[j][nextX] > threshold,
        values[j][i] > threshold,
      ];
    }
      let nr = ((mask[0] ? 1 : 0) << 3) + ((mask[1] ? 1 : 0) << 2) + ((mask[2] ? 1 : 0) << 1) + ((mask[3] ? 1 : 0) << 0);

      if (nr != 0 && nr != 15) {
        let uv: Point[];
        if (!wrapAround) {
          uv = getUV(
            nr,
            threshold,
            values[j][i],
            j + 1 >= height ? threshold : values[j + 1][i],
            i + 1 >= width ? threshold : values[j][i + 1],
            i + 1 >= width || j + 1 >= height ? threshold : values[j + 1][i + 1]
          );
        } else {
          let nextX = i+1 >= width ? i+1-width: i+1;
          let nextY = j+1 >= height? j+1-height : j+1;
          uv = getUV(
            nr,
            threshold,
            values[j][i],
            values[nextY][i],
            values[j][nextX],
            values[nextY][nextX]
          );
        }

        if (uv.length > 0) {
          cells[j].push(new MarchingSquareCell(nr, uv[0], uv[1]));
        }
      } else cells[j].push(new MarchingSquareCell(nr));
    }
  }
  return cells;
}

function getUV(nr: number, threshold: number, vLT: number = 0, vLB: number = 2, vRT: number = 0, vRB: number = 2): Point[] {
  // (1 - min) / (max-min)
  let lInterpol = (threshold - vLT) / (vLB - vLT);
  let rInterpol = (threshold - vRT) / (vRB - vRT);

  let tInterpol = (threshold - vLT) / (vRT - vLT);
  let bInterpol = (threshold - vLB) / (vRB - vLB);

  let l = new Point(0, lInterpol);
  let t = new Point(tInterpol, 0);
  let r = new Point(1, rInterpol);
  let b = new Point(bInterpol, 1);

  switch (nr) {
    case 0:
      return [];
    case 1:
      return [l, t];
    case 2:
      return [t, r];
    case 3:
      return [l, r];

    case 4:
      return [r, b];
    case 5:
      return [b, l];
    case 6:
      return [b, t];
    case 7:
      return [b, l];

    case 8:
      return [b, l];
    case 9:
      return [b, t];
    case 10:
      return [b, r];
    case 11:
      return [b, r];

    case 12:
      return [l, r];
    case 13:
      return [t, r];
    case 14:
      return [t, l];
    case 15:
      return [];

    default:
      return [];
  }
}
