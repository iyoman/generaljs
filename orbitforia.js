function setup() {
    createCanvas(windowWidth - 5, windowHeight - 5);
    textSize(window.innerHeight / 20);
    colorMode(HSB, 100);
  
    new Dot({ x: width / 2, y: height / 2 + 200, lock: true, size: 200 });
    new Dot({
      x: width / 2,
      y: height / 2,
      launch: [-90, 2],
      grav: dotslist[0].l,
      name: "obj",
      color: [60,100,100],
    });
  
    mainlist.forEach(function (e) {
      e.initialize();
    });
  }
  
  var dotslist = [],
    mainlist = [],
    energy = [],
    fps = 60, // draw loop refresh rate
    dt = 1,
    dt1 = dt, //delta time
    tpf = 10, //ticks/updates per frame
    back = true, //background
    db = true,
    channels = { 0: true, 1: true, data:false ,data2:true},
    c = 400,
    keyz = []
  
  class Dot {
    constructor({
      x = 0,
      y = 0,
      xs = 0,
      ys = 0,
      xa = 0,
      ya = 0,
      size = 6,
      color = [40, 100, 100],
      grav = createVector(width / 2, height / 2),
      lock = false,
      launch = [0, 0],
      name = "dot",
    }) {
      this.l = createVector(x, y);
      this.v = createVector(xs, ys);
      this.a = createVector(xa, ya);
      this.color = color;
      this.size = size;
      this.grav = grav;
      this.lock = lock;
      this.launch = launch;
      this.name = name;
      this.maxh = 0;
      this.rdist = 0
      dotslist.push(this);
      mainlist.push(this);
    }
  
    update() {
      //computation for each object every frame here
      if (!this.lock) {
        var incvec = this.l.copy().sub(this.grav);
        var d = incvec.mag();
        var inc = atan2(incvec.y,incvec.x);
        // if (d < 3) {
        //   d = 25;
        // }
        if (d > this.maxh) {
          this.maxh = d;
        }
        
        incvec.normalize();
        
        this.a = incvec.mult(-1000).div(d * d);
  
        if (this.name == "obj" && c >= 400) {
          lg(d + "     " + millis(),"data");
          c = 0;
        } else {
          c++;
        }
        
        if (d < 200) {
          this.l = createVector(dotslist[0].l.x,dotslist[0].l.y-200)
          
          lg(this.launch[0]+"   "+this.maxh+"   "+(-90-degrees(inc)))
          this.launch[0]++
          this.v = p5.Vector.fromAngle(radians(this.launch[0]), this.launch[1]);
          this.maxh = 0
        }
      }
    }
  
    finalupdate() {
      //update all object values at the end of the frame
      if (!this.lock) {
        this.v.add(this.a.copy().mult(dt));
        this.l.add(this.v.copy().mult(dt));
      }
    }
  
    prerender() {
      push();
      fill(this.color[0], this.color[1], this.color[2]);
      ellipse(this.l.x, this.l.y, this.size * 2);
      pop();
    }
  
    render() {}
  
    initialize() {
      var launch = p5.Vector.fromAngle(radians(this.launch[0]), this.launch[1]);
      this.v.add(launch);
    }
  }
  
  function drawArrow(base, vec, myColor) {
    if (db || myColor == "orange") {
      push();
      strokeWeight(1);
      stroke(myColor);
      fill(myColor);
      let vec2 = vec.copy().mult(1);
      let vecbetween = vec.copy().sub(base);
      line(base.x, base.y, vec2.x, vec2.y);
      let arrowSize = 7;
      translate(base.x, base.y);
      rotate(vecbetween.heading());
      translate(vecbetween.mag() - arrowSize, 0);
  
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
      if (typeof a == "number") {
        text(args[a][0] + ": " + nfs(round(args[a][1], 2)), x, y + a * 15);
      } else {
        text(args[a][0] + ": " + args[a][1], x, y + a * 15);
      }
    }
    pop();
  }
  
  function mousePressed() {
    
  }
  
  function keyPressed() {
    if (keyCode==32 && dt != 0) {
        dt = 0
    } else {
        dt = dt1
    }
    if (keyCode==76) {
        loop()
    }
    if (keyCode==75) {
        noLoop()
    }
    keyz[keyCode] = true
  }

  function keyReleased() {
    keyz[keyCode] = false
  }
  
  function buttonHandling() {
    //not used yet, idea?
  }

  function lg(message, ch = 1) {
    if (channels[0] == true && channels[ch] == true) {
      console.log(message);
    }
  }
  
  function draw() {
    if(back) background(80);
    frameRate(fps);
    for (var i=0;i<tpf;i++) {
      mainlist.forEach(function (e) {
      e.update();
      e.finalupdate();
    });
    }
    mainlist.forEach(function (e) {
      e.prerender();
      e.render()
    })
    textwall(
      10,
      20,
      ["fps", round(frameRate())],
      ["total", mainlist.length],
      ["maxh", dotslist[1].maxh],
      ["sp",dotslist[1].v],
      ["launch",dotslist[1].launch[0]],
      ["dt",dt]
    );
  }
