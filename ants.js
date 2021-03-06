var particlesQ = 500;
var c = 0;

var x = new Array(particlesQ);
var y = new Array(particlesQ);
var vx = new Array(particlesQ);
var vy = new Array(particlesQ);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setup() {
	createCanvas(windowWidth, windowHeight);
  background(255);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function draw() {
  background(220)
	for (var a = 0; a < c; a++) { //A
		var ax = 0, ay = 0;
		
		for (var b = 0; b < c; b++) { //B
			if (a != b) {
				dx = x[a] - x[b];
				dy = y[a] - y[b];
				var d = sqrt(dx*dx + dy*dy);
				if (d < 1) {d = 1}
                
				var common = cos(d)/d;

				ax += common * dx;
				ay += common * dy;
			}
		} //B

		vx[a] += ax * 0.05;
		vy[a] += ay * 0.05;
	} //A
	
	for (var i = 0; i < c; i++) {
		x[i] += vx[i];
		y[i] += vy[i];
		
		set(x[i], y[i], 0);
	}

	updatePixels();
    textwall(c,x[0],y[0],6.5,5,3,3)
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addNewParticle() {
	x[c] = mouseX;
	y[c] = mouseY;
	vx[c] = 0;
	vy[c] = 0;

	c++;
	if (c >= particlesQ) c = 0;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function mouseClicked() {
	addNewParticle();
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function mouseDragged() {
	addNewParticle();
}

function textwall(...args) {
  for(var a in args){
    text(args[a],5,15+a*20)
  }
}
