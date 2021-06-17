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
  instruct = 1,
  maxvel = 1;

var funcs = [
  function(obj) {
    return map(obj.l.x,5,windowWidth-5,-1,1,true)
  },
  function(obj) {
    return map(obj.l.y,5,windowWidth-5,-1,1,true)
  },
  function(obj) {
    return obj.v.mag()
  },
  function(obj) {
    return obj.v.x
  },
  function(obj) {
    return obj.v.y
  },
  function(obj) {
    return map(obj.l.x,5,windowWidth-5,-1,1,true)*-1
  },
  function(obj) {
    return map(obj.l.y,5,windowWidth-5,-1,1,true)*-1
  },
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
    this.ch = []
    this.chindex = []
    this.chlen = 5
    for (var i = 0; i<this.chlen; i++) {
      let num = Math.round(Math.random()*(funcs.length-1))
      this.chindex.push(num)
    }
    dotslist.push(this);
    mainlist.push(this);
  }

  update() {
    for (var i = 0; i<this.chlen; i++) {
      let val = funcs[this.chindex[i]](this)
      this.ch[i] = val
    }
    this.a.x = this.ch[0]*this.ch[3]+this.ch[2]
    this.a.y = this.ch[1]*this.ch[2]+this.ch[4]
    this.v.add(this.a)
    if (this.v.x>maxvel) this.v.x = maxvel
    if (this.v.x<-maxvel) this.v.x = -maxvel
    if (this.v.y>maxvel) this.v.y = maxvel
    if (this.v.y<-maxvel) this.v.y = -maxvel
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
  textwall(10,15,["fps",round(frameRate())],["pos",dotslist[0].a.x])
}
