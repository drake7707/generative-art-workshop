import { Random } from "./random";

export class DiamondSquare {
  private size: number;
  private roughness: number;
  private loadedValues: { [key: string]: number[][] } = {};

  /// <summary>
  /// A class that generates pseudo random values using the diamond square algoritm.
  /// The class lazy loads chunks based on the requested coordinates. Adjacent chunks
  /// are generated seamlessy by copying the borders of the already loaded chunks as initial
  /// seed for the current chunk.
  /// </summary>
  /// <param name='size'>The chunk size (in 2^x +1) </param>
  /// <param name='rougness'>The roughness parameter of the algorithm, [0f, 1f]</param>
  constructor(size: number, private rnd: Random, roughness: number = 1) {
    this.size = this.getNextMultipleOf2(size);

    this.roughness = roughness;
  }

  private getNextMultipleOf2(size: number): number {
    let val = Math.log(size - 1) / Math.LN2;
    if (val != Math.round(val)) {
      return 2 ** Math.ceil(val) + 1;
    } else return size;
  }
  /// <summary>
  /// Returns a value generated from the diamond square algorithm at given coordinates
  /// </summary>
  getValue(x: number, y: number) {
    // determine chunk coordinates
    var srcX = Math.floor(x / this.size);
    var srcY = Math.floor(y / this.size);
    var values = this.loadedValues[srcX + ";" + srcY];
    if (values === undefined) {
      // the chunk at given coordinates is not loaded yet
      // create the initial array for the chunk
      var initialArray = this.getInitialArray(this.loadedValues, srcX, srcY);
      // create the values for the current chunk
      values = this.generateArray(initialArray, this.loadedValues, srcX, srcY, this.roughness);
      // save the values
      this.loadedValues[srcX + ";" + srcY] = values;
    }
    // determine the x & y coordinates within the current chunk
    var arrX = (x + (1 + Math.floor(Math.abs(x / this.size))) * this.size) % this.size;
    var arrY = (y + (1 + Math.floor(Math.abs(y / this.size))) * this.size) % this.size;
    return values[arrX][arrY];
  }

  /// <summary>
  /// Creates an initial array for a chunk
  /// </summary>
  /// <param name='loadedValues'>The chunks already loaded</param>
  /// <param name='srcX'>The x coordinate of the chunk</param>
  /// <param name='srcY'>The y coordinate of the chunk</param>
  /// <returns>An initial array for a new chunk</returns>
  private getInitialArray(loadedValues: Object, srcX: number, srcY: number) {
    // allocate a new array for the chunk
    var values = new Array(this.size);
    for (var i = 0; i < this.size; i++) {
      values[i] = new Array(this.size);
    }

    // if the left chunk is loaded, copy its right side
    if (loadedValues[srcX - 1 + ";" + srcY] !== undefined) {
      var prevValues = loadedValues[srcX - 1 + ";" + srcY];
      // left side
      for (var i = 0; i < this.size; i++) values[0][i] = prevValues[this.size - 1][i];
    }

    // if the right chunk is loaded, copy its left side
    if (loadedValues[srcX + 1 + ";" + srcY] !== undefined) {
      var prevValues = loadedValues[srcX + 1 + ";" + srcY];
      // right side
      for (var i = 0; i < this.size; i++) values[this.size - 1][i] = prevValues[0][i];
    }

    // if the top chunk is loaded, copy its bottom side
    if (loadedValues[srcX + ";" + (srcY - 1)] !== undefined) {
      var prevValues = loadedValues[srcX + ";" + (srcY - 1)];
      // top side
      for (var i = 0; i < this.size; i++) values[i][0] = prevValues[i][this.size - 1];
    }

    // if the bottom chunk is loaded, copy its top side
    if (loadedValues[srcX + ";" + (srcY + 1)] !== undefined) {
      var prevValues = loadedValues[srcX + ";" + (srcY + 1)];
      // bottom side
      for (var i = 0; i < this.size; i++) values[i][this.size - 1] = prevValues[i][0];
    }

    // diagonals

    // if the left top chunk is loaded, copy its right bottom value
    if (loadedValues[srcX - 1 + ";" + (srcY - 1)] !== undefined) {
      var prevValues = loadedValues[srcX - 1 + ";" + (srcY - 1)];
      values[0][0] = prevValues[this.size - 1][this.size - 1];
    }

    // if the right top chunk is loaded, copy its left bottom value
    if (loadedValues[srcX + 1 + ";" + (srcY - 1)] !== undefined) {
      var prevValues = loadedValues[srcX + 1 + ";" + (srcY - 1)];
      values[this.size - 1][0] = prevValues[0][this.size - 1];
    }

    // if the left bottom chunk is loaded, copy its right top value
    if (loadedValues[srcX - 1 + ";" + (srcY + 1)] !== undefined) {
      var prevValues = loadedValues[srcX - 1 + ";" + (srcY + 1)];
      values[0][this.size - 1] = prevValues[this.size - 1][0];
    }

    // if the right bottom chunk is loaded, copy its left top value
    if (loadedValues[srcX + 1 + ";" + (srcY + 1)] !== undefined) {
      var prevValues = loadedValues[srcX + 1 + ";" + (srcY + 1)];
      values[this.size - 1][this.size - 1] = prevValues[0][0];
    }

    // if any of the corners are not initialised, give them random values

    if (values[0][0] === undefined) values[0][0] = this.rnd.next();

    if (values[this.size - 1][0] === undefined) values[this.size - 1][0] = this.rnd.next();

    if (values[0][this.size - 1] === undefined) values[0][this.size - 1] = this.rnd.next();

    if (values[this.size - 1][this.size - 1] === undefined) values[this.size - 1][this.size - 1] = this.rnd.next();

    return values;
  }

