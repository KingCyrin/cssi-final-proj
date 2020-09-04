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
It's dangerous to go alone! Take this:
recommended by Googlers
  - multiplayer w/ node.js, & html5
    - https://glitch.com/edit/#!/multiplayer-game?path=README.md%3A1%3A0
    - http://buildnewgames.com/real-time-multiplayer/
  - [...]

mouse move events JS
  - https://stackoverflow.com/questions/7790725/javascript-track-mouse-position
  - https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event
  - https://javascript.info/mouse-events-basics

multiplayer game
  - https://codeburst.io/how-to-make-a-simple-multiplayer-online-car-game-with-javascript-89d47908f995
    - https://github.com/gdomaradzki/simple-car-game
  - https://hackernoon.com/how-to-build-a-multiplayer-browser-game-4a793818c29b
  - https://itnext.io/how-to-build-a-realtime-multiplayer-game-in-javascript-using-pubnub-5f410fd62f33

Send data w/ WebSockets?
  - https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
  - example: https://github.com/gdomaradzki/simple-car-game

https://github.com/facebook/create-react-app
*/
