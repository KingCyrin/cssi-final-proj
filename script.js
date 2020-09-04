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
DEBUG = true;
  run the game in debug mode (WARNING: this will probably slow down the game)
  (will print logs and other valuable information related to the game's state)
DEBUG = false; 
  run the game in "production" mode
*/
var DEBUG = false;

// precision for floating point operations
// usage: if( (value1 - value2) < PRECISION ){ /* do stuff */ }
var PRECISION = 0.1;

// the sample size for the rng() function
// source: https://en.wikipedia.org/wiki/Central_limit_theorem
var SAMPLE_SZ = 2;

// keep all {pellets, cells, viruses} in a game object "pool"
var pool = [];

// JSON-style dictionary of all the game objects and their number
// key  : pool[i].constructor.name
// value: the number of `key` elements within the pool
var pool_count = {};

// copy-pasted from SO (https://stackoverflow.com/a/12710609), because I am a lazy^W resourceful programmer
// usage: arr.insert(idx, item)
/*
var arr = [ 'A', 'B', 'D', 'E' ];
arr.insert(2, 'C');
// => arr == [ 'A', 'B', 'C', 'D', 'E' ]
*/
Array.prototype.insert = function(index, item) {
  this.splice(index, 0, item);
};

// returns a random number that is less than or equal to `arg`
// the random numbers are generated according to a gaussian bell curve distribution
// (this is useful for generating pellets)
function rng(arg, samp_size) {
  var rando = 0;
  var n = samp_size || 1; // default sample size is one (uniform distribution)
  for (var i = 0; i < n; i++) {
    rando += arg * Math.random();
  }
  return rando / n;
}

function init_game_scene() {
  // scale up the map after drawing the canvas
  ARENA_X = screenX * ARENA_SCALE;
  ARENA_Y = screenY * ARENA_SCALE;

  // compute the max number of pellets
  PELLET_MAX = Math.floor(Math.sqrt(screenX * screenY));

  // add the initial number of elements to the game pool
  populate_pool();

  // add the player's cell to the pool
  spawn_player_cell();

  // default camera zoom
  CAMERA_ZOOM = 1;
  camera.zoom = CAMERA_ZOOM;
}

function spawn_one_pellet() {
  var p_pellet;
  p_pellet = new Pellet();
  pool.insert(0, p_pellet);
}

function spawn_one_virus() {
  var v_x = rng(ARENA_X);
  var v_y = rng(ARENA_Y);
  pool.push(new Virus(v_x, v_y));
}

function spawn_one_enemy_cell(is_replacement_cell = false) {
  var c_x, c_y, c_sz, idxx, c_avatar, c_playerControlled, c_cell;

  var lb = 5*PELLET_SZ; // lower bound
  var ub = 500; // upper bound
  c_sz = lb + rng(ub-lb);

  // pick a random avatar
  idxx = Math.floor(rng(999)) % AVATAR_ENEMY.length;
  c_avatar = AVATAR_ENEMY[idxx];
  c_playerControlled = false;

   // pick uniformly-random coordinates
  c_x = rng(ARENA_X);
  c_y = rng(ARENA_Y);

  c_cell = new Cell(c_x, c_y, c_sz, c_avatar, c_playerControlled);

  // handle spawning new enemy cells
 // (obviously such cells can't magically appear smack in the middle of the arena)
  if(is_replacement_cell){
    // decide what axis the cell appears from
    // (think about it, it's really clever)
    var which_edge = [0,1][ floor(random(1)+0.5) ]
    if(which_edge == 0){ // spawn at leftmost or rightmost
      // 0 or 1
      var max_min = floor(random(1)+0.5);
      c_x = [0,ARENA_X][ max_min ]; // fixed values here
      c_y = rng(ARENA_Y); // anything goes here

      // here the starting point decides invariant x-velocity direction
      // (don't care abt iyvel)
      var vel_sign = [1,-1];
      c_cell.ixvel = vel_sign[ max_min ] * Math.abs(c_cell.ixvel);
    } else if(which_edge == 1){ // spawn at topmost or leftmost
      // 0 or 1
      var max_min = floor(random(1)+0.5);
      c_x = rng(ARENA_X); // anything goes here
      c_y = [0,ARENA_Y][ max_min ]; // fixed values here

      // here the starting point decides invariant y-velocity direction
      // (don't care abt xyvel)
      var vel_sign = [1,-1];
      c_cell.iyvel = vel_sign[ max_min ] * Math.abs(c_cell.iyvel);
    }
  }
  c_cell.xpos = c_x;
  c_cell.ypos = c_y;

  pool.push(c_cell);
}

// add the initial objects to the game pool
function populate_pool() {
  // wipe the game pool
  pool = [];

  // spawn pellets
  for (var i = 0; i < PELLET_MAX; i++) {
    spawn_one_pellet();
  }

  // spawn viruses
  /*
  for(let i=0; i<VIRUS_MAX; i++){
    spawn_one_virus();
  }
  */

  // spawn enemy cells
  for (var i = 0; i < ENEMY_MAX; i++) {
    spawn_one_enemy_cell();
  }
}

// spawn the player's cell
function spawn_player_cell() {
  var p_x, p_y, p_sz, p_avatar, p_playerControlled, p_cell;

  // start at the center of the map
  p_x = ARENA_X / 2;
  p_y = ARENA_Y / 2;
  
  var lb = 7*PELLET_SZ;
  var ub = 500;
  p_sz = lb + rng(ub-lb);
  p_avatar = AVATAR_PLAYER;
  p_playerControlled = true;

  p_cell = new Cell(p_x, p_y, p_sz, p_avatar, p_playerControlled);
  pool.push(p_cell);

  // save this for later
  IDX_PLAYER_CELL = pool.length - 1;
}

// pool preprocessing loop
function preprocess_pool_objects() {
  // reset all object counts to 0 before processing
  pool_count["Pellet"] = 0;
  pool_count["Cell"] = 0;
  pool_count["Virus"] = 0;

  for (var k = 0; k < pool.length; k++) {
    // save this idx for later
    if (
      pool[k].constructor.name == "Cell" &&
      pool[k].playerControlled == true
    ) {
      IDX_PLAYER_CELL = k;
    }

    // count all object types (key: the name of the object's constructor)
    pool_count[pool[k].constructor.name] += 1;
  }

  // we traversed the entire pool and didn't find a playerControlled cell
  // set state variables accordingly
  if (IDX_PLAYER_CELL >= pool.length) {
    GAME_OVER = true;
  }
}

// must call this function after the call to preprocess_pool_objects()
function reposition_camera() {
  // pick the viewpoint that fits the whole cell on the page
  // (TODO: adjust this to get this to work with multiple cells)
  var zm =
    (0.5 * Math.min(screenX, screenY)) / pool[IDX_PLAYER_CELL].displaySize;
  CAMERA_ZOOM = Math.min(zm, 0.8);
  camera.zoom = CAMERA_ZOOM;

  if (DEBUG && mouseIsPressed) {
    camera.zoom = 0.1;
  }

  // while the game is active: align the camera with the player's cell
  if (GAME_OVER == false) {
    camera.position.x = pool[IDX_PLAYER_CELL].xpos;
    camera.position.y = pool[IDX_PLAYER_CELL].ypos;
  }
}

function process_pool_objects() {
  // main pool processing loop
  for (var i = 0; i < pool.length; i++) {
    // skip over objects that will be purged
    if (pool[i].purge == true) {
      continue;
    }

    for (var j = i + 1; j < pool.length; j++) {
      // skip over objects that will be purged
      if (pool[j].purge == true) {
        continue;
      }

      // Cells handle collisions (we ignore virus to virus OR virus to pellet interactions)
      if ( pool[i].constructor.name == "Cell" && pool[i].isCollidingWith(pool[j]) ) {
        pool[i].handleCollision(pool[j]);
      } else if ( pool[j].constructor.name == "Cell" && pool[j].isCollidingWith(pool[i]) ) {
        pool[j].handleCollision(pool[i]);
      }
    }

    // while paused: don't draw anything
    if (GAME_PAUSED == true) {
      continue;
    }
    pool[i].drawSelf();
  }
}

function process_purged_objects() {
  for (var i = pool.length - 1; i >= 0; i--) {
    if (pool[i].purge == true) {
      switch (pool[i].constructor.name) {
        case "Pellet":
          pool[i].spawn(); // respawn the pellet
          break;
        case "Cell":
          pool.splice(i,1); // remove the object from the pool
          break;
        case "Virus":
          break;
        default:
          console.log( "[???] object was sent to be purged: " + pool.constructor.name);
          break;
      } // end switch
    } // end if
  } // end for
}

function replenish_pellets() {
  if (pool_count["Pellet"] < PELLET_MAX) {
    let p_pellet;
    p_pellet = new Pellet();
    pool.insert(0, p_pellet); // insert @ idx 0: ensures pellets are drawn under other objects
  }
  if (pool_count["Cell"] < ENEMY_MAX) {
    // it's true that the cell we spawn here is a replacement
    spawn_one_enemy_cell(true);
  }
}

// currently not using this for debugging
function keyPressed() {
  switch (
    keyCode
    /*
    case KEY1:
      break;
    case KEY2:
      break;
    case KEY3:
      break;
    */
  ) {
  }
}

// called automatically when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // adjust the screen dimensions
  screenX = windowWidth;
  screenY = windowHeight;

  // scale up the map after drawing the canvas
  ARENA_X = screenX * ARENA_SCALE;
  ARENA_Y = screenY * ARENA_SCALE;

  // recompute the max number of pellets
  PELLET_MAX = Math.floor(Math.sqrt(screenX * screenY));
}

