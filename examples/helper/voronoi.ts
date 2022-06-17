import Delaunator = require("delaunator");

export function voronoiTiling(points: { x: number; y: number }[]) {
  let delaunayResult = Delaunator.from(
    points,
    (loc) => loc.x,
    (loc) => loc.y
  );
  const numTriangles = delaunayResult.halfedges.length / 3;
  // calculate the centroids
  let centroids = [];
  for (let t = 0; t < numTriangles; t++) {
    let sumOfX = 0,
      sumOfY = 0;
    for (let i = 0; i < 3; i++) {
      let s = 3 * t + i;
      let p = points[delaunayResult.triangles[s]];
      sumOfX += p.x;
      sumOfY += p.y;
    }
    centroids[t] = { x: sumOfX / 3, y: sumOfY / 3 };
  }

  const nextHalfedge = (e) => (e % 3 === 2 ? e - 2 : e + 1);
  const edgesAroundPoint = (start: number) => {
    const result: number[] = [];
    let incoming = start;
    do {
      result.push(incoming);
      const outgoing = nextHalfedge(incoming);
      incoming = delaunayResult.halfedges[outgoing];
    } while (incoming !== -1 && incoming !== start);
    return result;
  };

  const polygons: { x: number; y: number }[][] = [];
  let seen = new Set();
  for (let e = 0; e < delaunayResult.halfedges.length; e++) {
    const r = delaunayResult.triangles[delaunayResult.halfedges[e]];
    if (!seen.has(r)) {
      seen.add(r);

      let vertices = edgesAroundPoint(e).map((e) => centroids[Math.floor(e / 3)]);
      polygons.push(vertices);
    }
  }

  const edges: { x1: number; y1: number; x2: number; y2: number }[] = [];

  for (let e = 0; e < delaunayResult.halfedges.length; e++) {
    if (e < delaunayResult.halfedges[e]) {
      const p = centroids[Math.floor(e / 3)];
      const q = centroids[Math.floor(delaunayResult.halfedges[e] / 3)];

      edges.push({ x1: p.x, y1: p.y, x2: q.x, y2: q.y });
    }
  }

  return {
    edges,
    polygons,
  };
}
