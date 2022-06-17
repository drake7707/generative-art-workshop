declare var ctx: CanvasRenderingContext2D;

// step 1: draw a line
{
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(50, 50);
  ctx.stroke();
}

// step 2: introduce variables
// To define a value you can use either const or let, const is a "constant" and can't be changed later, let can always be changed.
{
  const scale = 50;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(1 * scale, 1 * scale);
  ctx.stroke();
}
// step 3: introduce an if condition to either draw zig or zaggy
{
  const scale = 50;
  ctx.beginPath();
  if (Math.random() < 0.5) {
    ctx.moveTo(0, 0);
    ctx.lineTo(1 * scale, 1 * scale);
  } else {
    ctx.moveTo(1 * scale, 0);
    ctx.lineTo(0, 1 * scale);
  }
  ctx.stroke();
}

// step 4: add a rectangle so you can see it as a tile
{
  const scale = 50;
  ctx.beginPath();
  if (Math.random() < 0.5) {
    ctx.moveTo(0, 0);
    ctx.lineTo(1 * scale, 1 * scale);
  } else {
    ctx.moveTo(1 * scale, 0);
    ctx.lineTo(0, 1 * scale);
  }
  ctx.rect(0, 0, 1 * scale, 1 * scale);
  ctx.stroke();
}

// step 5: introduce a for loop, draw this multiple times
// The for loop structure is for(<initial statement>; <condition until it runs>; <statement after every loop>) { }
// i++ is the shorthand version of i = i + 1, so increment i by 1
{
  const scale = 50;
  const boardWidth = 10;
  ctx.beginPath();
  for (let i = 0; i < boardWidth; i++) {
    if (Math.random() < 0.5) {
      ctx.moveTo(0, 0);
      ctx.lineTo(1 * scale, 1 * scale);
    } else {
      ctx.moveTo(1 * scale, 0);
      ctx.lineTo(0, 1 * scale);
    }
    ctx.rect(0, 0, 1 * scale, 1 * scale);
    ctx.stroke();
  }
}
// step 6: introduce an offset so all the tiles are not draw on top of each other
// See drawing on a whiteboard
{
  const scale = 50;
  const boardWidth = 10;
  ctx.beginPath();
  for (let i = 0; i < boardWidth; i++) {
    const offsetX = i * scale;

    if (Math.random() < 0.5) {
      ctx.moveTo(offsetX + 0, 0);
      ctx.lineTo(offsetX + 1 * scale, 1 * scale);
    } else {
      ctx.moveTo(offsetX + 1 * scale, 0);
      ctx.lineTo(offsetX + 0, 1 * scale);
    }
    ctx.rect(offsetX, 0, 1 * scale, 1 * scale);
    ctx.stroke();
  }
}

// step 7: now we want to do the same with the vertical direction and remove the rectangle and ta-dah
// The nested for loop means that for every value of j it will execute the block, for every value of i it will execute its block
// so you end up going over all the coordinates row by row (as j increments) and *per row* column by column (as i increments)
{
  const scale = 50;
  const boardWidth = 10;
  const boardHeight = 10;
  ctx.beginPath();
  for (let j = 0; j < boardHeight; j++) {
    for (let i = 0; i < boardWidth; i++) {
      const offsetX = i * scale;
      const offsetY = j * scale;

      if (Math.random() < 0.5) {
        ctx.moveTo(offsetX + 0, offsetY + 0);
        ctx.lineTo(offsetX + 1 * scale, offsetY + 1 * scale);
      } else {
        ctx.moveTo(offsetX + 1 * scale, offsetY + 0);
        ctx.lineTo(offsetX + 0, offsetY + 1 * scale);
      }
      //ctx.rect(offsetX, offsetY, 1 * scale, 1 * scale);
    }
  }
  ctx.stroke();
}

// step 8: instead of making one long path, make a path for each tile and then vary the line with at random
{
  const scale = 50;
  const boardWidth = 10;
  const boardHeight = 10;
  const maxLineWidth = 5;

  for (let j = 0; j < boardHeight; j++) {
    for (let i = 0; i < boardWidth; i++) {
      ctx.lineWidth = Math.random() * maxLineWidth;
      ctx.strokeStyle = "black";
      ctx.beginPath();
      const offsetX = i * scale;
      const offsetY = j * scale;

      if (Math.random() < 0.5) {
        ctx.moveTo(offsetX + 0, offsetY + 0);
        ctx.lineTo(offsetX + 1 * scale, offsetY + 1 * scale);
      } else {
        ctx.moveTo(offsetX + 1 * scale, offsetY + 0);
        ctx.lineTo(offsetX + 0, offsetY + 1 * scale);
      }
      //ctx.rect(offsetX, offsetY, 1 * scale, 1 * scale);

      ctx.stroke();
    }
  }
}

// step 9: change the color as well
{
  const scale = 50;
  const boardWidth = 10;
  const boardHeight = 10;
  const maxLineWidth = 5;

  for (let j = 0; j < boardHeight; j++) {
    for (let i = 0; i < boardWidth; i++) {
      ctx.lineWidth = Math.random() * maxLineWidth;

      const colorValue = Math.random() * 255;
      ctx.strokeStyle = "rgb(" + colorValue + ",0,0)";
      ctx.beginPath();
      const offsetX = i * scale;
      const offsetY = j * scale;

      if (Math.random() < 0.5) {
        ctx.moveTo(offsetX + 0, offsetY + 0);
        ctx.lineTo(offsetX + 1 * scale, offsetY + 1 * scale);
      } else {
        ctx.moveTo(offsetX + 1 * scale, offsetY + 0);
        ctx.lineTo(offsetX + 0, offsetY + 1 * scale);
      }
      //ctx.rect(offsetX, offsetY, 1 * scale, 1 * scale);

      ctx.stroke();
    }
  }
}

// step 10: instead of random let's change it depending on the x and y value
{
  const scale = 50;
  const boardWidth = 10;
  const boardHeight = 10;
  const maxLineWidth = 5;

  for (let j = 0; j < boardHeight; j++) {
    for (let i = 0; i < boardWidth; i++) {
      ctx.lineWidth = 1 + (i / boardWidth) * maxLineWidth;

      const colorValue = (j / boardHeight) * 255;
      ctx.strokeStyle = "rgb(" + colorValue + ",0,0)";
      ctx.beginPath();
      const offsetX = i * scale;
      const offsetY = j * scale;

      if (Math.random() < 0.5) {
        ctx.moveTo(offsetX + 0, offsetY + 0);
        ctx.lineTo(offsetX + 1 * scale, offsetY + 1 * scale);
      } else {
        ctx.moveTo(offsetX + 1 * scale, offsetY + 0);
        ctx.lineTo(offsetX + 0, offsetY + 1 * scale);
      }
      //ctx.rect(offsetX, offsetY, 1 * scale, 1 * scale);

      ctx.stroke();
    }
  }
}