function setup() {
  // screen display settings
  bgColour = 240;
  screenX = windowWidth;
  screenY = windowHeight;
  createCanvas(screenX, screenY);

  // load all the avatars, and suchlike
  preload_game_assets();

  // initialize the game scene
  // can call this function outside of setup()
  init_game_scene();
}

function draw() {
  background(bgColour);

  // draw arena boundaries
  if (DEBUG) {
    push();
    stroke("red");
    strokeWeight(20);
    line(0, 0, 0, ARENA_X);
    line(ARENA_X, 0, ARENA_X, ARENA_Y);
    line(ARENA_X, ARENA_Y, 0, ARENA_Y);
    line(0, 0, ARENA_X, 0);
    pop();
  }

  // camera object already instantiated at this point
  // camera.zoom = CAMERA_ZOOM;
  // run code before the main pool processing loop
  preprocess_pool_objects();

  // adjust the camera's position and zoom
  // (camera doesn't move when the game ends)
  reposition_camera();

  // the main pool processing loop
  process_pool_objects();

  // this is technically POST processing, but meh
  preprocess_pool_objects()
  
  // remove purged objects from the game pool
  process_purged_objects();

  // replenish pellets
  replenish_pellets();

  /*
  turning the camera off: relative drawing components 
    - useful for drawing a HUD, minimap, etc
    - visual artifacts drawn relative to the camera's location
    - I think this makes cell movement smoother, but I haven't confirmed this
  leaving the camera on: absolute drawing components
    - will draw game objects in their real, in-game location
  */
  // camera.off();

  if (GAME_PAUSED == true) {
    display_menu_game_paused(); // [Graphics.js]
    return;
  }
  if (GAME_OVER == true) {
    // switch back to absolute positioning
    camera.off();

    // translucent gray overlay
    fill("rgba(125,125,125,0.5)");
    rect(0, 0, screenX, screenY);

    // - display game menu (while the game continues running in the BG)
    push();
    fill("red");
    textAlign(CENTER, BOTTOM);
    textSize(200);
    textStyle(BOLDITALIC);
    text("GAMEOVER!", screenX / 2, screenY / 2);

    textAlign(CENTER, TOP);
    textSize(90);
    textStyle(NORMAL);
    text("=== refresh the page to restart ===", screenX / 2, screenY / 2);
    pop();
  }
}
