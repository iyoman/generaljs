function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  angleMode(DEGREES)
  rectMode(CENTER)
  translate(width/2,height/2)
  fill('black')
  push()
}

var coolPat = { 
     "blank": 0,
     "spiral": [88,-1,1.5], 
     "wave1": [88,-1,0.1], 
     "wave2": [88,-1,0.05],
     "field": [74,-1,0.05],
     "field2": [58,-1.5,0.5],
     "star": [45,-0.5,0.4],
     "wheel": [45.2,-0.5,0.4],
     "circles": [30,-0.5,-0.7],
     "grow": [30,0.1,0.1],
     "star2": [60,3,-1],
     "streak": [60,1,-0.1],
     "record": [1,1,-0.1],
     "depth": [85,2,-0.1],
     "blind": [1,0,0],
}

var loadPat = coolPat.wheel
var dotslist = []

var size = 0
var angle = 85
var addX = 2
var addY = -0.1

if (loadPat != 0) {
  angle = loadPat[0]
  addX = loadPat[1]
  addY = loadPat[2]
}

class dot {
constructor(x,y, color){
this.x = x
this.y = y
this.color = color}
}

for (var i in [...Array(60).keys()]) {
dotslist.push(new dot(i*10-400,0,5))
}

function draw() {
  pop()
  for (var i = 0; i<dotslist.length; i++){
    ellipse(dotslist[i].x, dotslist[i].y, size)
    dotslist[i].x = dotslist[i].x+addX
    dotslist[i].y = dotslist[i].y+addY
  }
  rotate(angle)
  push()
}
