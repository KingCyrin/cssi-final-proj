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

// the colour of the arena's background
var bgColour;

// screen dimensions
// the actual arena is ARENA_SCALE times bigger than the region shown on screen
// ARENA_X = screenX * ARENA_SCALE
// ARENA_Y = screenY * ARENA_SCALE
// zoom based on screen dimensions
var screenX, screenY;
var ARENA_SCALE = 11;
var ARENA_X, ARENA_Y;
var CAMERA_ZOOM;

// game state variables
var GAME_OVER = false;
var GAME_PAUSED = false;

// game asset variables
var AVATAR_PLAYER; // the player's avatar (p5.Image)
var AVATAR_ENEMY = []; // p5.Image array of enemy avatars

function preload_game_assets() {
  // GOOGL logo
  AVATAR_PLAYER = loadImage(
    "https://cdn.glitch.com/c93f04db-9a24-45aa-81d5-d66753733ed5%2Fcssi_GOOGL.png?v=1594431839728",
    nothin => {},
    avatar_load_fail
  );
  // bill gates
  AVATAR_ENEMY.push(
    loadImage(
      "https://cdn.glitch.com/c93f04db-9a24-45aa-81d5-d66753733ed5%2Fcssi_gates_smug.jpg?v=1594356302307",
      nothin => {},
      avatar_load_fail
    )
  );
  // jeve sobs
  AVATAR_ENEMY.push(
    loadImage(
      "https://cdn.glitch.com/c93f04db-9a24-45aa-81d5-d66753733ed5%2Fcssi_jobs.jpg?v=1594485572826",
      nothin => {},
      avatar_load_fail
    )
  );
  // rageface
  AVATAR_ENEMY.push(
    loadImage(
      "https://cdn.glitch.com/c93f04db-9a24-45aa-81d5-d66753733ed5%2Fcssi_rageface.png?v=1594356307696",
      nothin => {},
      avatar_load_fail
    )
  );
  // trollface
  AVATAR_ENEMY.push(
    loadImage(
      "https://cdn.glitch.com/c93f04db-9a24-45aa-81d5-d66753733ed5%2Fcssi_troll.png?v=1594356308157",
      nothin => {},
      avatar_load_fail
    )
  );
  // the zucc
  AVATAR_ENEMY.push(
    loadImage(
      "https://cdn.glitch.com/80245001-4165-4629-84ce-e9862d31afef%2Fthe_zucc.png?v=1595953648058",
      nothin => {},
      avatar_load_fail
    )
  );
  // beff jezos
  AVATAR_ENEMY.push(
    loadImage(
      "https://cdn.glitch.com/f12fff90-c2b9-4069-91b3-521c39f2bc21%2Fsub-buzz-1766-1566412863-1.jpg?v=1595950002182",
      nothin => {},
      avatar_load_fail
    )
  );
}

function avatar_load_fail(err) {
  console.log("[!] failed to load avatar");
  console.log(err);
}

function display_menu_game_paused() {
  console.log("[i] entering GAME PAUSED menu");
  noLoop();
}

function object_is_off_screen(game_obj){
  if(game_obj.xpos > ARENA_X){
    return true;
  }
  if(game_obj.xpos < 0){
    return true;
  }
  if(game_obj.ypos > ARENA_Y){
    return true;
  }
  if(game_obj.ypos < 0){
    return true;
  }
  return false;
}


