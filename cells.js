var zoom = 1,
  zscl = 0.9,
  zpos = 0,
  zposscl = 12,
  centerx = 0,
  centery = 0,
  rev = -1,
  brushsize = 30;

var dotslist = [],
  gridx = [],
  gridy = [],
  mainlist = [];

var fps = 60,
  tpf = 3,
  loopon = true,
  debug = true,
  channels = { global: true, objectdata: false },
  gamerule = { dt: [1, 0, 1], backg: [true, false, true] },
  textdisplay = [],
  keyz = [],
  teams = { green: { teamname: 'green', deadcolor: [40, 60, 60] }, purple: { teamname: 'purple', deadcolor: [78, 60, 60] } };

function setup() {
  createCanvas(windowWidth - 5, windowHeight - 5);
  textSize(window.innerHeight / 20);
  colorMode(HSB, 100);
  zpos = createVector(0, 0);
  centerx = width / 2;
  centery = height / 2;

  new Dot({ x: width / 2, y: height / 2 + 200, lock: false, size: 100, name: "big", m: 1000, maxhealth: 10000, team: teams.purple });
  new Dot({ x: 100, y: 50, lock: false, size: 140, name: "smol", m: 1000, maxhealth: 1000, team: teams.green, targ:dotslist[0] });
  mainlist.forEach(function (e) {
    e.initialize();
  });
  // for (let i = 0; i < 10; i++) {
  //   new Dot({
  //     x: width / 2 + i,
  //     y: 300,
  //     xs: 0,
  //     ys: 0,
  //     m: 1000,
  //     name: "purp",
  //     color: [60, 100, 100],
  //     team: teams.purple
  //   });
  // }
}



class Dot {

  constructor({
    x = 0,
    y = 0,
    xs = 0,
    ys = 0,
    xa = 0,
    ya = 0,
    size = 12,
    m = 1000,
    color = [40, 100, 100],
    targ = NaN,
    targl = createVector(100, 100),
    grav = createVector(width / 2, height / 2),
    lock = false,
    name = "dot",
    team = teams.green,
    maxhealth = 1000,
    damage = 20,
    cool = 20
  }) {
    this.l = createVector(x, y);
    this.v = createVector(xs, ys);
    this.a = createVector(xa, ya);
    this.f = createVector(0, 0);
    this.color = color;
    this.size = size; //radius but ellipse() takes diameter
    this.grav = grav;
    this.targ = targ;
    this.targl = targl;
    this.lock = lock;
    this.name = name;
    this.m = m;
    this.team = team
    this.maxhealth = maxhealth
    this.health = maxhealth
    this.damage = damage
    this.cool = cool
    this.c = 0
    dotslist.push(this);
    mainlist.push(this);
  }

  update() {
    if (!this.lock) {
      if (this.c < this.cool) {
        this.c++
      }
      this.f.set(0, 0)
      let targvec
      if (this.targ) {
        if (this.targ.health <= 0) {
          this.targ = NaN
        } else {
          targvec = this.targ.l.copy().sub(this.l)
          this.f.add(targvec.normalize().mult(gamerule.dt[0]))
        }
      } else if (gamerule.dt[0]==1) {
        this.v.mult(0)

      }

      for (let i = 0; i <= dotslist.length - 1; i++) {
        let idot = dotslist[i]
        if (idot != this && idot.lock == false) {
          let csize = this.size + idot.size
          if (btwn(idot.l.x + 1.4 * csize, idot.l.x - 1.4 * csize, this.l.x)) {
            if (btwn(idot.l.y + 1.4 * csize, idot.l.y - 1.4 * csize, this.l.y)) {
              // textdisplay.push(["potential collision for " + this.name])
              //use targvec here also
              let d = dist(this.l.x, this.l.y, idot.l.x, idot.l.y)
              if (d <= csize) {
                if (idot.team.teamname != this.team.teamname && (this.c >= this.cool || this.c == 0)) {
                  this.targ = idot
                  idot.health -= this.damage * gamerule.dt[0]
                  this.c = 0
                }
                // let vecbt = this.l.copy().sub(idot.l).normalize().mult(this.v.mag()*this.m*0.01 + Math.exp(0.1*(csize-d))*0.01+1)
                let vecbt = this.l.copy().sub(idot.l).normalize().mult((csize - (d)) * 0.5)
                let a = Math.cos(this.v.angleBetween(idot.v))
                let damp = 0.98
                let dmult = (damp + (1 - damp) * a)
                if (gamerule.dt[0] != 0 && dmult) {
                  this.v.mult(dmult)
                }

                // textdisplay.push(["a",a])
                // let vecbt = this.l.copy().sub(idot.l).normalize().mult((csize-d)*0.1)
                // let df = -(d-csize)
                this.f.add(vecbt.mult(gamerule.dt[0]))
              }
            }
          }
        }
      }

      // console.log(this.f)
      // let gx = round(this.l.x/100)
      // let gy = round(this.l.y/100)
      // gridx[gx] = this
      // gridy[gy] = this

      // if (this.targ) {
      // for(let i=0; i<=gridx.length-1; i++) {
      //   if (gridx[i] == this.targ) {
      //     for(let j=0; j<=gridy.length-1; j++) {
      //       if (gridy[j] == this.targ) {
      //         console.log(i,j)
      //       }
      //     }
      //   }
      // }}
      this.f.add(this.v.copy().mult(this.v.mag()).mult(-30 * gamerule.dt[0]))
      this.a.set(this.f.copy().div(this.m))
    }
  }

