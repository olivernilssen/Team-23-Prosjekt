import { Level2 } from './map.js';

//MenuLoad ();
window.onload = function() {
  MenuLoad();
};

function MenuLoad() {
  let canvas = document.getElementById("ourMap");
  let cantx = canvas.getContext("2d");

  //letiabler for å definere spillervinduet vårt, altså en canvas i 2D
  if ($(window).width() < 1367) {
    cantx.canvas.height = 400;
    cantx.canvas.width = 400;
  }
  if ($(window).width() < 321) {
    cantx.canvas.height = 250;
    cantx.canvas.width = 250;
  }

  let background;
  let startButton;

  let backgroundLoaded = false;
  let startButtonLoaded = false;
  let startClicked = false;
  let gameStarted = false;

  let startButtonHeight = cantx.canvas.width / 6;
  let startButtonWidth = cantx.canvas.width / 2;

  let STB_x = cantx.canvas.width / 2 - startButtonWidth / 2;
  let STB_y = cantx.canvas.height / 2 - startButtonHeight / 2;

  loadAssets();

  function loadAssets() {
    background = new Image();
    background.onload = function() {
      backgroundLoaded = true;
      isAssetsLoaded();
    };
    background.src = "Sprites/bakgrunngress.png";

    startButton = new Image();
    startButton.onload = function() {
      startButtonLoaded = true;
      isAssetsLoaded();
    };
    startButton.src = "Sprites/startButton.png";
  }

  if (gameStarted) {
  } else {
    $(window).mousemove(function(event) {
      if (
        event.clientX > STB_x &&
        event.clientX < STB_x + startButtonWidth &&
        (event.clientY > STB_y && event.clientY < STB_y + startButtonHeight) &&
        !gameStarted
      ) {
        console.log("Over button");
        startButton.src = "Sprites/startButtonHover.png";
        startClicked = true;
      } else {
        startButton.src = "Sprites/startButton.png";
        startClicked = false;
      }
    });

    $("#ourMap").click(function() {
      console.log("clicked on canvas");
      if (startClicked == true) {
        myGame();
        gameStarted = true;
        $(window).unbind("mousemove");
        $("#ourMap").unbind("click");
      }
    });
  }

  function startMenuupdate() {
    cantx.drawImage(background, 0, 0);
    cantx.drawImage(
      startButton,
      STB_x,
      STB_y,
      startButtonWidth,
      startButtonHeight
    );
  }

  function isAssetsLoaded() {
    if (backgroundLoaded == true && startButtonLoaded == true) {
      startMenuupdate();
    }
  }
}

