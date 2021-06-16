function setup() {
  createCanvas(800, 800);
  colorMode(HSB, 100);
  angleMode(DEGREES)
}
var a = 0
var c = 0
function draw() {
  frameRate(60)
  stroke(c,100,100)
  strokeWeight(7)
  line(400,400,400+cos(a)*500,400+sin(a)*500)
  fill(100)
  stroke(40)
  text(c,400+cos(a)*300,400+sin(a)*300)
  a += 3.6
  c++
  if (a >= 360) {
    a -= 3.6
    c = 0
  }
}
