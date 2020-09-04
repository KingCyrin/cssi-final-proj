/* global 
   noLoop, stroke, strokeWeight, noStroke, fill, ellipse, rng, DEBUG, 
   imageMode, image, CENTER, AVATAR_PLAYER, random, resizeCanvas, windowWidth,
   windowHeight, camera, strokeCap, ROUND, ARENA_X, ARENA_Y, loadImage, 
   AVATAR_ENEMY, avatar_load_fail, PELLET_MAX, keyCode, ESCAPE, IDX_PLAYER_CELL,
   Cell, Pellet, Virus, mouseIsPressed, line, push, pop, GAME_PAUSED, GAME_OVER, 
   createCanvas, preload_game_assets, background, PELLET_SZ, ENEMY_MAX, 
   CAMERA_ZOOM, bgColour, ARENA_SCALE, replenish_pellets, pool_count, pool,
   reposition_camera, SAMPLE_SZ, display_menu_game_over, display_menu_game_paused,
   filter, BLUR, rect, textSize, textAlign, text, BOTTOM, TOP, BOLDITALIC,
   NORMAL, floor, textStyle, 
*/

/*
=== DOCUMENTATION
the user controls only one cell
  - this is stored internally via the this.playerControlled state
*/

// save the idx of the player's cell: used to align the camera
var IDX_PLAYER_CELL;

// maximum number of enemy cells
var ENEMY_MAX = 69;

// a cell can consume another cell if: CONSUMPTION_CONST * predatorCell.size > preyCell.size
// also: predatorCell.size += CONSUMPTION_CONST * preyCell
var CONSUMPTION_CONST = 0.8;

var MAX_CELL_SIZE = 4000;

class Cell {
  constructor(x, y, size, avatar, playerControlled) {
    // initialize this first
    this.playerControlled = playerControlled;

    // default: enemy cells have red outline
    this.stroke_fill = [255, 0, 0];
    if (this.playerControlled == true) {
      this.stroke_fill = [0, 0, 0];
    }

    // the actual size of the cell
    this.size = size;

    // the apparent size of the cell
    // (used to do animations after eating another cell)
    this.displaySize = this.size;

    // graphics
    this.avatar = avatar;
    this.fill = [rng(255), rng(255), rng(255)];
    this.purge = false;

    // position
    this.xpos = x;
    this.ypos = y;

    // velocity
    this.xvel = 0;
    this.yvel = 0;

    // invariant/initial x and y velocities for moving NPC cells
    // both components must satisfy: lower_bound ≤ abs(this.ivel) ≤ upper_bound
    // (basically: random magnitude, random direction)
    var v_lb = 100; // velocity lower bound
    var v_ub = 500; // velocity upper bound
    var v_range = v_ub - v_lb; // range = upper bound - lower bound
    this.ixvel = v_lb + random(v_range) * [-1, 1][ floor(random(1) + 0.5) ];
    this.iyvel = v_lb + random(v_range) * [-1, 1][ floor(random(1) + 0.5) ];

    // acceleration
    this.xaccel = 0;
    this.yaccel = 0;
  }

  // TODO: can only collide w/ cell, pellet, virus
  isCollidingWith(object) {
    var r1 = this.displaySize / 2; // our radius
    var r2 = object.displaySize / 2; // the object's radius

    // square center-center distance between both objects
    var sqDist =
      (this.xpos - object.xpos) * (this.xpos - object.xpos) +
      (this.ypos - object.ypos) * (this.ypos - object.ypos);
    var isColliding =
      sqDist <= (r1 + 0) * (r1 + 0) || sqDist <= (0 + r2) * (0 + r2); // this object's exterior is touching the other object's center // this object's center is touching the other object's exterior

    return isColliding;
  }

  // Cells can collide with Pellets, Viruses, and Cells
  // therefore call the appropriate function for each object type
  handleCollision(object) {
    switch (object.constructor.name) {
      case "Pellet":
        this.eat_pellet(object);
        break;

      case "Virus":
        this.getRektByVirus(object);
        break;

      case "Cell":
        if (this.can_eat_cell(object)) {
          // `this` cell eats the other cell
          this.do_eat_cell(object);
        } else if (object.can_eat_cell(this)) {
          // the other cell eats `this` cell
          object.do_eat_cell(this);
        }

        break;
      default:
        console.log("[!] cell tried to collide w/: " + object.constructor.name);
        noLoop();
    }
  }