  finalupdate() {
    if (!this.lock) {
      this.v.add(this.a.copy().mult(gamerule.dt[0]));
      this.l.add(this.v.copy().mult(gamerule.dt[0]));
      // textdisplay.push(["speed",this.v],["f",this.f])
      if (this.health <= 0) {
        this.lock = true
        this.targ = NaN
        this.v = createVector(0, 0)
        this.color = [20, 0, 90]
      }
    }
  }

  prerender() { }

  render() {
    push();
    fill(this.team.deadcolor[0], this.team.deadcolor[1], this.team.deadcolor[2])
    ellipse(this.l.x, this.l.y, this.size * 2);
    fill(this.color[0], this.color[1], this.color[2]);
    ellipse(this.l.x, this.l.y, map(this.health, 0, this.maxhealth, 0, this.size * 2, true))
    drawArrow(this.l, this.v, "blue", 0, 0.5)
    pop();
  }

  initialize() {

  }
}

function drawArrow(base, vec, myColor, min = 0, max = 200, bounds = true) {
  push();
  if (vec.equals(0, 0)) {
    fill(myColor)
    ellipse(base.x, base.y, 5)
  } else {
    strokeWeight(2);
    stroke(myColor);
    fill(myColor);
    let targ = vec.copy().add(base);
    let vecbt = targ.copy().sub(base);
    let mag = vecbt.mag()
    mag = map(mag, min, max, 0, 50, bounds)
    vecbt.setMag(mag)
    line(base.x, base.y, base.x + vecbt.x, base.y + vecbt.y);
    let arrowSize = 5;
    translate(base.x, base.y);
    rotate(vecbt.heading());
    translate(mag - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
  }
}

function btwn(bound1, bound2, num) {
  if (num >= Math.min(bound1, bound2) && num <= Math.max(bound1, bound2)) {
    return true;
  } else return false;
}

function textwall(x, y, xoffset, list) {
  push();
  textSize(15);
  textAlign(LEFT);
  fill(0)
  for (let i = 0; i < list.length; i++) {
    text(list[i][0] + ": ", x, y + i * 15);
  }
  textAlign(LEFT)
  for (let i = 0; i < list.length; i++) {
    if (typeof list[i][1] == "number") {
      text(list[i][1], x + xoffset, y + i * 15);
    } else {
      text(list[i][1], x + xoffset, y + i * 15);
    }
  }
  pop();
}

function mouseDragged() {
  let realx = (mouseX - centerx) / (zoom) + centerx - zpos.x
  let realy = (mouseY - centery) / (zoom) + centery - zpos.y
  new Dot({ x: realx, y: realy, targ: dotslist[0] })
}

function mousePressed() { }

function keyPressed() {
  keyz[keyCode] = true;

  togbutton(32, "dt");
  togbutton(76, "backg")
  if (keyz[75] == true) {
    if (isLooping()) {
      noLoop()
    } else {
      loop()
    }
  }
  if (keyz[72]==true) {
    mainlist.splice(1,1)
  }
  if (keyz[71]==true) {
    mainlist.splice(0,1)
  }
  if (keyz[74] == true) {
    redraw()
  }
}

function keyReleased() {
  keyz[keyCode] = false;

}

function mouseWheel(event) {
  if (event.delta > 0) {
    zoom *= zscl
  }
  if (event.delta < 0) {
    zoom /= zscl;
  }
}

function lg(message, ch = "global") {
  if (channels.global == true && channels[ch] == true) {
    console.log(message);
  }
}

function togbutton(code, index) {
  if (keyz[code] == true) {
    if (gamerule[index][0] == gamerule[index][1]) {
      gamerule[index][0] = gamerule[index][2];
    } else {
      gamerule[index][0] = gamerule[index][1];
    }
  }
}

function draw() {
  textdisplay = [
    ["FPS", round(frameRate())],
    ["Total Objects", mainlist.length],
    ["Simulation Speed", gamerule.dt[0]],
    ["mouse", [mouseX,mouseY]],
    ["sp", dotslist[0].v.mag()],
    ['f', dotslist[0].f.mag()],
    ["health", dotslist[0].health],
    ["a", dotslist[0].a.mag()],
    ["c", dotslist[0].c],
    ["targ",dotslist[0].targ.l]
  ]

  push();

  if (gamerule.backg[0]) background(80);
  frameRate(fps);

  textwall(
    10,
    20,
    150,
    textdisplay
  );

  translate(width / 2, height / 2);
  scale(zoom);
  translate(zpos.x - width / 2, zpos.y - height / 2);

  for (var i = 0; i < tpf; i++) {
    mainlist.forEach(function (e) {
      e.update();
    });
    mainlist.forEach(function (e) {
      e.finalupdate();
    });
  }

  mainlist.forEach(function (e) {
    e.render();
  });

  let realx = (mouseX - centerx) / (zoom) + centerx - zpos.x
  let realy = (mouseY - centery) / (zoom) + centery - zpos.y
  // fill(60,100,90)
  // ellipse(realx,realy,brushsize*2)
  pop();

  if (keyz[37] == true || keyz[65] == true) {
    zpos.x -= zposscl * zscl * rev;
  }
  if (keyz[38] == true || keyz[87] == true) {
    zpos.y -= zposscl * zscl * rev;
  }
  if (keyz[39] == true || keyz[68] == true) {
    zpos.x += zposscl * zscl * rev;
  }
  if (keyz[40] == true || keyz[83] == true) {
    zpos.y += zposscl * zscl * rev;
  }
  if (keyz[73] == true) {
    zoom /= zscl;
  }
  if (keyz[79] == true) {
    zoom *= zscl;
  }
}
