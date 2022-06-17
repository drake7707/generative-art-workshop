export class Random {
  seed: number;

  private val: number;
  constructor(seed?: number) {
      if (typeof seed === "undefined")
          seed = ~~(Math.random() * 10000000);

      this.seed = seed;
      this.val = seed;
  }

  next(): number {
      // this is in no way uniformly distributed, so it's really a bad rng, but it's fast enough
      // and random enough
      let x = Math.sin(this.val++) * 10000;
      return x - Math.floor(x);
  }

  nextBetween(min: number, max: number): number {
      return min + this.next() * (max - min);
  }
}