  /// <summary>
  /// Applies the diamond square algorithm on the given initial array for a chunk
  /// </summary>
  /// <param name='initialArray'>The initial array for the chunk to apply the algorithm on</param>
  /// <param name='loadedValues'>The loaded chunks</param>
  /// <param name='srcX'>The x coordinate of the chunk</param>
  /// <param name='srcY'>The y coordinate of the chunk</param>
  /// <returns>The filled in array</returns>
  private generateArray(initialArray: number[][], loadedValues: Object, srcX: number, srcY: number, roughness: number): number[][] {
    var appliedRoughness = roughness;

    var values = initialArray;

    // the algorithm is programmed in an iterative approach rather than a recursive one
    // the outer while loop keeps dividing its length into 2, until <= 2.
    // for each division the range of the random parameter is also halved
    // (like the fractal midpoint algorithm)
    // see http://www.gameprogrammer.com/fractal.html for more info
    var length = this.size;
    while (length > 2) {
      // perform diamond step
      for (var j = 0; j < this.size - 1; j += length - 1) {
        for (var i = 0; i < this.size - 1; i += length - 1) {
          // the square is i,j ------------ i + length -1, j
          //               |                     |
          //               |                     |
          //              i + length -1 ----i + length -1, j + length - 1

          // we need to calc point in the middle
          var randomParam = (2 * this.rnd.next() - 1) * appliedRoughness;

          // determine the center point of the square bounding box
          var destX = Math.floor(i / 2 + (i + length - 1) / 2);
          var destY = Math.floor(j / 2 + (j + length - 1) / 2);

          // if the value isn't present already,
          // set it to the average of the corner points and add the random parameter
          if (values[destX][destY] === undefined) {
            values[destX][destY] = DiamondSquare.average(values[i][j], values[i + length - 1][j], values[i][j + length - 1], values[i + length - 1][j + length - 1]) + randomParam;

            // clip the values if they fall outside [0,1]
            if (values[destX][destY] < 0) values[destX][destY] = 0;
            if (values[destX][destY] > 1) values[destX][destY] = 1;

            //console.log("DS values[" + destX + "][" + destY + "] = " + values[destX][destY]);
          }
        }
      }

      // done the diamond step
      // perform square step
      var halfsize = Math.floor(length / 2);

      for (var j = 0; j <= this.size - 1; j += halfsize) {
        for (var i = Math.floor(j / halfsize) % 2 === 0 ? halfsize : 0; i <= this.size - 1; i += length - 1) {
          // for each square, determine midpoint of surrounding 4 diamonds
          this.doDiamondOnMidpoint(values, i, j, length, appliedRoughness, loadedValues, srcX, srcY);
        }
      }

      appliedRoughness = appliedRoughness / 2; //* (1 - ((roughness * (Math.pow(2, -roughness)))));

      length = Math.floor((length - 1) / 2 + 1);
    }

    return values;
  }

