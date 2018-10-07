window.onload = function() {
    "use strict";

    //variabler for å definere spillervinduet vårt, altså en canvas i 2D.
    var canvas = document.getElementById("ourMap");
    var cantx = canvas.getContext("2d");
    var wid = canvas.offsetWidth;
    var hig = canvas.offsetHeight;

    //Variabler for å sjekke om at bilder og elementer er lastet inn i scenen. 
    var bakgrunnLastet = false;
    var hinderLastet = false;
    var spillerLastet = false;
    var keysLastet = false;
    
    var winCondition = false;

    //variabler for gåfart, scoring og offsets.
    var speed = 25;
    var myTime = 0;
    var score = 0;
    var keyPickedUp = 0;
    var modifier = 25;
    var objectSizes = 40; 

    var arrow_XR = 18; 
    var arrow_XL = 1;
    var arrow_Y = 9;

    //Funksjon for hva elementet moveable object inneholder
    function mittElement (x, y) {
      this.x = x;
      this.y = y;
      this.oldX = x; 
      this.oldY = y;
    };
    
    //Liste med objekter som kan beveges
    var moveObjArray = [];
    //Liste med objekter som IKKE kan beveges
    var unMoveObjArray = [];
    //Liste med objekter som kan plukkes opp
    var nykkelObjArray = [];
    //Liste med objekter som kan steiner kan stå på
    var triggerObjArray = [];
    //Liste over hvor gaten er
    var gateObjArray = [];

    var arrowObjArray = [];
    var shooterObjArray = [];

    function makeArrays () {

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
        for (var i = 0; i <= 11; i++)
        {
          for (var j = 0; j <= 11; j++){
            if ((i == 11 && (j <= 11 && j >= 6)) || ((i <= 10 && i >= 7) && j == 6) || (i == 7 && (j <= 11 && j > 6))) {
              unMoveObjArray.push(new mittElement(i, j));
            }
          }
        }

        //ramme rundt nivået
        for(var x = 0; x < wid/objectSizes; x++){
          for(var y = 0; y < hig/objectSizes; y++)
          {
            if((x == 0) || (y == 0) || (x < 20 && y == 19) || (x == 19 && y < 20)){
              unMoveObjArray.push(new mittElement(x, y));
            }
          }
        }
      }

      //Sett alle elementer inn i Array
      makeArrays();

    //Laste alle bilder og elementer inn og definer dem 
    //Terraine bilde / Bakgrunns bilde 
    var gameOverImage = new Image();
    gameOverImage.src = "gameover.png";

    var terrainImage = new Image();
    terrainImage.onload = function() {
    bakgrunnLastet = true;
    assetsLoaded();
    };
    terrainImage.src = "terrain.png";
    
    //Spiller bilde 
    var playerImage = new Image();
    playerImage.onload = function() {
    spillerLastet = true;
    assetsLoaded();
    };
    playerImage.src = "Kong_Sverre.png";

    //PickupItem
    var keyImage = new Image();
    keyImage.onload = function() {
    keysLastet = true;
    assetsLoaded();
    };
    keyImage.src = "pickup.png";

    //Stein
    var stoneImage = new Image();
    stoneImage.onload = function() {
    hinderLastet = true;
    assetsLoaded();
    };
    stoneImage.src = "stone.png";

    //Stein
    var buskImage = new Image();
    buskImage.onload = function() {
    assetsLoaded();
    };
    buskImage.src = "busk.png";

    //Triggers
    var triggerImage = new Image();
    triggerImage.onload = function() {
    assetsLoaded();
    };
    triggerImage.src = "trigger.png";

    //Arrow Shooter
    var shooterImage = new Image();
    shooterImage.onload = function() {
    assetsLoaded();
    };
    shooterImage.src = "arrowtrigger.png";

    //Arrow 
    var arrowImageRight = new Image();
    arrowImageRight.onload = function() {
    assetsLoaded();
    };
    arrowImageRight.src = "arrowRight.png";

    var arrowImageLeft = new Image();
    arrowImageLeft.onload = function() {
    assetsLoaded();
    };
    arrowImageLeft.src = "arrowLeft.png";

    //Gate
    var gateImage = new Image();
    gateImage.onload = function(){
    };
    gateImage.src = "gate.png";

    //Brukes for sprites
    var spritePosition = 0;
    var spriteItemDistance = 33;

    var timer = {
      seconds: 0,
      minutes: 0,
      clearTime: -1
    };


    var startTimer = function() {
      if (timer.seconds === 59) {
        timer.minutes++;
        timer.seconds = 0;
      } else {
        timer.seconds++;
      };

      // Ensure that single digit seconds are preceded with a 0
    var formattedSec = "0";
    if (timer.seconds < 10) {
      formattedSec += timer.seconds;
    } else {
      formattedSec = String(timer.seconds);
  } 

    var time = String(timer.minutes) + ":" + formattedSec;
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
    //Gjør variabelen for spiller og hinder objektet globalt, slik at du kan hente det fra flere plasser i scriptet.
    var hold_player;
    
    var player = {
        x: 13,
        y: 10,
    };
    
    player.move = function(direction) {

        hold_player = {
            x: player.x,
            y: player.y
        };

        //a function to keep the movable objects current position before it is potentially moved. The oldX and oldY values are used it the box collides
        // so as to stop then from moving forward, but rather keep the old position.
        for(var i = 0; i < moveObjArray.length; i++){
          moveObjArray[i].oldX = moveObjArray[i].x;
          moveObjArray[i].oldY = moveObjArray[i].y;
        }


    /**
     * Decide here the direction of the user and do the neccessary changes on the directions
     */
    switch (direction) {
        case "left":
          player.x -= speed / modifier;
          break;
        case "right":
          player.x += speed / modifier;
          break;
        case "up":
          player.y -= speed / modifier;
          break;
        case "down":
        player.y += speed / modifier;
        break;
      }

      /**
       * Moves the hinder if the player is going on the same spot that the hinder is on
       */
      for (var i = 0; i < moveObjArray.length; i++){
        if (player.x == moveObjArray[i].x && player.y == moveObjArray[i].y)
          {
            console.log("moving stone " + i + " to: " + moveObjArray[i].x + ", " + moveObjArray[i].y);
            moveHinder(moveObjArray[i].x, moveObjArray[i].y , i);
          }
      }

      /**
       * if there is a collision just fallback to the temp object i build before while not change back the direction so we can have a movement
       */
      if (check_collision(player.x, player.y)) {
        player.x = hold_player.x;
        player.y = hold_player.y;
      } 

      for(var i = 0; i < moveObjArray.length; i++){
        if (check_collision(moveObjArray[i].x, moveObjArray[i].y) || check_collision_stones(moveObjArray[i].x, moveObjArray[i].y, i))
        {
          moveObjArray[i].x = moveObjArray[i].oldX;   
          moveObjArray[i].y = moveObjArray[i].oldY;
          player.x = hold_player.x;
          player.y = hold_player.y;
        }
      }

      /**
       * If player finds the coordinates of keyitem 
       */
      for (var i = 0; i < nykkelObjArray.length; i++){
        if (player.x == nykkelObjArray[i].x && player.y == nykkelObjArray[i].y) { 
          console.log("found a key!");
           keyPickedUp += 1;
          //Midlertidig, fjernes fra canvaset
          nykkelObjArray[i].x = 20;
          nykkelObjArray[i].y = 20;
        }
      }
      
      update();
    };

    startTimer();
    resetTimer();
  
    /**
     * Handle all the updates of the canvas and creates the objects
     * @function
     * @name update
     */
    function update() {
      cantx.drawImage(terrainImage, 0, 0);

      for (var i = 0; i < triggerObjArray.length; i++){
        cantx.drawImage(triggerImage, triggerObjArray[i].x * objectSizes, triggerObjArray[i].y * objectSizes, objectSizes, objectSizes);
        cantx.drawImage(shooterImage, shooterObjArray[i].x * objectSizes, shooterObjArray[i].y * objectSizes, objectSizes, objectSizes);
      }

      for(var i = 0; i < unMoveObjArray.length; i++)
      {
        cantx.drawImage(buskImage, unMoveObjArray[i].x * objectSizes, unMoveObjArray[i].y * objectSizes, objectSizes, objectSizes);
        if (i < nykkelObjArray.length)
        {
          cantx.drawImage(keyImage, nykkelObjArray[i].x * objectSizes, nykkelObjArray[i].y * objectSizes, objectSizes, objectSizes);
        }
        if (i < moveObjArray.length)
        {
          cantx.drawImage(stoneImage, moveObjArray[i].x * objectSizes, moveObjArray[i].y * objectSizes, objectSizes, objectSizes);
        }
      }

      //Draw player
      console.log("x: " + player.x + " y: " + player.y);
      cantx.drawImage(playerImage, player.x * objectSizes, player.y * objectSizes, objectSizes, objectSizes);
  
      //keys collected Board
      board();

      //hvis triggerpadene er dekket og 3 "nøkler" er plukket opp, åpne gate 
      if (check_Trigger() && keyPickedUp == 3){
        for(var i = 0; i < gateObjArray.length; i++){
          cantx.drawImage(gateImage, spritePosition * spriteItemDistance, 0, objectSizes, objectSizes, gateObjArray[i].x * objectSizes, gateObjArray[i].y * objectSizes, objectSizes, objectSizes);
        } 
          winCondition = true;
        } 
        else { 
          winCondition = false;
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
      var foundCollision = false;

      x = Math.floor(x);
      y = Math.floor(y);
      
      //Check collision for bushes 
      for (var i = 0; i < unMoveObjArray.length; i++){
        if((x == unMoveObjArray[i].x && y == unMoveObjArray[i].y) || (x == 1 && y == 9) || (x == 18 && y == 9)){
          console.log("There is something there");
          foundCollision = true;
        }
      }

      if(winCondition)
      {
        for (var i = 0; i < gateObjArray.length; i++)
        {
          if(x == gateObjArray[i].x && gateObjArray[i].y == y)
          {
            update();
            gameOver();
            return foundCollision = false;
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
    function check_collision_stones (x, y, j){

      var foundCollision = false;

      x = Math.floor(x);
      y = Math.floor(y);
      
      for(var i = 0; i < nykkelObjArray.length; i++)
      {
        if (x == nykkelObjArray[i].x && y == nykkelObjArray[i].y){
          return foundCollision = true;
        }
      }

      for (var i = 0; i < moveObjArray.length; i++){
        if(x == moveObjArray[i].x && y == moveObjArray[i].y){
          if(i == j){
            continue;
          }
          else {
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
    function check_col_player (x, y) {

      var foundCollision = false;
      var newX = Math.floor(arrow_XR);
      var newXL = Math.floor(arrow_XL);

      if((newX == player.x && y == player.y) || (newXL == player.x && y == player.y))
      {
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
    function check_Trigger (){
      var checkCount = 0;
      var bothTriggered = false;

      for (var i = 0; i < moveObjArray.length; i++){
        if(moveObjArray[i].x == triggerObjArray[0].x && moveObjArray[i].y == triggerObjArray[0].y) {
          checkCount++; }
        
        if (moveObjArray[i].x == triggerObjArray[1].x && moveObjArray[i].y == triggerObjArray[1].y) {
          checkCount++; }
        
        if(checkCount == 2){
          bothTriggered = true; }
      }

      return bothTriggered;
    }
    
    /**
    * Funksjon for å flytte på hinderet, alt etter hvor spilleren var plassert FØR dem begynte kom vedsiden av elementet
    * @function
    * @name shoot 
    * */
    function moveHinder (x, y, i){
    if(hold_player.x > x && hold_player.y == y) //left
        {
          moveObjArray[i].x -= speed / modifier;
        }
        else if (hold_player.x < x && hold_player.y == y) //right
        {
          moveObjArray[i].x += speed / modifier;
        }
        else if (hold_player.x == x && hold_player.y < y) //up
        {
          moveObjArray[i].y += speed / modifier;
        }
        else if (hold_player.x == x && hold_player.y > y) //down
        {
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
      if (bakgrunnLastet == true && keysLastet == true && spillerLastet == true && hinderLastet == true) {
        update();
      }
    }


    //To check collision of arrows
    var leftArrowCol = false; 
    var rightArrowCol = false;
    shoot();

    /**
     * Function for when the arrows are beeing shot 
     * it updates each time there it moved the x amount
     * @function
     * @name shoot
     */
    function shoot () { 

      if(isGameover)
      { return; }      

      update();
       
      if(!rightArrowCol){
        cantx.drawImage(arrowImageRight, arrow_XR * objectSizes, arrow_Y * objectSizes, objectSizes, objectSizes); }

      if(!leftArrowCol){
        cantx.drawImage(arrowImageLeft, arrow_XL * objectSizes, arrow_Y * objectSizes, objectSizes, objectSizes); }  
     
      arrow_XR -= 0.1;
      arrow_XL += 0.1;

      if(check_col_player(arrow_XR, arrow_Y) || check_col_player(arrow_XL, arrow_Y)) { //if there is a collision with the player, gameOver() is called
        gameOver ();
        return; }

      if(check_collision_stones(arrow_XL + 1, arrow_Y, moveObjArray.length + 1) || check_collision(arrow_XL + 1, arrow_Y)){ //if the arrow on the Left hits the wall, make leftArrowCol = true, as there is less room on the left side, compared to right side. 
        arrow_XL = 1;
        leftArrowCol = true; }

      if(check_collision_stones(arrow_XR, arrow_Y, moveObjArray.length + 1) || check_collision(arrow_XR, arrow_Y)){
        rightArrowCol = true;
        arrow_XR = 18; }
      
      if (leftArrowCol && rightArrowCol) {
        leftArrowCol = false;
        rightArrowCol = false;
        arrow_XR = 18;
        arrow_XL = 1;
        update();
        setTimeout(function() {shoot()}, 2500);
      } else {
        requestAnimationFrame(shoot) // loop
      }
    }

    //SCORING SYSTEM
    function scoreCalc () {
      var points = 100/60;
      var pointsTime = myTime * points;
      score = 100 - pointsTime;
      score = Math.floor(score);
    }

    /** 
     * Game over function (NOT WORKING PROPERLY YET.)
     * @todo Do something with canvas when player dies. 
    */
    var isGameover = false;
    
    function gameOver () {
      isGameover = true;
      
      if(winCondition){
        myTime = timer.seconds;
        clearInterval(timer.clearTime);
        scoreCalc();
        var myScore = "Your score was: " + String(score);
        $(".myScore").text(myScore);  
      } else {
        update();
        clearInterval(timer.clearTime);
        cantx.drawImage(gameOverImage, 150, 100);
      }
    }

    /**
     * Assign of the arrow keys to call the player move
     */
    document.onkeydown = function(e) {
      e = e || window.event;
      
      if(isGameover)
      {
        //stop keys from working :)
      }
      else if (e.keyCode == "37" || e.keyCode == "65") player.move("left");
      else if (e.keyCode == "38" || e.keyCode == "87") player.move("up");
      else if (e.keyCode == "39" || e.keyCode == "68") player.move("right");
      else if (e.keyCode == "40" || e.keyCode == "83") player.move("down");
    };

    $("#reset").click(function  () {
      player.x = 13; player.y = 13;
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
      update();
    });
  
  };
