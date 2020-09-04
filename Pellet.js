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


// default size of all pellets
var PELLET_SZ = 30;

// max. number of pellets
// initialized in setup(), reinitialized in windowResized()
var PELLET_MAX;

// pellets spawn at random and are consumed by cells
class Pellet {
  constructor() {
    // this.spawn();

    // when `this` pellet is purged, this.spawn() will be called again
    this.purge = false;

    // we use gaussian dist here
    this.xpos = rng(ARENA_X, SAMPLE_SZ);
    this.ypos = rng(ARENA_Y, SAMPLE_SZ);
    this.size = PELLET_SZ;
    this.fill = [rng(255), rng(255), rng(255)];
  }

  spawn() {
    // if(DEBUG){
    //   console.log("[i] spawning pellet...");
    //   let err = new Error();
    //   console.log("stack: "+err.stack);
    // }

    // when `this` pellet is purged, this.spawn() will be called again
    this.purge = false;

    // we use gaussian dist here
    this.xpos = rng(ARENA_X, SAMPLE_SZ);
    this.ypos = rng(ARENA_Y, SAMPLE_SZ);
    this.size = PELLET_SZ;
    this.fill = [rng(255), rng(255), rng(255)];
  }

  drawSelf() {
    push();
    noStroke();
    fill(this.fill);
    ellipse(this.xpos, this.ypos, this.size);
    pop();
  }
}
