import { Random } from "./random";

export function getPoissonDiscSamples(width: number, height: number, initialX: number, initialY: number, minDistance: number, rng?:Random) {
  const retries = 200;
  if(!rng)
    rng = new Random();

  let pd = new PoissonDisc(width, height, minDistance, retries, rng, (x, y) => true);
  pd.addInitialSample(initialX, initialY);
  // run until it's done
  while (!pd.isDone) {
    pd.step();
  }
  return pd.samples;
}

// Implementation based on http://www.cs.ubc.ca/~rbridson/docs/bridson-siggraph07-poissondisk.pdf
export class PoissonDisc {
  samples: Sample[] = [];

  private _isDone: boolean;
  get isDone(): boolean {
    return this._isDone;
  }

  private width: number;
  private height: number;

  private minDistance: number;
  private nrSamplingAttempts: number;

  private backgroundGrid: Sample[][] = [];
  private nrCols: number;
  private nrRows: number;
  private cellSize: number;

  private activeList: Sample[] = [];

  private canAddSample: (x: number, y: number) => boolean;

  private deepestSample: Sample = null;

  public getDeepestSample(): Sample {
    return this.deepestSample;
  }

  public drawLinks: boolean = true;
  public drawLinkColor: string = "white";

  public constructor(width: number, height: number, minDistance: number, nrSamplingAttempts: number, private rnd: Random, canAddSample: (x: number, y: number) => boolean) {
    this.width = width;
    this.height = height;
    this.minDistance = minDistance;
    this.nrSamplingAttempts = nrSamplingAttempts;
    this.canAddSample = canAddSample;

    // step 0: initialize a n-dimensional background grid
    this.initBackgroundGrid();
  }

  /**
   * Initializes the background grid and determines the cell size and how many rows & cols the grid has
   */
  private initBackgroundGrid() {
    // ensure that there will only be at most 1 sample per cell in the background grid
    this.cellSize = this.minDistance; // / Math.sqrt(2));

    // determine the nr of cols & rows in the background grid
    this.nrCols = Math.ceil(this.width / this.cellSize);
    this.nrRows = Math.ceil(this.height / this.cellSize);

    for (var i: number = 0; i < this.nrCols; i++) {
      this.backgroundGrid[i] = [];
      for (var j: number = 0; j < this.nrRows; j++) {
        this.backgroundGrid[i][j] = null;
      }
    }
  }

  public addInitialSample(x: number, y: number) {
    var initSample: Sample = new Sample(x, y);
    this.addSample(initSample);

    this.deepestSample = initSample;
  }
  /**
   * Adds a valid sample to the various constructs of the algorithm
   */
  private addSample(s: Sample) {
    var xIdx = Math.floor((s.x / this.width) * this.nrCols);
    var yIdx = Math.floor((s.y / this.height) * this.nrRows);

    this.backgroundGrid[xIdx][yIdx] = s;
    this.activeList.push(s);
    this.samples.push(s);

    //s.drawTo(Main.Canvases.ctxOverlay, true);
  }

  /**
   * Chooses a sample from the active list and tries to find a random sample between its r and 2r radius
   * that is not too close to other samples, checked by looking nearby samples up in the background grid
   * If no sample could be determined within <nrSamples> then stop looking and return false. Also remove the
   * sample from the active list because it will never have any suitable samples to expand upon.
   *
   * @returns true if a sample was able to be found, otherwise false
   */
  step(): boolean {
    if (this.activeList.length <= 0) {
      this._isDone = true;
      return true;
    }

    // choose a random index from it
    var idx: number = Math.floor(this.rnd.next() * this.activeList.length);
    var s: Sample = this.activeList[idx];

    // generate up to nrSamples points uniformly from the spherical annullus between radius r and 2r (MIN_DISTANCE and 2 * MIN_DISTANCE)
    // around the chosen sample x_i

    // choose a point by creating a vector to the inner boundary
    // and multiplying it by a random value between [1-2]
    var initvX: number = this.minDistance;
    var initvY: number = 0;

    var k: number = 0;
    var found: boolean = false;
    // try finding a sample between r and 2r from the sample s, up to nrSamplingAttempts times
    while (k < this.nrSamplingAttempts && !found) {
      // ( cos  sin )    x ( vX  ) = ( cos * vX + sin * vY )
      // ( -sin cos )      ( vY )    ( -sin * vX + cos * vY)
      var angle = this.rnd.next() * 2 * Math.PI;
      var vX = Math.cos(angle) * initvX + Math.sin(angle) * initvY;
      var vY = -Math.sin(angle) * initvX + Math.cos(angle) * initvY;

      // the length of the vector is already the min radius, so multiplying between 1 and 2
      // gives a sample in the r - 2r band around s.
      var length = 1 + this.rnd.next(); // between 1 and 2
      var x: number = s.x + length * vX;
      var y: number = s.y + length * vY;

      var xIdx = Math.floor((x / this.width) * this.nrCols);
      var yIdx = Math.floor((y / this.height) * this.nrRows);

      if (x >= 0 && y >= 0 && x < this.width && y < this.height && this.backgroundGrid[xIdx][yIdx] == null && !this.containsSampleInBackgroundGrid(x, y) && this.canAddSample(x, y)) {
        // adequately far from existing samples

        var newSample: Sample = new Sample(x, y);
        newSample.previousSample = s;
        newSample.depth = s.depth + 1;

        if (this.deepestSample == null || newSample.depth > this.deepestSample.depth) this.deepestSample = newSample;

        this.addSample(newSample);

        found = true;
      }
      k++;
    }
    if (!found) {
      // no suitable found, remove it from the active list
      this.activeList.splice(idx, 1);
      //  s.drawTo(Main.Canvases.ctxOverlay, false);
    }
    return found;
  }

  /**
   * Checks if there is a sample around the x,y sample that's closer than the minimum radius
   * using the background grid
   *
   * @returns true if there is a sample within the minimum radius, otherwise false
   */
  containsSampleInBackgroundGrid(x: number, y: number): boolean {
    var xIdx = (x / this.width) * this.nrCols;
    var yIdx = (y / this.height) * this.nrRows;

    // determine the bounding box of the radius
    var lboundX = ((x - this.minDistance) / this.width) * this.nrCols;
    var lboundY = ((y - this.minDistance) / this.height) * this.nrRows;
    var uboundX = Math.ceil(((x + this.minDistance) / this.width) * this.nrCols);
    var uboundY = Math.ceil(((y + this.minDistance) / this.height) * this.nrRows);
    // make sure i,j falls within bounds
    if (lboundX < 0) lboundX = 0;
    if (lboundY < 0) lboundY = 0;
    if (uboundX >= this.nrCols) uboundX = this.nrCols;
    if (uboundY >= this.nrRows) uboundY = this.nrRows;

    for (var i: number = lboundX; i <= uboundX; i++) {
      for (var j: number = lboundY; j <= uboundY; j++) {
        let sample = this.backgroundGrid[Math.floor(i)][Math.floor(j)];
        // check if the cell contains a sample and if the distance is smaller than the minimum distance
        if (sample != null && sample.distanceTo(x, y) < this.minDistance) {
          return true; // short circuit if you don't need to draw the cells around the given x,y
        }
      }
    }

    return false;
  }
}

export class Sample {
  x: number;
  y: number;

  previousSample: Sample = null;
  depth: number;

  public constructor(x: number, y: number) {
    this.x = Math.floor(x);
    this.y = Math.floor(y);
    this.depth = 0;
  }

  distanceTo(x: number, y: number): number {
    return Math.sqrt((this.x - x) * (this.x - x) + (this.y - y) * (this.y - y));
  }
}
