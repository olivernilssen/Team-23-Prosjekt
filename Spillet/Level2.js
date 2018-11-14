import { score } from './Level1.js';
import { MenuLoad } from './Level1.js';
import { level1Started } from './Level1.js';
export let isGameWon = false;
// Sound effects
  var backgroundMusic = new Audio('music/backgroundMusic.mp3');
  var keySound = new Audio('music/keySound.mp3');
  var triggerSound = new Audio('music/triggerSound.mp3');
  var gameOverMusic = new Audio('music/gameOver.mp3');
  var winGameMusic = new Audio('music/finallyTogether.mp3');
  //Sound effects volume
  backgroundMusic.volume = 0.1;
  keySound.volume = 0.5;
  triggerSound.volume = 0.5;
  gameOverMusic.volume = 0.1;
  winGameMusic.volume = 0.1;

let isGameover = false;
let playerDead = false;


export let loadLevel2 = function() {
  if(level1Started)
  {
    return;
  }

  if(isGameover && !playerDead)
  {
    cantx.drawImage(gameWonImg, 0, 0, 600, 600);
    return;
  }
  else if(playerDead)
  {
    cantx.drawImage(gameOverImage, 0, 0, 600, 600);
    return;
  }

  let canvas = document.getElementById("ourMap");
  let cantx = canvas.getContext("2d");
  backgroundMusic.play();

  //letiabler for å sjekke om at bilder og elementer er lastet inn i scenen.
  let bakgrunnLastet = false;
  let bushLastet = false;
  let spillerLastet = false;
  let keysLastet = false;
  let steinerLastet = false;
  let arrowShooterLastet = false;
  let triggerLastet = false;

  let winCondition = false;
  let level2Started = false;

  //letiabler for gåfart, scoring og offsets.
  let speed = 10;
  let myTime = 0;
  let keyPickedUp = 0;
  let modifier = 10;
  let ObjectSizeWid = 30;
  let ObjectSizeHei = 30;
  let scoreLvl2 = score;

  let arrow_XR = 18;
  let arrow_XL = 1;
  let arrow_Y = 8;

  //Funksjon for hva elementet moveable object inneholder
  function aElement(x, y) {
    this.x = x;
    this.y = y;
    this.oldX = x;
    this.oldY = y;
    this.isTriggered = false;
    this.stoneIndex = 0;
  }

  function SoldierElement(x, y) {
    this.x = x;
    this.y = y;
    this.oldX = x;
    this.oldY = y;
    this.moveRight = false;
    this.spriteFrameON;
    this.spriteIndex;
  }

  //Liste med objekter som kan beveges
  let moveObjArray = [];
  //Liste med objekter som IKKE kan beveges
  let unMoveObjArray = [];
  //Liste med objekter som kan plukkes opp
  let keyitemArray = [];
  //Liste med objekter som kan steiner kan stå på
  let stoneTriggerArray = [];
  //Liste over hvor gaten er
  let gateObjArray = [];

  let arrowObjArray = [];
  let crossbowArray = [];
  let soldierArray = [];

  function makeArrays() {
    //Arrows
    arrowObjArray.push(new aElement(arrow_XR, arrow_Y));
    arrowObjArray.push(new aElement(arrow_XL, arrow_Y));

    //Crossbows
    crossbowArray.push(new aElement(18, 8));
    crossbowArray.push(new aElement(1, 8));

    //Objekter som har en slags "trigger"
    stoneTriggerArray.push(new aElement(9, 14));
    stoneTriggerArray.push(new aElement(10, 14));
    stoneTriggerArray.push(new aElement(10, 15));
    stoneTriggerArray.push(new aElement(5, 1));
    stoneTriggerArray.push(new aElement(9, 1));

    //Gate objekt som kommer på slutten
    gateObjArray.push(new aElement(10, 12));
    gateObjArray.push(new aElement(6, 0));
    gateObjArray.push(new aElement(7, 0));
    gateObjArray.push(new aElement(8, 0));

    //Nykkel objekter
    keyitemArray.push(new aElement(9, 8));
    keyitemArray.push(new aElement(11, 8));

    //Steiner som kan dyttes
    moveObjArray.push(new aElement(11, 14));
    moveObjArray.push(new aElement(10, 16));
    moveObjArray.push(new aElement(11, 16));

    moveObjArray.push(new aElement(4, 12));
    moveObjArray.push(new aElement(4, 13));
    moveObjArray.push(new aElement(4, 14));

    moveObjArray.push(new aElement(16, 13));
    moveObjArray.push(new aElement(16, 14));
    moveObjArray.push(new aElement(16, 15));

    soldierArray.push(new SoldierElement(1, 7, 1, 7, true, 0));
    soldierArray.push(new SoldierElement(18, 7, 18, 7, false, 80));


    //Hinders inside the map
    for (let x = 0; x <= 20; x++) {
      for (let y = 0; y <= 20; y++) {
        if (
          (x == 12 && (y > 11 && y < 15)) ||
          (x == 13 && (y > 13 && y < 19)) ||
          (x == 12 && y == 18) ||
          (x == 11 && y == 12) ||
          (x == 9 && y == 12) ||
          (x == 8 && (y > 11 && y < 15)) ||
          (x == 7 && (y > 13 && y < 18)) ||
          ((x > 7 && x < 11) && y == 17) ||
          (x == 10 && y == 18) ||
          ((x > 7 && x < 13) && y == 9) ||
          (x == 10 && (y > 6 && y < 9)) ||
          (x == 9 && y == 7) || (x == 11 && y == 7)
        ) {
          unMoveObjArray.push(new aElement(x, y));
        }
      }
    }

    //ramme rundt nivået
    for (let x = 0; x < ObjectSizeWid; x++) {
      for (let y = 0; y < ObjectSizeHei; y++) {
        if (((x > 0 && x < 6) && y == 0) ||
        ((x > 8 && x < 20) && y == 0) ||
        (x == 0 && y < 19) ||
        (x < 11 && y == 19) ||
        (x > 11 && y == 19) || (x == 19 && y < 20)) {
          unMoveObjArray.push(new aElement(x, y));
        }
      }
    }
  }

  //Put all the elements into the arrays when game is initialized
  makeArrays();

  //Initialize all the images into the different image objects for later use
  let gameOverImage = new Image();
  let gameWonImg = new Image();
  let terrainImage = new Image();
  let playerImage = new Image();
  let keyImage = new Image();
  let stoneImage = new Image();
  let bushImage = new Image();
  let triggerImage = new Image();
  let crossbowImageRight = new Image();
  let crossbowLeftImage = new Image();
  let arrowImageRight = new Image();
  let arrowImageLeft = new Image();
  let gateImage = new Image();
  let gateImg1 = new Image();
  let gateImgLeft = new Image();
  let gateImgRight = new Image();
  let enemeySprite = new Image();

  function loadAssetslvl2 () {
    gameOverImage.src = "Sprites/deadScreen.png";
    gameWonImg.src = "Sprites/endScreen.png";

    terrainImage.onload = function() {
      bakgrunnLastet = true;
      //console.log("bakgrunn lastet");
      assetsLoaded();
    };
    terrainImage.src = "Sprites/bakgrunngress.png";

    //Spiller bilde
    playerImage.onload = function() {
      spillerLastet = true;
      //console.log("spiller lastet");
      assetsLoaded();
    };
    playerImage.src = "Sprites/KongSverreFront.png";

    //PickupItem
    keyImage.onload = function() {
      keysLastet = true;
      //console.log("keys lastet");
      assetsLoaded();
    };
    keyImage.src = "Sprites/keyItem.gif";

    //Stein
    stoneImage.onload = function() {
      steinerLastet = true;
      // console.log("steiner lastet");
      assetsLoaded();
    };
    stoneImage.src = "Sprites/stone.png";

    //bush
    bushImage.onload = function() {
      bushLastet = true;
      // console.log("busker lastet");
      assetsLoaded();
    };
    bushImage.src = "Sprites/Busk4.png";

    //Trigger
    triggerImage.onload = function() {
      triggerLastet = true;
      // console.log("triggers lastet");
      assetsLoaded();
    };
    triggerImage.src = "Sprites/trigger.png";

    //Arrow Shooter
    crossbowImageRight.onload = function() {
      arrowShooterLastet = true;
      // console.log("skyter høyre lastet");
      assetsLoaded();
    };
    crossbowImageRight.src = "Sprites/crossbowRight.png";


    crossbowLeftImage.onload = function() {
      arrowShooterLastet = true;
      // console.log("skyter venstre lastet");
      assetsLoaded();
    };
    crossbowLeftImage.src = "Sprites/crossbowLeft.png";

    //Arrow
    arrowImageRight.src = "Sprites/NewArrowRight.png";
    arrowImageLeft.src = "Sprites/NewArrowLeft.png";

    //Gates
    gateImage.src = "Sprites/NewGate.png";
    gateImg1.src = "Sprites/NewGate.png";
    gateImgLeft.src = "Sprites/NewGateLeft.png";
    gateImgRight.src = "Sprites/NewGateRight.png";

    enemeySprite.onload = function() {
      // console.log("Enemy loaded");
    };
    enemeySprite.src = "Sprites/NewSoldier.png";
}

loadAssetslvl2();

  let timer = {
    seconds: 0,
    minutes: 0,
    clearTime: -1
  };

  let startTimer = function() {
    if (timer.seconds === 59) {
      timer.minutes++;
      timer.seconds = 0;
    } else {
      timer.seconds++;
    }

    // Ensure that single digit seconds are preceded with a 0
    let formattedSec = "0";
    if (timer.seconds < 10) {
      formattedSec += timer.seconds;
    } else {
      formattedSec = String(timer.seconds);
    }

    let time = String(timer.minutes) + ":" + formattedSec;
    $(".timer").text(time);
  };

  // Resets timer state and restarts timer
  function resetTimer() {
    clearInterval(timer.clearTime);
    timer.seconds = 0;
    timer.minutes = 0;
    $(".timer").text("0:00");

    timer.clearTime = setInterval(startTimer, 1000);
  }

  //Spiller objekt
  /**
   * Holds all the player's info like x and y axis position, his current direction (facing).
   * I have also incuded an object to hold the sprite position of each movement so i can call them
   * I also included the move function in order to move the player - all the functionality for the movement is in there
   */
  //Gjør letiabelen for spiller og hinder objektet globalt, slik at du kan hente det fra flere plasser i scriptet.
  let hold_player;

  let player = {
    x: 11,
    y: 19
  };

  player.move = function(direction) {
    if(isGameWon)
    {
      return;
    }

    hold_player = {
      x: player.x,
      y: player.y
    };


    //a function to keep the movable objects current position before it is potentially moved. The oldX and oldY values are used it the box collides
    // so as to stop then from moving forward, but rather keep the old position.
    for (let i = 0; i < moveObjArray.length; i++) {
      moveObjArray[i].oldX = moveObjArray[i].x;
      moveObjArray[i].oldY = moveObjArray[i].y;
    }

    /**
     * Decide here the direction of the user and do the neccessary changes on the directions
     */
    let movement = speed / modifier;

    switch (direction) {
      case "left":
        if (playerImage.getAttribute("src") == "Sprites/KongSverreLeft2.png") {
          playerImage.src = "Sprites/KongSverreLeft1.png";
          player.x -= movement;
        } else if (
          playerImage.getAttribute("src") == "Sprites/KongSverreLeft1.png"
        ) {
          playerImage.src = "Sprites/KongSverreLeft2.png";
          player.x -= movement;
        } else {
          playerImage.src = "Sprites/KongSverreLeft1.png";
          player.x -= movement;
        }

        break;
      case "right":
        if (playerImage.getAttribute("src") == "Sprites/KongSverreRight2.png") {
          playerImage.src = "Sprites/KongSverreRight1.png";
          player.x += movement;
        } else if (
          playerImage.getAttribute("src") == "Sprites/KongSverreRight1.png"
        ) {
          playerImage.src = "Sprites/KongSverreRight2.png";
          player.x += movement;
        } else {
          playerImage.src = "Sprites/KongSverreRight1.png";
          player.x += movement;
        }
        break;
      case "up":
        if (playerImage.getAttribute("src") == "Sprites/KongSverreBackWalking2.png")
        {
          playerImage.src = "Sprites/KongSverreBackWalking1.png";
          player.y -= movement;
        }
        else if (playerImage.getAttribute("src") == "Sprites/KongSverreBackWalking1.png")
        {
          playerImage.src = "Sprites/KongSverreBackWalking2.png";
          player.y -= movement;
        } else {
          playerImage.src = "Sprites/KongSverreBackWalking1.png";
          player.y -= movement;
        }
        break;
      case "down":
        if (playerImage.getAttribute("src") == "Sprites/KongSverreFrontWalking2.png")
        {
          playerImage.src = "Sprites/KongSverreFrontWalking1.png";
          player.y += movement;
        } else if (playerImage.getAttribute("src") == "Sprites/KongSverreFrontWalking1.png") {
          playerImage.src = "Sprites/KongSverreFrontWalking2.png";
          player.y += movement;
        } else {
          playerImage.src = "Sprites/KongSverreFrontWalking1.png";
          player.y += movement;
        }
        break;
    }

    /**
     * Moves the hinder if the player is going on the same spot that the hinder is on
     */
    for (let i = 0; i < moveObjArray.length; i++) {
      if (player.x == moveObjArray[i].x && player.y == moveObjArray[i].y) {
        // console.log("moving stone " + i +  " to: " + moveObjArray[i].x +  ", " +moveObjArray[i].y);
        moveHinder(moveObjArray[i].x, moveObjArray[i].y, i);
      }
    }

    /**
     * if there is a collision just fallback to the temp object i build before while not change back the direction so we can have a movement
     */
    if (check_collision(player.x, player.y)) {
      player.x = hold_player.x;
      player.y = hold_player.y;
    }

    if (player.x == 11 && player.y == 20) {
      player.x = hold_player.x;
      player.y = hold_player.y;
    }

    for (let i = 0; i < moveObjArray.length; i++) {
      if (check_collision(moveObjArray[i].x, moveObjArray[i].y) || check_collision_stones(moveObjArray[i].x, moveObjArray[i].y, i) || check_collision_keys(moveObjArray[i].x, moveObjArray[i].y)
      ) {
        moveObjArray[i].x = moveObjArray[i].oldX;
        moveObjArray[i].y = moveObjArray[i].oldY;
        player.x = hold_player.x;
        player.y = hold_player.y;

      } else if (moveObjArray[i].x < soldierArray[0].x + 0.5 && moveObjArray[i].x > soldierArray[0].x - 0.5 && moveObjArray[i].y == soldierArray[0].y) {
        moveObjArray[i].x = moveObjArray[i].oldX;
        moveObjArray[i].y = moveObjArray[i].oldY;

      } else if (moveObjArray[i].x < soldierArray[1].x + 0.5 && moveObjArray[i].x > soldierArray[1].x - 0.5 && moveObjArray[i].y == soldierArray[1].y) {
        moveObjArray[i].x = moveObjArray[i].oldX;
        moveObjArray[i].y = moveObjArray[i].oldY;

        if (check_collision_stones(player.x, player.y)) {
          player.x = hold_player.x;
          player.y = hold_player.y;
        }
      }
    }

    /**
     * If player finds the coordinates of keyitem
     */
    for (let i = 0; i < keyitemArray.length; i++) {
      if (player.x == keyitemArray[i].x && player.y == keyitemArray[i].y) {
        // console.log("found a key!");
        keyPickedUp++;
        keySound.play();
        //Midlertidig, fjernes fra canvaset
        keyitemArray[i].x = i;
        keyitemArray[i].y = 19;
      }
    }
    // console.log("x: " + player.x + " y: " + player.y);
  };

  let spriteDraw = 4;
  let spriteDrawFrame = 0;
  let arrowDraw = 0;
  let arrowDrawFrame = 0;
  let waitArrow = 0;

  /**
   * Handle all the updatelvl2s of the canvas and creates the objects
   * @function
   * @name updatelvl2
   */
  function updatelvl2() {
    if (isGameover && winCondition && !playerDead) {
      winGameMusic.play();
      backgroundMusic.pause();
      cantx.drawImage(gameWonImg, 0, 0, 600, 600);
      return;
    }
    else if (playerDead)
    {
      cantx.drawImage(gameOverImage, 0, 0, 600, 600);
      backgroundMusic.pause();
      gameOverMusic.play();
      return;
    }

    if(isonMenu)
    {
      return;
    }
    else if(!isGameover && !playerDead && !isGameWon && !level1Started) {

      cantx.drawImage(terrainImage, 0, 0); //draw background

      if(firstTriggers != 3){
          cantx.drawImage(gateImage, gateObjArray[0].x * ObjectSizeWid, gateObjArray[0].y * ObjectSizeHei, ObjectSizeHei, ObjectSizeWid)
        }

      for(let i = 0; i < gateObjArray.length; i++)
      {
        if(!winCondition){
          cantx.drawImage(gateImg1, gateObjArray[2].x * ObjectSizeWid, gateObjArray[2].y * ObjectSizeHei, ObjectSizeWid, ObjectSizeHei);
          cantx.drawImage(gateImgRight, gateObjArray[1].x * ObjectSizeWid, gateObjArray[1].y * ObjectSizeHei, ObjectSizeWid, ObjectSizeHei);
          cantx.drawImage(gateImgLeft, gateObjArray[3].x * ObjectSizeWid, gateObjArray[3].y * ObjectSizeHei, ObjectSizeWid, ObjectSizeHei);
        }
        else {
          cantx.drawImage(gateImgRight, gateObjArray[1].x * ObjectSizeWid, gateObjArray[1].y * ObjectSizeHei, ObjectSizeWid, ObjectSizeHei);
          cantx.drawImage(gateImgLeft, gateObjArray[3].x * ObjectSizeWid, gateObjArray[3].y * ObjectSizeHei, ObjectSizeWid, ObjectSizeHei);
        }
      }



      //draw triggers for stones and the arrowshooters
      for (let i = 0; i < stoneTriggerArray.length; i++) {
        cantx.drawImage(triggerImage, stoneTriggerArray[i].x * ObjectSizeWid, stoneTriggerArray[i].y * ObjectSizeHei, ObjectSizeWid, ObjectSizeHei);
      }

      cantx.drawImage(crossbowImageRight, crossbowArray[0].x * ObjectSizeWid, crossbowArray[0].y * ObjectSizeHei, ObjectSizeWid, ObjectSizeHei);
      cantx.drawImage(crossbowLeftImage, crossbowArray[1].x * ObjectSizeWid, crossbowArray[1].y * ObjectSizeHei, ObjectSizeWid,ObjectSizeHei);

      //Draw unmovable objects
      for (let i = 0; i < unMoveObjArray.length; i++) {
        cantx.drawImage(bushImage, unMoveObjArray[i].x * ObjectSizeWid, unMoveObjArray[i].y * ObjectSizeHei,ObjectSizeWid, ObjectSizeHei);
        if (i < moveObjArray.length) {
          cantx.drawImage(stoneImage, moveObjArray[i].x * ObjectSizeWid, moveObjArray[i].y * ObjectSizeHei, ObjectSizeWid, ObjectSizeHei);
        }
      }

      for(let i = 0; i < keyitemArray.length; i++)
      {
        cantx.drawImage(keyImage, keyitemArray[i].x * ObjectSizeWid, keyitemArray[i].y * ObjectSizeHei, ObjectSizeWid, ObjectSizeHei);
      }

      //Draw player
      cantx.drawImage(playerImage, player.x * ObjectSizeWid, player.y * ObjectSizeHei, ObjectSizeWid, ObjectSizeHei);

      //hvis triggerpadene er dekket og 3 "nøkler" er plukket opp, åpne gate
      if (check_Trigger() && keyPickedUp == 2) {
        winCondition = true;
      } else {
        winCondition = false;
      }

      //Get new values for the aimation position and frames depending on how many
      // frames has passed since last time it played etc
      if (spriteDrawFrame == 5) {
        spriteDrawFrame = 0;
      }

      if (arrowDrawFrame == 2) {
        arrowDrawFrame = 0;
      }

      if (spriteDrawFrame == spriteDraw) {
        sprite(0);
        sprite(1)
      }

      if (arrowDrawFrame == arrowDraw) {
        if (leftArrowCol && rightArrowCol) {
          waitArrow++;

          if (waitArrow == 10) {
            waitArrow = 0;
            leftArrowCol = false;
            rightArrowCol = false;
            arrow_XR = 18;
            arrow_XL = 1;
            shoot();
          }
        } else {
          shoot();
        }
      }

      spriteDrawFrame ++;
      arrowDrawFrame++;

      //Draw the animations
      if (!rightArrowCol) {
        cantx.drawImage(arrowImageRight, arrow_XR * ObjectSizeWid, arrow_Y * ObjectSizeHei, ObjectSizeWid, ObjectSizeHei);
      }

      if (!leftArrowCol) {
        cantx.drawImage(arrowImageLeft, arrow_XL * ObjectSizeWid, arrow_Y * ObjectSizeHei, ObjectSizeWid, ObjectSizeHei);
      }

      cantx.drawImage(enemeySprite, soldierArray[0].spriteFrameON, 0, 40, 40, soldierArray[0].x * ObjectSizeHei, soldierArray[0].y * ObjectSizeHei, ObjectSizeHei, ObjectSizeWid);
      cantx.drawImage(enemeySprite, soldierArray[1].spriteFrameON, 0, 40, 40, soldierArray[1].x * ObjectSizeHei, soldierArray[1].y * ObjectSizeHei, ObjectSizeHei, ObjectSizeWid);

      requestAnimationFrame(updatelvl2);
      //enemyX * ObjectSizeHei, enemyY * ObjectSizeHei
    }
  }

  /**
   * Our function that decides if there is a collision on the objects or not
   * @function
   * @name check_collision
   * @param {Integer} x - The x axis
   * @param {Integer} y - The y axis
   */

  //Sjekker kollisjonen på, kanten av mappen, busker og steiner med andre steiner
  function check_collision(x, y) {
    let foundCollision = false;

    x = Math.floor(x);
    y = Math.floor(y);

    //Check collision for bushes
    for (let i = 0; i < unMoveObjArray.length; i++) {
      if ((x == unMoveObjArray[i].x && y == unMoveObjArray[i].y) || (x == 1 && y == 9) ||(x == 18 && y == 9)) {
        //console.log("There is something there");
        foundCollision = true;
      }
    }
    if (winCondition) {
          for (let i = 1; i < gateObjArray.length; i++) {
            if (x == gateObjArray[i].x && y == gateObjArray[i].y) {
              gameOver();
              return foundCollision = false;
            }
          }
        }
      if (firstTriggers == 3){
        for (let i = 1; i < gateObjArray.length; i++) {
          if (x == gateObjArray[i].x && y == gateObjArray[i].y) {
            return foundCollision = true;
          }
        }
      }
      else {
        for (let i = 0; i < gateObjArray.length; i++) {
          if (x == gateObjArray[i].x && y == gateObjArray[i].y) {
            return foundCollision = true;
          }
         }
        }
    return foundCollision;
  }

  function check_collision_keys (x, y){
    let foundCollision = false;

    for (let i = 0; i < keyitemArray.length; i++) {
      if (x == keyitemArray[i].x && y == keyitemArray[i].y) {
        //console.log('key');
        return (foundCollision = true);
      }
    }

    return foundCollision = false;
  }
  /**
   * Checks if the stones has hit a wall or something else.
   * It does not check for itself in the array, but skips it as a continue.
   * @param {Integer} x - The x axis
   * @param {Integer} y - The y axis
   * @param {Integer} j - the index of the stone that is itself
   * @function
   * @name check_collision_stones
   * */
  function check_collision_stones(x, y, j) {
    let foundCollision = false;

    x = Math.floor(x);
    y = Math.floor(y);

    for (let i = 0; i < moveObjArray.length; i++) {
      if (x == moveObjArray[i].x && y == moveObjArray[i].y) {
        if (i == j) {
          continue;
        } else return foundCollision = true;
      }
    }

    return foundCollision;
  }

  /**
   * Checks if the arrows have hit the player
   * and returns true if they have.
   * But first turns the value into a whole number, as the player doesnt use decimal numbers when moving
   * @param {Integer} x - The x axis
   * @param {Integer} y - The y axis
   * @function
   * @name check_col_player
   * */
  function check_col_player(x, y) {
    let foundCollision = false;
    let newX = Math.floor(x);
    //let newXL = Math.floor(arrow_XL);

    if ((newX == player.x && y == player.y) || (newX == player.x && y == player.y)) {
      foundCollision = true;
      //console.log("Arrows hit player");
    }
    return foundCollision;
  }


  function isTriggeredTrue (el, index, arr){
    if(el.isTriggered == true)
    {
      return true;
    }
    else if (el.isTriggered == false)
    {
      return false;
    }
  }

  let firstTriggers = 0;
  /**
   * Checks if the boxes/stones are on top of the trigger boxes
   * and then returns a value of true for allTriggers
   * @function
   * @name check_Trigger
   * */
  function check_Trigger() {
    let allTriggers = false;


    if(!stoneTriggerArray.every(isTriggeredTrue)){
      for (let i = 0; i < moveObjArray.length; i++) {
        for(let j = 0; j < stoneTriggerArray.length; j++){
          if (
            moveObjArray[i].x == stoneTriggerArray[j].x &&
            moveObjArray[i].y == stoneTriggerArray[j].y &&
            !stoneTriggerArray[j].isTriggered
          ) {
            stoneTriggerArray[j].isTriggered = true;
            stoneTriggerArray[j].stoneIndex = i;
            triggerSound.play();
            break;
          }
        }
      }
    }

    if (stoneTriggerArray[0].isTriggered == true && stoneTriggerArray[1].isTriggered == true && stoneTriggerArray[2].isTriggered == true){
      firstTriggers = 3;
    }

    if(firstTriggers == 3){
      for(let i = 0; i < 3; i++){
      if(stoneTriggerArray[i].x != moveObjArray[stoneTriggerArray[i].stoneIndex].x){
          stoneTriggerArray[i].isTriggered = false;
          firstTriggers = 0;
          break;
        }
      }
    }


    if (stoneTriggerArray.every(isTriggeredTrue)) {
      for(let i = 0; i < stoneTriggerArray.length; i++)
      {
        if(stoneTriggerArray[i].x != moveObjArray[stoneTriggerArray[i].stoneIndex].x)
        {
          stoneTriggerArray[i].isTriggered = false;
          return allTriggers = false;
        }
      }
      return allTriggers = true;
    }

    return allTriggers;
  }

  /**
   * Funksjon for å flytte på hinderet, alt etter hvor spilleren let plassert FØR dem begynte kom vedsiden av elementet
   * @function
   * @name shoot
   * */
  function moveHinder(x, y, i) {
    if (hold_player.x > x && hold_player.y == y) {
      //left
      moveObjArray[i].x -= speed / modifier;
    } else if (hold_player.x < x && hold_player.y == y) {
      //right
      moveObjArray[i].x += speed / modifier;
    } else if (hold_player.x == x && hold_player.y < y) {
      //up
      moveObjArray[i].y += speed / modifier;
    } else if (hold_player.x == x && hold_player.y > y) {
      //down
      moveObjArray[i].y -= speed / modifier;
    }
  }


  /**
   * Decide here if all the assets are ready to start updating
   * @function
   * @name assetsLoaded
   */
  function assetsLoaded() {
    if (
      bakgrunnLastet && keysLastet && spillerLastet &&
      bushLastet && arrowShooterLastet && triggerLastet &&
      steinerLastet && !level2Started && !isGameover && !isGameWon)
      {
        resetTimer();
        startTimer();
        level2Started = true;
        requestAnimationFrame(updatelvl2);
      }
  }

  let enemySpeed = 0.2;
  /**
   * Decide here if all the assets are ready to start updating
   * @function
   * @param {Integer} = i - The index of which soldier element in the array we are changing the values of
   * @name assetsLoaded
   */
  function sprite(i) {

    if (isGameover) {
      return;
    }

    if (check_col_player(soldierArray[i].x + 0.5, soldierArray[i].y)) {
      //if there is a collision with the player, gameOver() is called
      playerDead = true;
      gameOver();
      return;
    }

    //Change the direction in which the soldier is walking towards if it collides with anything
      if ((check_collision_stones(soldierArray[i].x - 0.2, soldierArray[i].y) ||
        (check_collision(soldierArray[i].x, soldierArray[i].y)) && !soldierArray[i].moveRight) ||
        soldierArray[i].x <= 1 ||
        (check_collision(soldierArray[i].x - 0.2, soldierArray[i].y))) {

          soldierArray[i].moveRight = true;

      } else if (
        (check_collision_stones(soldierArray[i].x + 1, soldierArray[i].y) ||
        (check_collision(soldierArray[i].x + 1, soldierArray[i].y)) && soldierArray[i].moveRight) ||
        soldierArray[i].x >= 18) {

          soldierArray[i].moveRight = false;
      }

      if (!soldierArray[i].moveRight) {

        soldierArray[i].x -= enemySpeed;

        if(soldierArray[i].spriteFrameON == 0 && soldierArray[i].spriteIndex == 1)
        {
          soldierArray[i].spriteFrameON = 0;
          soldierArray[i].spriteIndex++;
        }
        else if (soldierArray[i].spriteFrameON == 0){
          soldierArray[i].spriteFrameON = 40;
          soldierArray[i].spriteIndex = 0;
          soldierArray[i].spriteIndex++;
        }
        else {
          soldierArray[i].spriteFrameON = 0;
          soldierArray[i].spriteIndex++;
        }

      } else if (soldierArray[i].moveRight) {

        soldierArray[i].x += enemySpeed;

        if(soldierArray[i].spriteFrameON == 80 && soldierArray[i].spriteIndex == 1)
        {
          soldierArray[i].spriteFrameON = 80;
          soldierArray[i].spriteIndex++;
        }

        else if (soldierArray[i].spriteFrameON == 80){
          soldierArray[i].spriteFrameON = 120;
          soldierArray[i].spriteIndex = 0;
          soldierArray[i].spriteIndex++;
        }
        else {
          soldierArray[i].spriteFrameON = 80;
          soldierArray[i].spriteIndex++;
        }
      }
  }

  //To check collision of arrows
  let leftArrowCol = false;
  let rightArrowCol = false;

  /**
   * Function for when the arrows are beeing shot
   * it updatelvl2s each time there it moved the x amount
   * @function
   * @name shoot
   */
  function shoot() {
    if (isGameover) {
      return;
    }

    arrow_XR -= cantx.canvas.height / (cantx.canvas.height*2);
    arrow_XL += cantx.canvas.height / (cantx.canvas.height*2);

    if (check_col_player(arrow_XR, arrow_Y) ||check_col_player(arrow_XL, arrow_Y)) {
      //if there is a collision with the player, gameOver() is called
      playerDead = true;
      gameOver();
      return;
    }

    if (check_collision(arrow_XL + 1, arrow_Y) || check_collision_stones(arrow_XL, arrow_Y)) {
      //if the arrow on the Left hits the wall, make leftArrowCol = true, as there is less room on the left side, compared to right side.
      arrow_XL = 1;
      leftArrowCol = true;
    }

    if (check_collision(arrow_XR, arrow_Y) || check_collision_stones(arrow_XR, arrow_Y)) {
      rightArrowCol = true;
      arrow_XR = 18;
    }
  }

  //SCORING SYSTEM
  function scoreCalc() {
    let points = 1000 / 60;
    let pointsTime = myTime * points;
    let newscore = (1000 - pointsTime);
    scoreLvl2 = scoreLvl2 + newscore;
    scoreLvl2 = Math.floor(scoreLvl2);
  }

  /**
   * Game over function (NOT WORKING PROPERLY YET.)
   * @todo Do something with canvas when player dies.
   */

  function gameOver() {
    isGameover = true;

    if (winCondition && !playerDead) {
      myTime = timer.seconds;
      clearInterval(timer.clearTime);
      scoreCalc();
      let myScore = "Your score: " + String(scoreLvl2);
      $(".myScore").text(myScore);
      cancelAnimationFrame(updatelvl2);
      isGameWon = true;
      isGameover = true;
      cantx.drawImage(gameWonImg, 0, 0, 600, 600);
    } else if(playerDead){
      isGameover = true;
      clearInterval(timer.clearTime);
      cantx.drawImage(gameOverImage, 0, 0, 600, 600);
    }
  }

  /**
   * Assign of the arrow keys to call the player move
   */
  $(document).keydown(function(e) {
    e = e || window.event;

    if (isGameover) {
      //stop keys from working :)
    } else if ((e.keyCode == "37" || e.keyCode == "65") && !level1Started) player.move("left");
    else if ((e.keyCode == "38" || e.keyCode == "87" ) && !level1Started) player.move("up");
    else if ((e.keyCode == "39" || e.keyCode == "68" ) && !level1Started) player.move("right");
    else if ((e.keyCode == "40" || e.keyCode == "83") && !level1Started) player.move("down");
  });

  //Resets the positions of all objects in the game, if you have not met the wincondition requirments
  $("#reset").click(function() {
    if (winCondition) {
    } else {
      player.x = 11;
      player.y = 19;
      arrowObjArray.length = 0;
      moveObjArray.length = 0;
      unMoveObjArray.length = 0;
      keyitemArray.length = 0;
      crossbowArray.length = 0;
      stoneTriggerArray.length = 0;
      gateObjArray.length = 0;
      keyPickedUp = 0;
      isGameover = false;
      makeArrays();
      cancelAnimationFrame(updatelvl2);
      assetsLoaded();
    }
  });

  let isonMenu = false;

  //Draws the menu and stops the animations of level2
  $("#Menu").click(function() {
      isGameover = false;
      isonMenu = true;
      cancelAnimationFrame(updatelvl2);
      cancelAnimationFrame(loadLevel2);
      clearTimeout(loadLevel2);
      resetTimer();
      clearInterval(timer.clearTime);
      MenuLoad.isOnMenu = true;
      MenuLoad.startClicked = false;
      isGameWon = false;
      winCondition = false;
      MenuLoad();
  });
};
