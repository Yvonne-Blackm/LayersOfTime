/*
Layers of Time
By Yvonne Blackmore

A flow field of particles moving across the screen.
Clicking the mouse causes the background to change to a different grey shade, while the particles change to the opposite ratio of darker or lighter grey shade, creating shadow trails. 

References:
Flow field with interaction: https://editor.p5js.org/zhuanya28/sketches/NgIOGuc6J

*/

let num = 1000;

let noiseScale = 200;
let noiseStrength = 2;
let particles = [num];
let xoff;
let inc = 0.2; // For speed changes

let fillColour = 0; // For changing particle colour
let greyVal = 0; // Greyscale colour for background

function setup() {
  createCanvas(windowWidth, windowHeight);
  xoff = 0; // Offset
  noStroke();

  // Create vectors and particles
  for (let i = 0; i < num; i++) {
    let loc = createVector(200, height / 2); // Starting position
    let angle = 0;
    let dir = createVector(cos(angle), sin(angle));
    let speed = 10;
    particles[i] = new Particle(loc, dir, speed);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
 
  if (millis() <= 3000) {  // Instructions at start
    text("Click mouse to change shades", width / 2, height / 2);
  }
  else{
    text(" ");
}

  background(greyVal, 10); // some transparency

  fill(0, 10);
  noStroke();

  for (let i = 0; i < particles.length; i++) {
    particles[i].run();
    particles[i].updateSpeed();
  }
}

class Particle {
  constructor(loc, dir, speed) {
    this.loc = loc; // vector with (x,y) params
    this.dir = dir; // vector with (cos of angle, sin of angle) params
    this.speed = speed;
  }
  run() {
    this.move();
    this.checkEdges();
    this.update();
  }
  updateSpeed() {
    this.speed = map(300, 0, width, -5, 5) + random(-3, 3);
    xoff = xoff + inc; // Increase x position
  }

  move() {
    let angle =
      noise(
        this.loc.x / noiseScale,
        this.loc.y / noiseScale,
        frameCount / noiseScale
      ) *
      PI *
      noiseStrength; // Restrict angle around x axis

    let n = noise(
      this.loc.x * noiseScale,
      this.loc.y * noiseScale,
      frameCount * noiseScale * noiseStrength
    ); // changed last Scale to Strength but didn't make much difference

    this.dir.x = cos(angle);
    this.dir.y = sin(angle);
    let vel = this.dir.copy();
    let d = 3; // Direction: +ve = to right, -ve to left

    vel.mult(this.speed * d); //vel = vel * (speed * direction)
    this.loc.add(vel); // location = location + velocity
  }

  checkEdges() {
    // Restart at left edge if leaves screen

    if (
      this.loc.x < 0 ||
      this.loc.x > width ||
      this.loc.y < 0 ||
      this.loc.y > height
    ) {
      this.loc.x = 0; // Restarts at left
      this.loc.y = height / 2; // Restarts at centre screen height
    }
  }
  update() {
    //Draw particle: if background pale, make particle darker
    if (greyVal >= 150) {
      let newFill = 255 - greyVal;
      fill(newFill, 150);
    } else {
      fill(255, 150);
    }
    ellipse(this.loc.x, this.loc.y, 3);
  }
}

function mousePressed() {
  // Change greyscale value randomly
  greyVal = random(255);
  fillColour = 0;
}
