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


// default size of all viruses
let VIRUS_SZ = 256;

// max number of all viruses (viruses don't die so -- meh)
let VIRUS_MAX = 16;

// Viruses force cells to split
class Virus {
  constructor(x, y) {
    // this type of object cannot be purged
    this.purge = false;

    this.xpos = x;
    this.ypos = y;
    this.size = VIRUS_SZ;

    // viruses are black w/ red stroke -- easiest colours to quickly identity
    this.fill = [0, 0, 0];
    this.stroke = "red";
  }
  drawSelf() {
    push();
    stroke("red");
    strokeWeight();

    fill(this.fill);
    ellipse(this.xpos, this.ypos, this.size);
    pop();
  }
}