  /// <summary>
  /// Applies the diamond step of the diamond square algorithm
  /// </summary>
  /// <param name='values'>The current array to fill data in</param>
  /// <param name='midpointX'>The center x coordinate of the square</param>
  /// <param name='midpointY'>The center y coordinate of the square</param>
  /// <param name='length'>The current length of a square</param>
  /// <param name='weight'>The current roughness to apply</param>
  /// <param name='srcX'>The x coordinate of the chunk</param>
  /// <param name='srcY'>The y coordinate of the chunk</param>
  private doDiamondOnMidpoint(values: number[][], midpointX: number, midpointY: number, length: number, weight: number, loadedValues, srcX: number, srcY: number) {
    //if the target value isn't filled in yet
    if (values[midpointX][midpointY] === undefined) {
      // determine bounds of the square
      var halfLength = Math.floor(length / 2);
      var left = midpointX - halfLength;
      var right = midpointX + halfLength;
      var top = midpointY - halfLength;
      var bottom = midpointY + halfLength;

      // get the 4 required values.
      // at the edge of the chunk the values will need to be read from the adjacent chunks
      // if the adjactent chunks aren't loaded, some might be undefined. The average function
      // skips values that are undefined.
      //            pTop
      //        -----+-----
      //        |         |
      // pLeft  +    M    + pRight
      //        |         |
      //        -----+-----
      //           pBottom
      var pLeft = this.getValueRaw(loadedValues, left, midpointY, values, srcX, srcY);
      var pRight = this.getValueRaw(loadedValues, right, midpointY, values, srcX, srcY);
      var pTop = this.getValueRaw(loadedValues, midpointX, top, values, srcX, srcY);
      var pBottom = this.getValueRaw(loadedValues, midpointX, bottom, values, srcX, srcY);

      // determine random factor
      var randomParam = (2 * this.rnd.next() - 1) * weight;

      // determine resulting value by averaging the 4 points and adding the random factor
      var value = DiamondSquare.average(pLeft, pTop, pRight, pBottom) + randomParam;

      // clip the value if it falls outside [0,1]
      if (value < 0) value = 0;
      if (value > 1) value = 1;

      values[midpointX][midpointY] = value;
    }
  }

  /// <summary>
  /// Returns the value at the given x & y coordinates
  /// </summary>
  /// <param name='loadedValues'>The loaded chunks</param>
  /// <param name='x'>The x coordinate</param>
  /// <param name='y'>The y coordinate</param>
  /// <param name='curvalues'>The current array used for the new chunk</param>
  /// <param name='srcX'>The x coordinate of the chunk</param>
  /// <param name='srcY'>The y coordinate of the chunk</param>
  /// <returns>A value at the specified coordinates or undefined if the coordinates fall in an adjacent chunk that isn't loaded</returns>
  private getValueRaw(loadedValues: number[][], x: number, y: number, curvalues: number[][], srcX: number, srcY: number): number {
    // if the coordinates fall inside the chunk array, look up the value in the current array
    if (x >= 0 && y >= 0 && x < this.size && y < this.size) return curvalues[x][y];

    // determine the adjacent chunk coordinates
    var dstX = Math.floor((srcX * this.size + x) / this.size);
    var dstY = Math.floor((srcY * this.size + y) / this.size);

    // check if the chunk is loaded
    var values = loadedValues[dstX + ";" + dstY];
    if (values === undefined) {
      return undefined;
    } else {
      // determine the x & y position inside the adjacent chunk and return its value
      var arrX = x >= 0 ? x % this.size : this.size - 1 - (Math.abs(x) % this.size);
      var arrY = y >= 0 ? y % this.size : this.size - 1 - (Math.abs(y) % this.size);
      return values[arrX][arrY];
    }
  }

  /// <summary>
  /// Returns the average of the given points. If any of the points are undefined,
  /// they will be skipped
  /// </summary>
  /// <param name='p1'>The 1st value</param>
  /// <param name='p2'>The 2nd value</param>
  /// <param name='p3'>The 3rd value</param>
  /// <param name='p4'>The 4th value</param>
  /// <returns>An average of the given values</returns>
  private static average(p1: number, p2: number, p3: number, p4: number): number {
    var sum = 0;
    var count = 0;
    if (p1 !== undefined) {
      sum += p1;
      count++;
    }
    if (p2 !== undefined) {
      sum += p2;
      count++;
    }
    if (p3 !== undefined) {
      sum += p3;
      count++;
    }
    if (p4 !== undefined) {
      sum += p4;
      count++;
    }

    return sum / count;
  }
}
