// step 1: move our "car" in the x direction in a a few steps
{
  const maxSteps = 10;
  ctx.beginPath();
  for (let step = 0; step < maxSteps; step++) {
    const t = step / maxSteps; // t now is between 0 and 1

    let x = 50 + t * 200;
    let y = 50;

    ctx.lineTo(x, y);

    // draw a vertical line to show the steps
    ctx.moveTo(x, y - 3);
    ctx.lineTo(x, y + 3);
    ctx.moveTo(x, y); // move back in position for the next segment
  }
  ctx.stroke();
}

// step 2: move our "car" in a circle
// the x and y of a circle is x = radius * cos(angle) and y = radius * sin(angle) with angle going from 0 -> 360° in radians so 2 * PI
{
  const maxSteps = 10;
  const radius = 50;
  ctx.beginPath();
  for (let step = 0; step < maxSteps; step++) {
    const t = step / maxSteps; // t now is between 0 and 1

    const angle = t * Math.PI * 2; // from 0 to 360°
    let x = 50 + radius * Math.cos(angle);
    let y = 50 + radius * Math.sin(angle);

    ctx.lineTo(x, y);

    // draw a vertical line to show the steps
    ctx.moveTo(x, y - 3);
    ctx.lineTo(x, y + 3);
    ctx.moveTo(x, y); // move back in position for the next segment
  }
  ctx.stroke();
}

// step 3: what happens if we have 6 steps exactly?
{
  const maxSteps = 6;
  const radius = 50;
  ctx.beginPath();
  for (let step = 0; step <= maxSteps; step++) {
    const t = step / maxSteps; // t is between 0 and 1

    const angle = t * Math.PI * 2; // from 0 to 360°
    let x = 50 + radius * Math.cos(angle);
    let y = 50 + radius * Math.sin(angle);

    ctx.lineTo(x, y);

    // draw a vertical line to show the steps
    ctx.moveTo(x, y - 3);
    ctx.lineTo(x, y + 3);
    ctx.moveTo(x, y); // move back in position for the next segment
  }
  ctx.stroke();
}

// step 4: what if we change the radius to also change over time?
{
  const maxSteps = 100;
  const maxRadius = 50;
  const numberOfTurns = 4;
  ctx.beginPath();
  for (let step = 0; step <= maxSteps; step++) {
    const t = step / maxSteps; // t is between 0 and 1
    const radius = t * maxRadius;
    const angle = t * Math.PI * 2 * numberOfTurns;
    let x = 50 + radius * Math.cos(angle);
    let y = 50 + radius * Math.sin(angle);

    ctx.lineTo(x, y);
  }
  ctx.stroke();
}

// step 5: let's make this a function
{
  function spiral() {
    const maxSteps = 100;
    const maxRadius = 50;
    const numberOfTurns = 4;
    ctx.beginPath();
    for (let step = 0; step <= maxSteps; step++) {
      const t = step / maxSteps; // t is between 0 and 1
      const radius = t * maxRadius;
      const angle = t * Math.PI * 2 * numberOfTurns;
      let x = 50 + radius * Math.cos(angle);
      let y = 50 + radius * Math.sin(angle);

      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  spiral();
}

// step 6: let's move some of those variables as function parameters
{
  function spiral(maxRadius, numberOfTurns) {
    const maxSteps = 100;

    ctx.beginPath();
    for (let step = 0; step <= maxSteps; step++) {
      const t = step / maxSteps; // t is between 0 and 1
      const radius = t * maxRadius;
      const angle = t * Math.PI * 2 * numberOfTurns;
      let x = 50 + radius * Math.cos(angle);
      let y = 50 + radius * Math.sin(angle);

      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  spiral(50, 4);
  spiral(20, 4);
}

// step 7: rather than drawing them on a fixed 50,50 position, let's introduce more function parameters
{
  function spiral(offsetX, offsetY, maxRadius, numberOfTurns) {
    const maxSteps = 100;

    ctx.beginPath();
    for (let step = 0; step <= maxSteps; step++) {
      const t = step / maxSteps; // t is between 0 and 1
      const radius = t * maxRadius;
      const angle = t * Math.PI * 2 * numberOfTurns;
      let x = offsetX + radius * Math.cos(angle);
      let y = offsetY + radius * Math.sin(angle);

      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  spiral(50, 50, 50, 4);
  spiral(100, 100, 20, 4);
}

// step 8: how would we want to make it spin clock wise instead of counter clock wise?
{
  function spiral(offsetX, offsetY, maxRadius, numberOfTurns) {
    const maxSteps = 100;

    ctx.beginPath();
    for (let step = 0; step <= maxSteps; step++) {
      const t = step / maxSteps; // t is between 0 and 1
      const radius = (1 - t) * maxRadius;
      const angle = t * Math.PI * 2 * numberOfTurns;
      let x = offsetX + radius * Math.cos(angle);
      let y = offsetY + radius * Math.sin(angle);

      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  spiral(50, 50, 50, 4);
  spiral(100, 100, 20, 4);
}

// step 9: playing around, make clockwise a parameter, and introduce a start angle. And then move the tinier spiral in place
// an if(...) { value = ...; } else { value = ...; } chunk can be written inline as <condition> ? <value if true> : <value if value>
// we can use this to easily make it either (1-t) or (t) times the radius based on whether it's clockwise or not
{
  function spiral(offsetX, offsetY, maxRadius, numberOfTurns, clockwise, startAngle = 0) {
    const maxSteps = 100;

    ctx.beginPath();
    for (let step = 0; step <= maxSteps; step++) {
      const t = step / maxSteps; // t now is between 0 and 1
      const radius = (clockwise ? 1 - t : t) * maxRadius;
      const angle = startAngle + t * Math.PI * 2 * numberOfTurns;
      let x = offsetX + radius * Math.cos(angle);
      let y = offsetY + radius * Math.sin(angle);

      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  spiral(50, 50, 50, 4, true, 0);
  spiral(100 + 20, 50, 20, 4, true, Math.PI);
}
