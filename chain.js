var x = [],
  y = [],
  segNum = 100,
  segLength = 10;

for (var i = 0; i < segNum; i++) {
  x[i] = 0;
  y[i] = 0;
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  strokeWeight(10);
  stroke(255, 255, 255, 100);
}

function draw() {

  background('#FFDD00');

  dragSegment(0, mouseX, mouseY);
  for (var i = 0; i < x.length - 1; i++) {
    dragSegment(i + 1, x[i], y[i]);
  }
}

function mousePressed() {
  segNum = segNum + 1;
}

function dragSegment(i, xin, yin) {
  var dx = xin - x[i];
  var dy = yin - y[i];
  var angle = atan2(dy, dx);
  x[i] = xin - cos(angle) * segLength;
  y[i] = yin - sin(angle) * segLength;
  segment(x[i], y[i], angle);
}

function segment(x, y, a) {
  push();
  translate(x, y);
  rotate(a);
  ellipse(0, 0, segLength / 2, segLength / 2);
  //line(0, 0, segLength, 0);
  pop();
}
