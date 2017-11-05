const grid = new Array(); //pad grid
let gridWidth;
let gridXOffset;
let gridYOffset;
let menuWidth;


const n = 6; //grid's side size
let clk; //clock instance
let socket; //not in use at the moment
let wdir; //working directory

const swap = { //swap object to select pad, file and load file into pad
  pad: undefined,
  file: undefined,

  setPad: function(p) {
    if(this.pad)this.pad.selected = false;
    this.pad = p;
    if(this.pad)this.pad.selected = true;
  },

  setFile: function(f) {
    this.file = f;
  },

  swapFile: function() {
    this.pad.load(this.file);
    this.pad.selected = false;
    this.pad = undefined;
    this.file = undefined;
  }
};

function setup() {
  createCanvas(window.innerWidth - 30, window.innerHeight - 17);
  clk = new Clock(width* 0.12, height * 0.87, width*0.08);
  clk.setBPM(120);
  clk.start();

  gridWidth = width * 0.66;
  gridXOffset = width * 0.28;
  gridYOffset = height * 0.08;
  menuWidth = width/4;

  for (var i = 0; i < n * n; i++) { //creating pads
    let tmpP = new pad(gridXOffset + (i%n) * gridWidth/n, gridYOffset + floor(i/n) * gridWidth/n, i);
    grid.push(tmpP);
  }
}


function draw() {
  background(51);
  stroke(255);
  line(menuWidth, 0, menuWidth, height);

  if (clk.angle < -PI/2 + 0.08) { //Clock tick check
    for (var i = 0; i < grid.length; i++) {
      if (grid[i].waiting) grid[i].toggle();
      if (grid[i].on) grid[i].play();
    }
  }

  //render every pad
  for (var i = 0; i < grid.length; i++) {
    grid[i].render();
  }

  noStroke();
  fill(180);
  textSize(0.025 * width);
  text("Samples", menuWidth*0.03, 25);

  //clk update and render
  clk.update(millis());
  clk.render();
}

//functions necessary for drag and drop files(will be taken off soon)
function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.getAttribute('src')); //ao invez de passar o id, vou passar o src
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.setAttribute('src', data);
}
