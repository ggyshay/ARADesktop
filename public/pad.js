let $ = require('jquery');

function pad(x, y, index) {
  //FISICAL ATTRIBUTES
  this.l = 0.9 * gridWidth / n; //side size
  this.x = x + 0.05 * this.l;
  this.y = y + 0.05 * this.l;
  this.r = this.l * 0.3;

  this.index = index; //reference value

  //STATE VARS
  this.on = false; //playing
  this.waiting = false; //waiting clock to play
  this.selected = false;

  this.sound = null; //sound reference
  var self = this;

  this.alert = new Alert(this.x + this.l / 2, this.y + this.l / 2, this.r); //no file alert

  this.element = document.createElement('div'); //cria o elemento html
  this.element.style = createStyle(this.x, this.y, this.l, this.l, false);
  this.element.setAttribute('ondrop', 'drop(event)');
  this.element.setAttribute('ondragover', "allowDrop(event)");
  this.element.setAttribute('id', 'drop' + index);
  this.element.setAttribute('src', '');
  this.element.addEventListener("click", this, false);
  this.element.addEventListener("drop", this, false);
  $("#padDisplay")[0].appendChild(this.element);

  this.addB = new OpenFileB(this.x + this.l * 0.9, this.y + this.l * 0.1, 25); //swap file button

  this.toggle = function() { //play pause
    if (this.hasSound()) {
      if (this.on) this.sound.stop();
      this.on = !this.on;
      this.waiting = false;
    }
  }

  this.play = function() {
    this.sound.playMode("restart");
    this.sound.play();
  }

  this.cue = function(clicked) { //put pad on waiting to play
    self.waiting = !self.waiting;
  }

  this.load = function(s) { //load sound function, s: path

    if (this.on) this.toggle(); //turn it off before load sound

    this.sound = loadSound(s);
    let env = new p5.Env();
    env.setADSR(5, 0, 100, 0);
    env.setRange(1, 0);


    this.sound.amp(env);
    this.alert.hide();
    console.log('loaded:' + s);
  }

  this.render = function() {

    if (!this.hasSound()) {
      noStroke();
      fill(21);
      rect(this.x, this.y, this.l, this.l, this.r / 3);
    }
    if (this.selected) {
      noStroke();
      fill(255, 0, 255, 50);
      rect(this.x, this.y, this.l, this.l, this.r / 3);

    } else {
      noFill();
      stroke(255);
      rect(this.x, this.y, this.l, this.l, this.r / 3);

      if (this.waiting) {
        noStroke();
        fill(100, 0, 200);
        ellipse(this.x + this.l / 2, this.y + this.l / 2, this.r, this.r);
      } else if (this.on) {
        noStroke();
        fill(255, 0, 100);
        ellipse(this.x + this.l / 2, this.y + this.l / 2, this.r, this.r);
      }
    }

    this.alert.render();
    this.addB.render();
  }

  this.hasSound = function() {
    return this.sound != null && this.sound.isLoaded();
  }
}

pad.prototype.handleEvent = function(e) {
  switch (e.type) {
    case "click":
      {
        if (this.addB.clicked()) { //click was over the swap button
          if (swap.pad != this) { //this wasnt selected yet
            swap.setPad(this); //select this
          } else { //this was selected
            swap.setPad(null);
          }
        } else {
          this.cue(true);
        }
        break;
      }
    case "drop":
      {
        this.load(this.element.getAttribute("src"));
        break;
      }
    default:
      {
        console.log("Unbound Operation");
        break
      }
      // add other event types if needed
  }
}

function Alert(x, y, r) { //no File Alert
  this.x = x;
  this.y = y;
  this.showing = true;
  this.r = r;

  this.render = function() {
    if (this.showing) {
      noStroke();
      fill(100);
      ellipse(this.x, this.y, this.r, this.r);
      fill(250, 200, 0);
      textSize(0.6 * this.r);
      text("!", this.x - this.r * 0.1, this.y + this.r * 0.2);
    }
  }
  this.hide = function() {
    this.showing = false;
  }
}

function OpenFileB(x, y, r) { //open file button
  this.x = x;
  this.y = y;
  this.r = r;
  this.showing = true;

  this.render = function() {
    if (this.showing) {
      noStroke();
      fill(100);
      ellipse(this.x, this.y, this.r, this.r);
      fill(0, 170, 22);
      textSize(this.r);
      text("+", this.x - this.r * 0.32, this.y + this.r * 0.4);
    }
  }

  this.clicked = function() {
    return dist(mouseX, mouseY, this.x, this.y) < this.r;
  }
}

function createStyle(positionX, positionY, width, height, border) { //just to not have it messed up there
  var s = "position: absolute; left: " + positionX + "px; top: " + positionY + "px; width:" + width + "px; height:" + height + "px; ";
  if (border) s += "border: 1px solid white;";
  return s;
}