let myGame = function() {
  let canvas = document.getElementById("ourMap");
  let cantx = canvas.getContext("2d");

  //letiabler for å definere spillervinduet vårt, altså en canvas i 2D
  if ($(window).width() < 1367) {
    cantx.canvas.height = 400;
    cantx.canvas.width = 400;
  }
  if ($(window).width() < 321) {
    cantx.canvas.height = 250;
    cantx.canvas.width = 250;
  }

  let wid = canvas.offsetWidth;
  let hig = canvas.offsetHeight;

  //letiabler for å sjekke om at bilder og elementer er lastet inn i scenen.
  let bakgrunnLastet = false;
  let bushLastet = false;
  let spillerLastet = false;
  let keysLastet = false;
  let steinerLastet = false;
  //let arrowLastet2 = false;
  //let arrowLastet1 = false;
  let arrowShooterLastet = false;
  let triggerLastet = false;

  let winCondition = false;
  let level1Started = false;

  //letiabler for gåfart, scoring og offsets.
  let speed = 10;
  let myTime = 0;
  let score = 0;
  let keyPickedUp = 0;
  let modifier = 10;
  let ObjectSizeWid = wid / 20;
  let ObjectSizeHei = hig / 20;

  let arrow_XR = 18;
  let arrow_XL = 1;
  let arrow_Y = 9;

  //Funksjon for hva elementet moveable object inneholder
  function mittElement(x, y) {
    this.x = x;
    this.y = y;
    this.oldX = x;
    this.oldY = y;
  }

  //Liste med objekter som kan beveges
  let moveObjArray = [];
  //Liste med objekter som IKKE kan beveges
  let unMoveObjArray = [];
  //Liste med objekter som kan plukkes opp
  let nykkelObjArray = [];
  //Liste med objekter som kan steiner kan stå på
  let triggerObjArray = [];
  //Liste over hvor gaten er
  let gateObjArray = [];

  let arrowObjArray = [];
  let shooterObjArray = [];

  function makeArrays() {
    //Arrows
    arrowObjArray.push(new mittElement(arrow_XR, arrow_Y));
    arrowObjArray.push(new mittElement(arrow_XL, arrow_Y));
    //Arrows
    shooterObjArray.push(new mittElement(18, 9));
    shooterObjArray.push(new mittElement(1, 9));

    //Objekter som har en slags "trigger"
    triggerObjArray.push(new mittElement(2, 2));
    triggerObjArray.push(new mittElement(17, 2));

    //Gate objekt som kommer på slutten
    gateObjArray.push(new mittElement(8, 0));
    gateObjArray.push(new mittElement(9, 0));
    gateObjArray.push(new mittElement(10, 0));

    //Nykkel objekter
    nykkelObjArray.push(new mittElement(8, 7));
    nykkelObjArray.push(new mittElement(9, 7));
    nykkelObjArray.push(new mittElement(10, 7));

    //Steiner som kan dyttes
    moveObjArray.push(new mittElement(10, 11));
    moveObjArray.push(new mittElement(10, 9));
    moveObjArray.push(new mittElement(9, 10));
    moveObjArray.push(new mittElement(8, 11));
    moveObjArray.push(new mittElement(8, 9));

    //barrikaden hoyre, topp og venstre side
    for (let i = 0; i <= 11; i++) {
      for (let j = 0; j <= 11; j++) {
        if (
          (i == 11 && (j <= 11 && j >= 6)) ||
          (i <= 10 && i >= 7 && j == 6) ||
          (i == 7 && (j <= 11 && j > 6))
        ) {
          unMoveObjArray.push(new mittElement(i, j));
        }
      }
    }

    //ramme rundt nivået
    for (let x = 0; x < ObjectSizeWid; x++) {
      for (let y = 0; y < ObjectSizeHei; y++) {
        if (x == 0 || y == 0 || (x < 20 && y == 19) || (x == 19 && y < 20)) {
          unMoveObjArray.push(new mittElement(x, y));
        }
      }
    }
  }

  //Sett alle elementer inn i Array
  makeArrays();

  //Laste alle bilder og elementer inn og definer dem
  //Terraine bilde / Bakgrunns bilde

  let gameOverImage = new Image();
  gameOverImage.src = "Sprites/gameover.png";

  let terrainImage = new Image();
  terrainImage.onload = function() {
    bakgrunnLastet = true;
    console.log("bakgrunn lastet");
    assetsLoaded();
  };
  terrainImage.src = "Sprites/bakgrunngress.png";

  //Spiller bilde
  let playerImage = new Image();
  playerImage.onload = function() {
    spillerLastet = true;
    console.log("spiller lastet");
    assetsLoaded();
  };
  playerImage.src = "Sprites/KongSverreFront.png";

  //PickupItem
  let keyImage = new Image();
  keyImage.onload = function() {
    keysLastet = true;
    console.log("keys lastet");
    assetsLoaded();
  };
  keyImage.src = "Sprites/nøkkel.gif";

  //Stein
  let stoneImage = new Image();
  stoneImage.onload = function() {
    steinerLastet = true;
    console.log("steiner lastet");
    assetsLoaded();
  };
  stoneImage.src = "Sprites/stone.png";

  //Stein
  let buskImage = new Image();
  buskImage.onload = function() {
    bushLastet = true;
    console.log("busker lastet");
    assetsLoaded();
  };
  buskImage.src = "Sprites/Busk4.png";

  //Triggers
  let triggerImage = new Image();
  triggerImage.onload = function() {
    triggerLastet = true;
    console.log("triggers lastet");
    assetsLoaded();
  };
  triggerImage.src = "Sprites/trigger.png";

  //Arrow Shooter
  let shooterImageRight = new Image();
  shooterImageRight.onload = function() {
    arrowShooterLastet = true;
    console.log("skyter høyre lastet");
    assetsLoaded();
  };
  shooterImageRight.src = "Sprites/crossbowRight.png";
  
  let shooterImageLeft = new Image();
  shooterImageLeft.onload = function() {
    arrowShooterLastet = true;
    console.log("skyter venstre lastet");
    assetsLoaded();
  };
  shooterImageLeft.src = "Sprites/crossbowLeft.png";
  
  //Arrow
  let arrowImageRight = new Image();
  arrowImageRight.src = "Sprites/NewArrowRight.png";

  let arrowImageLeft = new Image();
  arrowImageLeft.src = "Sprites/NewArrowLeft.png";

  //Gate
  let gateImage = new Image();
  gateImage.src = "Sprites/gate.png";

  let enemeySprite = new Image();
  enemeySprite.onload = function() {
    console.log("Enemy loaded");
  };
  enemeySprite.src = "Sprites/NewSoldier.png";
  console.log(enemeySprite.width, ObjectSizeHei);

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
    x: 13,
    y: 10
  };

  player.move = function(direction) {
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
        if (
          playerImage.getAttribute("src") ==
          "Sprites/KongSverreBackWalking2.png"
        ) {
          playerImage.src = "Sprites/KongSverreBackWalking1.png";
          player.y -= movement;
        } else if (
          playerImage.getAttribute("src") ==
          "Sprites/KongSverreBackWalking1.png"
        ) {
          playerImage.src = "Sprites/KongSverreBackWalking2.png";
          player.y -= movement;
        } else {
          playerImage.src = "Sprites/KongSverreBackWalking1.png";
          player.y -= movement;
        }
        break;
      case "down":
        if (
          playerImage.getAttribute("src") ==
          "Sprites/KongSverreFrontWalking2.png"
        ) {
          playerImage.src = "Sprites/KongSverreFrontWalking1.png";
          player.y += movement;
        } else if (
          playerImage.getAttribute("src") ==
          "Sprites/KongSverreFrontWalking1.png"
        ) {
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
        console.log(
          "moving stone " +
            i +
            " to: " +
            moveObjArray[i].x +
            ", " +
            moveObjArray[i].y
        );
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

    for (let i = 0; i < moveObjArray.length; i++) {
      if (
        check_collision(moveObjArray[i].x, moveObjArray[i].y) ||
        check_collision_stones(moveObjArray[i].x, moveObjArray[i].y, i)
      ) {
        moveObjArray[i].x = moveObjArray[i].oldX;
        moveObjArray[i].y = moveObjArray[i].oldY;
        player.x = hold_player.x;
        player.y = hold_player.y;

      } else if (moveObjArray[i].x < enemyX + 0.5 && moveObjArray[i].x > enemyX - 0.5 && moveObjArray[i].y == enemyY) {
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
    for (let i = 0; i < nykkelObjArray.length; i++) {
      if (player.x == nykkelObjArray[i].x && player.y == nykkelObjArray[i].y) {
        console.log("found a key!");
        keyPickedUp += 1;
        //Midlertidig, fjernes fra canvaset
        nykkelObjArray[i].x = 20;
        nykkelObjArray[i].y = 20;
      }
    }
    console.log("x: " + player.x + " y: " + player.y);
  };

  let spriteDraw = 4;
  let spriteDrawFrame = 0;
  let arrowDraw = 0;
  let arrowDrawFrame = 0;

  let maxFrames = 4;
  let waitArrow = 0;

  /**
   * Handle all the updates of the canvas and creates the objects
   * @function
   * @name update
   */
  function update() {
    if (isGameover) {
      return;
    }

    requestAnimationFrame(update);

    cantx.drawImage(terrainImage, 0, 0); //draw background

    //draw triggers for stones and the arrowshooters
    for (let i = 0; i < triggerObjArray.length; i++) {
      cantx.drawImage(triggerImage, triggerObjArray[i].x * ObjectSizeWid, triggerObjArray[i].y * ObjectSizeHei, ObjectSizeWid, ObjectSizeHei);
    }

    cantx.drawImage(shooterImageRight, shooterObjArray[0].x * ObjectSizeWid, shooterObjArray[0].y * ObjectSizeHei, ObjectSizeWid, ObjectSizeHei);

    cantx.drawImage(shooterImageLeft, shooterObjArray[1].x * ObjectSizeWid, shooterObjArray[1].y * ObjectSizeHei, ObjectSizeWid,ObjectSizeHei);

    //Draw unmovable objects
    for (let i = 0; i < unMoveObjArray.length; i++) {
      cantx.drawImage(buskImage, unMoveObjArray[i].x * ObjectSizeWid, unMoveObjArray[i].y * ObjectSizeHei,ObjectSizeWid, ObjectSizeHei);
      if (i < nykkelObjArray.length) {
        cantx.drawImage(keyImage, nykkelObjArray[i].x * ObjectSizeWid, nykkelObjArray[i].y * ObjectSizeHei, ObjectSizeWid, ObjectSizeHei
);
      }
      if (i < moveObjArray.length) {
        cantx.drawImage(stoneImage, moveObjArray[i].x * ObjectSizeWid, moveObjArray[i].y * ObjectSizeHei, ObjectSizeWid, ObjectSizeHei);
      }
    }

    //Draw player
    cantx.drawImage(playerImage, player.x * ObjectSizeWid, player.y * ObjectSizeHei, ObjectSizeWid, ObjectSizeHei);

    //keys collected Board
    board();

    //hvis triggerpadene er dekket og 3 "nøkler" er plukket opp, åpne gate
    if (!check_Trigger() && keyPickedUp == 0) {
      for (let i = 0; i < gateObjArray.length; i++) {
        cantx.drawImage(gateImage, gateObjArray[i].x * ObjectSizeWid, gateObjArray[i].y * ObjectSizeHei, ObjectSizeWid, ObjectSizeHei);
      }
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
      sprite();
      //thisFrame += 40;
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
    
    spriteDrawFrame += 1;
    arrowDrawFrame++;

    //Draw the animations
    if (!rightArrowCol) {
      cantx.drawImage(arrowImageRight, arrow_XR * ObjectSizeWid, arrow_Y * ObjectSizeHei, ObjectSizeWid, ObjectSizeHei);
    }

    if (!leftArrowCol) {
      cantx.drawImage(arrowImageLeft, arrow_XL * ObjectSizeWid, arrow_Y * ObjectSizeHei, ObjectSizeWid, ObjectSizeHei);
    }

    cantx.drawImage(enemeySprite, spriteFrame, 0, 40, 40, enemyX * ObjectSizeHei, enemyY * ObjectSizeHei, ObjectSizeHei, ObjectSizeWid);
    //enemyX * ObjectSizeHei, enemyY * ObjectSizeHei
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
      //(x == unMoveObjArray[i].x && y == unMoveObjArray[i].y)
      if (
        (x == unMoveObjArray[i].x && y == unMoveObjArray[i].y) ||
        (x == 1 && y == 9) ||
        (x == 18 && y == 9)
      ) {
        console.log("There is something there");
        foundCollision = true;
      }
    }

    if (winCondition) {
      for (let i = 0; i < gateObjArray.length; i++) {
        if (x == gateObjArray[i].x && gateObjArray[i].y == y) {
          update();
          gameOver();
          return (foundCollision = false);
        }
      }
    }
    return foundCollision;
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

    for (let i = 0; i < nykkelObjArray.length; i++) {
      if (x == nykkelObjArray[i].x && y == nykkelObjArray[i].y) {
        return (foundCollision = true);
      }
    }

    for (let i = 0; i < moveObjArray.length; i++) {
      if (x == moveObjArray[i].x && y == moveObjArray[i].y) {
        if (i == j) {
          continue;
        } else {
          foundCollision = true;
        }
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

    if (
      (newX == player.x && y == player.y) ||
      (newX == player.x && y == player.y)
    ) {
      foundCollision = true;
      console.log("There was a collision with arrow here");
    }

    return foundCollision;
  }

  /**
   * Checks if the boxes/stones are on top of the trigger boxes
   * and then returns a value of true for bothTriggered
   * @function
   * @name check_Trigger
   * */
  function check_Trigger() {
    let checkCount = 0;
    let bothTriggered = false;

    for (let i = 0; i < moveObjArray.length; i++) {
      if (
        moveObjArray[i].x == triggerObjArray[0].x &&
        moveObjArray[i].y == triggerObjArray[0].y
      ) {
        checkCount++;
      }

      if (
        moveObjArray[i].x == triggerObjArray[1].x &&
        moveObjArray[i].y == triggerObjArray[1].y
      ) {
        checkCount++;
      }

      if (checkCount == 2) {
        bothTriggered = true;
      }
    }

    return bothTriggered;
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
   * Score bordet nede i venstre hjørne
   * @function
   * @name board
   */
  function board() {
    cantx.fillStyle = "rgba(0, 0, 0, 0.5)";
    cantx.fillRect(wid - 140, hig - 110, 100, 70);

    cantx.font = "14px Arial";
    cantx.fillStyle = "rgba(255, 255, 255, 1)";
    cantx.fillText(keyPickedUp + " key Items", wid - 120, hig - 70);
  }

  /**
   * Decide here if all the assets are ready to start updating
   * @function
   * @name assetsLoaded
   */
  function assetsLoaded() {
    if (
      bakgrunnLastet == true &&
      keysLastet == true &&
      spillerLastet == true &&
      bushLastet == true &&
      arrowShooterLastet == true &&
      triggerLastet == true &&
      steinerLastet == true &&
      !level1Started &&
      gameOver
    ) {
      shoot();
      startTimer();
      resetTimer();
      level1Started = true;
      requestAnimationFrame(update);
    }
  }

  let spriteFrame = 40;
  let enemyX = 17;
  let enemyY = 4;
  let moveLeft = true;
  let moveRight = false;
  let enemySpeed = 0.2;
  let doubleIndex = 0;

  function sprite() {
    if (isGameover) {
      return;
    }

    if (check_col_player(enemyX + 0.5, enemyY)) {
      //if there is a collision with the player, gameOver() is called
      gameOver();
      return;
    }

    if (
      ((check_collision_stones(enemyX - 0.2, enemyY) || check_collision(enemyX, enemyY)) && moveLeft) || enemyX <= 1) {
        moveRight = true;
        moveLeft = false;
    } else if (
      ((check_collision_stones(enemyX + 1, enemyY) || check_collision(enemyX, enemyY)) && moveRight) || enemyX >= 18) {
        moveRight = false;
        moveLeft = true;
    }
      if (moveLeft) {
        enemyX -= enemySpeed;
        if(spriteFrame == 0 && doubleIndex == 1)
        {
          spriteFrame = 0;
          doubleIndex++;
        }
        else if (spriteFrame == 0){
          spriteFrame = 40;
          doubleIndex = 0;
        }
        else {
          spriteFrame = 0;
          doubleIndex++;
        }

      } else if (moveRight) {
        enemyX += enemySpeed;
        if(spriteFrame == 80 && doubleIndex == 1)
        {
          spriteFrame = 80;
          doubleIndex++;
        }
        else if (spriteFrame == 80){
          spriteFrame = 120;
          doubleIndex = 0;
        }
        else {
          spriteFrame = 80;
          doubleIndex++;
        }
      }
  }

  //To check collision of arrows
  let leftArrowCol = false;
  let rightArrowCol = false;

  /**
   * Function for when the arrows are beeing shot
   * it updates each time there it moved the x amount
   * @function
   * @name shoot
   */
  function shoot() {
    if (isGameover) {
      return;
    }

    arrow_XR -= cantx.canvas.height / (cantx.canvas.height*2);
    arrow_XL += cantx.canvas.height / (cantx.canvas.height*2);

    if (
      check_col_player(arrow_XR, arrow_Y) ||
      check_col_player(arrow_XL, arrow_Y)
    ) {
      //if there is a collision with the player, gameOver() is called
      gameOver();
      return;
    }

    if (
      check_collision_stones(arrow_XL + 1, arrow_Y, moveObjArray.length + 1) ||
      check_collision(arrow_XL + 1, arrow_Y)
    ) {
      //if the arrow on the Left hits the wall, make leftArrowCol = true, as there is less room on the left side, compared to right side.
      arrow_XL = 1;
      leftArrowCol = true;
    }

    if (
      check_collision_stones(arrow_XR, arrow_Y, moveObjArray.length + 1) ||
      check_collision(arrow_XR, arrow_Y)
    ) {
      rightArrowCol = true;
      arrow_XR = 18;
    }
  }

  //SCORING SYSTEM
  function scoreCalc() {
    let points = 1000 / 60;
    let pointsTime = myTime * points;
    score = 1000 - pointsTime;
    score = Math.floor(score);
  }

  /**
   * Game over function (NOT WORKING PROPERLY YET.)
   * @todo Do something with canvas when player dies.
   */
  let isGameover = false;

  function gameOver() {
    isGameover = true;

    if (winCondition) {
      myTime = timer.seconds;
      clearInterval(timer.clearTime);
      scoreCalc();
      let myScore = "Your score was: " + String(score);
      $(".myScore").text(myScore);
      window.cancelAnimationFrame(update);
      setTimeout(Level2(), 1000);
    } else {
      window.cancelAnimationFrame(update);
      clearInterval(timer.clearTime);
      cantx.drawImage(gameOverImage, 150, 100);
    }
  }

  /**
   * Assign of the arrow keys to call the player move
   */
  $(document).keydown(function(e) {
    e = e || window.event;

    if (isGameover) {
      //stop keys from working :)
    } else if (e.keyCode == "37" || e.keyCode == "65") player.move("left");
    else if (e.keyCode == "38" || e.keyCode == "87") player.move("up");
    else if (e.keyCode == "39" || e.keyCode == "68") player.move("right");
    else if (e.keyCode == "40" || e.keyCode == "83") player.move("down");
  });

  $("#reset").click(function() {
    if (winCondition) {
    } else {
      player.x = 13;
      player.y = 13;
      arrowObjArray.length = 0;
      moveObjArray.length = 0;
      unMoveObjArray.length = 0;
      nykkelObjArray.length = 0;
      shooterObjArray.length = 0;
      triggerObjArray.length = 0;
      gateObjArray.length = 0;
      keyPickedUp = 0;
      isGameover = false;
      makeArrays();
      window.cancelAnimationFrame(update);
      assetsLoaded();
    }
  });
};
