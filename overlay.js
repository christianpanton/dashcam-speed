function drawVideoOverlay(canvas, activeFrame) {
  const {x, y, draftX, draftY} = activeFrame;
  const context = canvas.getContext("2d");

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.lineWidth = 2;

  context.strokeStyle = "red";
  context.beginPath();
  context.moveTo(0, y);
  context.lineTo(canvas.width, y);
  context.stroke();

  if(draftY)
  {
    context.strokeStyle = "#ff9999";
    context.beginPath();
    context.moveTo(0, draftY);
    context.lineTo(canvas.width, draftY);
    context.stroke();
  }

  context.strokeStyle = "lime";
  context.beginPath();
  context.arc(x, y, 10, 0, 2 * Math.PI);
  context.stroke();
}
