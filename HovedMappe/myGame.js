
//MenuLoad ();
window.onload = function () {
  myGame();
};

function MenuLoad () {
      var canvas = document.getElementById("ourMap");
      var cantx = canvas.getContext("2d");

      //variabler for å definere spillervinduet vårt, altså en canvas i 2D
      if($(window).width() < 1367)
      {
        cantx.canvas.height = 600;
        cantx.canvas.width = 600;
      }
      if($(window).width() < 321){
        cantx.canvas.height = 250;
        cantx.canvas.width = 250;
      }
      
      var background;
      var startButton;

      var backgroundLoaded = false;
      var startButtonLoaded = false;
      var startClicked = false;
      var gameStarted = false;

      var startButtonHeight = 100;
      var startButtonWidth = 200;

      var STB_x = (cantx.canvas.width/2) - startButtonWidth/2;
      var STB_y = (cantx.canvas.height/2) - startButtonHeight/2;
      
      loadAssets();

      function loadAssets () {
        background = new Image ();
        background.onload = function () {
            backgroundLoaded = true;
            isAssetsLoaded();
        }
        background.src = "menuBG.png";
    
        startButton = new Image ();
        startButton.onload = function () {
            startButtonLoaded = true;
            isAssetsLoaded();
        }
        startButton.src = "start.png";
    
      }

      if (gameStarted){
        
      }
      else {
        $(window).mousemove ( function (event) {
          if((event.clientX > STB_x && event.clientX < STB_x + startButtonWidth) && (event.clientY > STB_y && event.clientY < STB_y + startButtonHeight) && !gameStarted) {
            console.log("Over button");
            startButton.src = "startHover.png";
            startClicked = true;
          }
          else {
            startButton.src = "start.png";
            startClicked = false;
          }
        });

        $("#ourMap").click ( function () {
          console.log("clicked on canvas");
          if(startClicked == true){
            myGame(); 
            gameStarted = true;
            $(window).unbind("mousemove");
            $("#ourMap").unbind("click");
          }
        });
      }


      function startMenuupdate(){ 
          cantx.drawImage(background, 0, 0);
          cantx.drawImage(startButton, STB_x, STB_y, startButtonWidth, startButtonHeight);
      }
      
      function isAssetsLoaded() {
        if (backgroundLoaded == true && startButtonLoaded == true){
          startMenuupdate();
        }
      }
  }