  eat_pellet(pellet2eat) {
    // The cell grows according to its current size
    // (Would be nice to replace this hack with something more elegant)
    var sz_inc;
    if (this.size < 64) {
      sz_inc = 3;
    } else if (this.size < 128) {
      sz_inc = 2;
    } else if (this.size < 256) {
      sz_inc = 1.6;
    } else if (this.size < 512) {
      sz_inc = 1;
    } else if (this.size < 1024) {
      sz_inc = 0.8;
    } else {
      // cell is too big to grow by eating pellets
      // can only grow by eating enemy cells
      sz_inc = 0;
    }

    // no fancy animations here
    this.size += + sz_inc;
    this.displaySize = this.size;

    // mark the pellet as purged
    pellet2eat.purge = true;
  }

  getRektByVirus(virus) {
    // split into 6 equals halves
    // accelerate outwards
  }

  // checks if `this` cell can eat the other cell and acts accordingly
  can_eat_cell(preyCell) {
    var predicate = this.size * CONSUMPTION_CONST > preyCell.size;
    return predicate;
  }

  // actually eat the cell here
  do_eat_cell(preyCell) {
    // add the mass of the eaten cell to `this` mass
    // (eating a cell only consumes a portion of its size)
    this.size += 0.4 * preyCell.size;

    // mark the preyCell as purged
    preyCell.purge = true;
    if (preyCell.playerControlled == true) {
      if (DEBUG) {
        console.log("[!] player cell has been eaten :<");
      }

      GAME_OVER = true;
      return; // make speedy exit
    }
  }

  // handle cell splitting
  doMitosis() {
    // shrink cell mass in half
    // spawn new duplicate cell
    // change acceleration in the direction of the split
  }

  updatePos() {
    // order of precedence: acceleration, velocity, position
    this.xvel += this.xaccel;
    this.yvel += this.yaccel;
    this.xpos += this.xvel;
    this.ypos += this.yvel;

    // enforce screen boundaries
    if (this.xpos < 0) {
      this.xpos = 0;
      if(this.playerControlled == false){ this.purge = true; }
    }
    if (this.xpos > ARENA_X) {
      this.xpos = ARENA_X;
      if(this.playerControlled == false){ this.purge = true; }
    }
    if (this.ypos < 0) {
      this.ypos = 0;
      if(this.playerControlled == false){ this.purge = true; }
    }
    if (this.ypos > ARENA_Y) {
      this.ypos = ARENA_Y;
      if(this.playerControlled == false){ this.purge = true; }
    }

    // all cells have speed penalty
    var expnt = 0.70;
    var speed_factor = 10 / Math.pow(this.size, expnt);
    if(this.playerControlled){
      // set cell velocities according mouse coordinates
      // the larger the exponent, the more speed slows due to size
      this.xvel = speed_factor * (camera.mouseX - this.xpos);
      this.yvel = speed_factor * (camera.mouseY - this.ypos);
    } else {
      // adjust velocities according to size
      // NOTE: the underlying invariant velocities won't change
      this.xvel = speed_factor * this.ixvel;
      this.yvel = speed_factor * this.iyvel;
    }
  }

  drawSelf() {
    // size increase animation
    if (this.displaySize < this.size) {
      this.displaySize += 15;
    }
    // size cap
    if(this.size >= MAX_CELL_SIZE){
      this.size = MAX_CELL_SIZE;
    }

    // update position before doing any drawing
    this.updatePos();

    if (this.playerControlled == true) {
      // draw cell body
      strokeWeight(1);
      stroke(0);
      fill(this.fill);
      ellipse(this.xpos, this.ypos, this.displaySize);

      // white background for GOOGL logo
      fill(255);
      ellipse(this.xpos, this.ypos, this.displaySize * 0.8);

      imageMode(CENTER);
      image(
        this.avatar,
        this.xpos,
        this.ypos,
        this.displaySize * 0.7,
        this.displaySize * 0.7
      );
    } else {
      // pulsing hazardous red outline
      var flash = 15;
      this.stroke_fill[1] = (flash + this.stroke_fill[1]) % 255;
      this.stroke_fill[2] = (flash + this.stroke_fill[2]) % 255;
      strokeCap(ROUND);
      strokeWeight(20);
      stroke(this.stroke_fill);

      // draw cell body
      fill(this.fill);
      ellipse(this.xpos, this.ypos, this.displaySize);

      // enemy cell avatar
      imageMode(CENTER);
      image(
        this.avatar,
        this.xpos,
        this.ypos,
        this.displaySize * 0.6,
        this.displaySize * 0.6
      );
    }

    // heading line that shows direction
    if (DEBUG) {
      push();
      stroke("red");
      strokeWeight(13);
      line(
        this.xpos,
        this.ypos,
        this.xpos + 30 * this.xvel,
        this.ypos + 30 * this.yvel
      );
      pop();
    }
  }
}
