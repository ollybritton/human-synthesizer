/*

This code deals with rendering the visualisation to the canvas. It is an adapted version of handtrack.js's existing "model.renderPredictions"
method (https://github.com/victordibia/handtrack.js/blob/master/src/index.js#L320).

*/

const colorMap = {
  open: "#374151",
  closed: "#B91C1C",
  pinch: "#F59E0B",
  point: "#10B981",
  face: "#3B82F6",
  tip: "#6366F1",
  pinchtip: "#EC4899",
};

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke === "undefined") {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  if (typeof radius === "number") {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius.br,
    y + height
  );
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }
}

function renderPredictions(
  predictions,
  canvas,
  context,
  mediasource,
  freq,
  amp
) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = mediasource.width;
  canvas.height = mediasource.height;
  // console.log("render", mediasource.width, mediasource.height);
  canvas.style.height =
    parseInt(canvas.style.width) *
      (mediasource.height / mediasource.width).toFixed(2) +
    "px";
  // console.log("render", canvas.style.width, canvas.style.height);

  context.save();

  context.scale(-1, 1);
  context.translate(-mediasource.width, 0);
  context.drawImage(mediasource, 0, 0, mediasource.width, mediasource.height);
  context.restore();
  context.font = "bold 17px monospace";

  // console.log('number of detections: ', predictions.length);
  for (let i = 0; i < predictions.length; i++) {
    const pred = predictions[i];
    context.beginPath();
    context.fillStyle = "rgba(255, 255, 255, 0.6)";

    context.fillRect(
      pred.bbox[0] + 1,
      pred.bbox[1] + 1,
      pred.bbox[2] - 1,
      17 * 1.5
    );
    context.lineWidth = 2;
    // context.rect(...pred.bbox);
    roundRect(
      context,
      pred.bbox[0],
      pred.bbox[1],
      pred.bbox[2],
      pred.bbox[3],
      5,
      false,
      true
    );

    // draw a dot at the center of bounding box

    // context.lineWidth = 1;
    context.strokeStyle = colorMap[pred.label];
    context.fillStyle = colorMap[pred.label];
    context.fillRect(
      pred.bbox[0] + pred.bbox[2] / 2,
      pred.bbox[1] + pred.bbox[3] / 2,
      5,
      5
    );

    let freqString = String(Math.round(freq)).padStart(2, "0");
    let ampString = String(Math.round(amp * 100)).padStart(2, " ");
    let noteName = noteNameFromFrequency(freq);

    context.stroke();
    context.fillText(
      `${freqString}Hz - ${ampString}% | ≈${noteName}`,
      pred.bbox[0] + 5,
      pred.bbox[1] + 17 * 1.1
    );
  }
}