var myGame = function () {

    var canvas = document.getElementById("ourMap");
    var cantx = canvas.getContext("2d");
    
    var wid = canvas.offsetWidth;
    var hig = canvas.offsetHeight;

    //Variabler for å sjekke om at bilder og elementer er lastet inn i scenen.
    var bakgrunnLastet = false;
    var bushLastet = false;
    var spillerLastet = false;
    var keysLastet = false;
    var keysLastet = false;
    var steinerLastet = false;
    var arrowLastet2 = false;
    var arrowLastet1 = false;
    var arrowShooterLastet = false;
    var triggerLastet = false;

    var winCondition = false;
    var level1Started = false;

    //variabler for gåfart, scoring og offsets.
    var speed = 10;
    var myTime = 0;
    var score = 0;
    var keyPickedUp = 0;
    var modifier = 10;
    var ObjectSizeWid = wid/20;
    var ObjectSizeHei = hig/20;
    var friction = 0.98;

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
        for(var x = 0; x < ObjectSizeWid; x++){
          for(var y = 0; y < ObjectSizeHei; y++)
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
      console.log("bakgrunn lastet");
      assetsLoaded();
    };
    terrainImage.src = "terrain.png";

    //Spiller bilde
    var playerImage = new Image();
    playerImage.onload = function() {
      spillerLastet = true; 
      console.log("spiller lastet");
      assetsLoaded();
    };
    playerImage.src = "KongSverreFront.png";

    //PickupItem
    var keyImage = new Image();
    keyImage.onload = function() {
      keysLastet = true;
      console.log("keys lastet");
      assetsLoaded();
    };
    keyImage.src = "pickup.png";

    //Stein
    var stoneImage = new Image();
    stoneImage.onload = function() {
      steinerLastet = true;
      console.log("steiner lastet");
      assetsLoaded();
    };
    stoneImage.src = "stone.png";

    //Stein
    var buskImage = new Image();
    buskImage.onload = function() {
      bushLastet = true;
      console.log("busker lastet");
      assetsLoaded();
    };
    buskImage.src = "busk.png";

    //Triggers
    var triggerImage = new Image();
    triggerImage.onload = function() {
      triggerLastet = true;
      console.log("triggers lastet");
      assetsLoaded();
    };
    triggerImage.src = "trigger.png";

    //Arrow Shooter
    var shooterImage = new Image();
    shooterImage.onload = function() {
      arrowShooterLastet = true;
      console.log("skytere lastet");
      assetsLoaded();
    };
    shooterImage.src = "arrowtrigger.png";

    //Arrow
    var arrowImageRight = new Image();
    arrowImageRight.src = "arrowRight.png";

    var arrowImageLeft = new Image();
    arrowImageLeft.src = "arrowLeft.png";

    //Gate
    var gateImage = new Image();
    gateImage.src = "gate.png";

    var enemeySprite = new Image();
    enemeySprite.onload = function () {
      console.log("loaded");
    }
    enemeySprite.src = "enemy.png";
    
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
    var movement = speed / modifier;
    
    switch (direction) {
        case "left":
          player.x -= movement;
            break;
        case "right":
          player.x += movement;
          break;
        case "up":
          if(playerImage.getAttribute('src') == "KongSverreBack.png"){
            player.y -= movement;
          }
          else{
            playerImage.src = "KongSverreBack.png"
          }
          break;
        case "down":
        if(playerImage.getAttribute('src') == "KongSverreFront.png"){
          player.y += movement;
        }
        else{
          playerImage.src = "KongSverreFront.png"
        }
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
      console.log("x: " + player.x + " y: " + player.y)
      update();
    };


    /**
     * Handle all the updates of the canvas and creates the objects
     * @function
     * @name update
     */
    function update() {

      cantx.drawImage(terrainImage, 0, 0);

      for (var i = 0; i < triggerObjArray.length; i++){
        cantx.drawImage(triggerImage, triggerObjArray[i].x * ObjectSizeWid, triggerObjArray[i].y * ObjectSizeHei, ObjectSizeWid, ObjectSizeHei);
        cantx.drawImage(shooterImage, shooterObjArray[i].x * ObjectSizeWid, shooterObjArray[i].y * ObjectSizeHei, ObjectSizeWid, ObjectSizeHei);
      }

      for(var i = 0; i < unMoveObjArray.length; i++)
      {
        cantx.drawImage(buskImage, unMoveObjArray[i].x * ObjectSizeWid, unMoveObjArray[i].y * ObjectSizeHei, ObjectSizeWid, ObjectSizeHei);
        if (i < nykkelObjArray.length)
        {
          cantx.drawImage(keyImage, nykkelObjArray[i].x * ObjectSizeWid, nykkelObjArray[i].y * ObjectSizeHei, ObjectSizeWid, ObjectSizeHei);
        }
        if (i < moveObjArray.length)
        {
          cantx.drawImage(stoneImage, moveObjArray[i].x * ObjectSizeWid, moveObjArray[i].y * ObjectSizeHei, ObjectSizeWid, ObjectSizeHei);
        }
      }

      //Draw player
      cantx.drawImage(playerImage, player.x * ObjectSizeWid, player.y * ObjectSizeHei, ObjectSizeWid, ObjectSizeHei);

      //keys collected Board
      board();

      //hvis triggerpadene er dekket og 3 "nøkler" er plukket opp, åpne gate
      if (check_Trigger() && keyPickedUp == 3){
        for(var i = 0; i < gateObjArray.length; i++){
          cantx.drawImage(gateImage, gateObjArray[i].x * ObjectSizeWid, gateObjArray[i].y * ObjectSizeHei, ObjectSizeWid, ObjectSizeHei);
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
      var newX = Math.floor(x);
      //var newXL = Math.floor(arrow_XL);

      if((newX == player.x && y == player.y) || (newX == player.x && y == player.y))
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
      if (bakgrunnLastet == true && keysLastet == true && spillerLastet == true && bushLastet == true && arrowShooterLastet == true && triggerLastet == true && steinerLastet == true && !level1Started) {
        shoot();
        startTimer();
        update();
        resetTimer();
        level1Started = true;
      }
    }

   
    var frameSize = enemeySprite.width/7;
    var thisFrame = 40;
    var frameIndex = 1;
    var enemyX = 16;
    var enemyY = 4;
    var turnEnemey = false;
    var enemySpeed = 0.2;
    
    sprite();

    function sprite () {
      
      update();
      if(check_col_player(enemyX, enemyY)) { //if there is a collision with the player, gameOver() is called
        gameOver ();
        return; }

      if (frameIndex == 6)
      {
        frameIndex = 0;
        thisFrame = 40;
        update();
        sprite();
      }
      else 
      {
        if (enemyX <= 2)
        {
          turnEnemey = true;
        }
        else if (enemyX >= 17)
        {
          turnEnemey = false;
        }

        if (enemyX >=2 && !turnEnemey)
        {
          enemyX -= enemySpeed;
        }
        else if (turnEnemey)
        {
          enemyX += enemySpeed;
        }
  
        cantx.drawImage(enemeySprite, thisFrame, 0, ObjectSizeWid, ObjectSizeHei, enemyX * ObjectSizeHei, enemyY * ObjectSizeHei, ObjectSizeWid, ObjectSizeHei);
        thisFrame += frameSize;
        frameIndex ++;
        setTimeout(function() {requestAnimationFrame(sprite);}, 70);
        
      }
    }
    


    //To check collision of arrows
    var leftArrowCol = false;
    var rightArrowCol = false;

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
        cantx.drawImage(arrowImageRight, arrow_XR * ObjectSizeWid, arrow_Y * ObjectSizeHei, ObjectSizeWid, ObjectSizeHei); }

      if(!leftArrowCol){
        cantx.drawImage(arrowImageLeft, arrow_XL * ObjectSizeWid, arrow_Y * ObjectSizeHei, ObjectSizeWid, ObjectSizeHei); }

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
      var points = 1000/60;
      var pointsTime = myTime * points;
      score = 1000 - pointsTime;
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
    $(document).keypress( function(e) {
      e = e || window.event;

      if(isGameover)
      {
        //stop keys from working :)
      }
      else if (e.keyCode == "37" || e.keyCode == "65") player.move("left");
      else if (e.keyCode == "38" || e.keyCode == "87") player.move("up");
      else if (e.keyCode == "39" || e.keyCode == "68") player.move("right");
      else if (e.keyCode == "40" || e.keyCode == "83") player.move("down");
    });
    
    $("#reset").click(function  () {

      if(winCondition){
        
      } else {
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
      }
      
    });
};


