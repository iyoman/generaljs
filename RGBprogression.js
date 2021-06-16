document.body.innerHTML = '<canvas id="myCanvas" width="375" height="555"></canvas><p id="demo"></p>'


var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var r = 0
var g = 0
var b = 0
var speed = 1
var seq = [
  [1, 0, 0],
  [0, 1, 0],
  [-1, 0, 0],
  [0, 0, 1],
  [0, -1, 0],
  [1, 0, 0],
  [0, 0, -1],
]
var i = 0
var t = 0

function drawRect() {
  if (t == 225) {
    i++
    t = 0
    if (i == 7) {
      i = 1
    }
  }
  t++
  r = r + speed * seq[i][0]
  g = g + speed * seq[i][1]
  b = b + speed * seq[i][2]
  ctx.beginPath();
  ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ',1)'
  ctx.rect(170, 190, 900, 900);
  ctx.fill();
  document.getElementById("demo").innerHTML = r + ' , ' + g + ' , ' + b
}
setInterval(drawRect, 10);
