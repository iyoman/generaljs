function setup() {
  createCanvas(windowWidth - 5, windowHeight - 5);
  textSize(window.innerHeight / 20);
  curveTightness(0);
  colorMode(HSB, 100);
  border = 20
  
  for (var i=0; i<200;i++) {
    new Dot({x:random(border,windowWidth-border),y:random(border,windowHeight-border),color:[40,100,100]})
  }
  
  mainlist.forEach(function (e) {
    e.initialize();
  });
}

var dotslist = [],
  mainlist = [],
  energy = [],
  fpms = 60,
  dt = 1,
  db = 1,
  instruct = 1;

var funcs = [
  function(obj) {
    obj.a.x = map(obj.l.x,5,windowWidth-5,-0.5,0.5,true)
  },
  function(obj) {
    
  }
]

class Dot {
  constructor({
    x = 50,
    y = 50,
    vx = 0,
    vy = 0,
    ax = 0,
    ay = 0,
    color = [30, 100, 100],
    mass = 1,
    size = 10,
    damping = 0.3,
    k = 0.3,
  }) {
    this.l = createVector(x, y);
    this.v = createVector(vx, vy);
    this.a = createVector(ax, ay);
    this.f = createVector(0, 0);
    this.color = color;
    this.mass = mass;
    this.size = size;
    this.k = k;
    this.damping = damping;
    dotslist.push(this);
    mainlist.push(this);
  }

  update() {
    funcs[0](this)
    this.v.add(this.a)
    this.l.add(this.v)
  }
  
  finalupdate() {
    
  }

  render() {
    push();
    fill(this.color[0], this.color[1], this.color[2]);
    ellipse(this.l.x, this.l.y, this.size);
    pop();
  }

  initialize() {
    
  }
}

function drawArrow(base, vec, myColor, scal) {
  if (debug || myColor == "orange") {
    let scl = scal;
    push();
    strokeWeight(1);
    stroke(myColor);
    fill(myColor);
    translate(base.x, base.y);
    let vec2 = vec.copy().mult(scl);
    line(0, 0, vec2.x, vec2.y);
    rotate(vec.heading());
    let arrowSize = 7;
    translate(vec2.mag() - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
  }
}

function btwn(bound1, bound2, num) {
  if (num >= Math.min(bound1, bound2) && num <= Math.max(bound1, bound2)) {
    return true;
  } else return false;
}

function textwall(x, y, ...args) {
  push();
  textSize(15);
  for (var a in args) {
    text(args[a][0] + ": " + nfs(round(args[a][1], 2)), x, y + a * 15);
  }
  pop();
}

function draw() {
  background(80);
  frameRate(fpms)
  mainlist.forEach(function (e) {
    e.update();
  });
  mainlist.forEach(function (e) {
    e.finalupdate();
    e.render();
  });
  textwall(10,15,["fps",round(frameRate())],["pos",dotslist[0].l.y])
}
