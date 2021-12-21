var PLAY = 1;
var END = 0;
var Over=2;
var gameState = PLAY;


var harry, harryRunning, harryCollided;
var ground;

var obstaclesGroup;

var score = 0;
var gameOverImg,restartImg,endImage,end,flag,flagImage, lampImg, treeImg, fortImg, villanImg;
var jumpSound , checkPointSound, dieSound, bgSound;

function preload(){
  //loading animations for harry
  harryRunning = loadAnimation("image/h1.png","image/h2.png","image/h3.png",'image/h4.png');
  harryCollided = loadAnimation("image/exp1.png","image/exp2.png","image/exp3.png","image/exp4.png","image/exp5.png","image/exp6.png");
  treeImg= loadImage('image/tree.png')
  bgImg= loadImage('image/nightcitybg.jpg');
  
  witchImg = loadAnimation("image/witch1.png");
  villanImg=loadAnimation("image/v2.png");
  
  restartImg = loadImage("image/restart.png");
  gameOverImg = loadAnimation("image/over.gif");
  endImage=loadAnimation("image/end.gif");
  fortImage = loadImage("image/fort.png")
  lampImg= loadImage("image/l1.png")
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("gameover.mp3")
  checkPointSound = loadSound("gamend.mp3")
  bgSound= loadSound("bgm.mp3")

}

function setup() {
  createCanvas(900,500);
  // creating harry 
  harry = createSprite(100,220,10,10);
  harry.addAnimation("running", harryRunning);
  harry.addAnimation("collided", harryCollided);
  harry.setCollider("rectangle",0,0,50,30);
  harry.scale = 3;
 // harry.debug=true;
  
  ground = createSprite(width/2,height-20,width*100,10);
  ground.visible= false;
  
  gameOver = createSprite(width/2-50,height/2,200,200);
  gameOver.addAnimation("Over",gameOverImg);
  gameOver.scale = 1;
  
  restart = createSprite(camera.position.x-50 ,100);
  restart.addImage(restartImg);
  //restart.debug = false;
  restart.scale = 1;
  
  end = createSprite(600,200);
  end.addAnimation("the end",endImage);
  end.scale=1.5;

  fort = createSprite(10000,250);
  fort.addImage(fortImage);
  fort.scale=1;
  
 // bgSound.loop()


  obstaclesGroup = createGroup();
 lampGroup = createGroup();
  
  score = 0;

 
}

function draw() {
  
  background(bgImg);  

  camera.position.x = harry.x;

  console.log(harry.x);

 ground.x=camera.position.x;
  ground.x=camera.position.x;



  end.x=camera.position.x;
  restart.x=camera.position.x-50;
  gameOver.x=camera.position.x-25;

  //displaying score
  fill("white")
  textFont("copperplate gothic");
  textSize(25);
  text("YOUR SCORE: "+ score,camera.position.x-350,28);

  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    end.visible=false;

    //scoring
    score = score + Math.round(getFrameRate()/160);
    
  
    

    //jump when the space key is pressed
    if(keyDown("UP_ARROW")) {
      harry.velocityY = -20;
        jumpSound.play();
    }

    if(keyDown(RIGHT_ARROW)){
      harry.x= harry.x+20;
      score++
     
    }
    
    //add gravity
    harry.velocityY = harry.velocityY + 1.5
  
    //spawn the lamps
    spawnlamps();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(harry)){
        
        gameState = END;
        dieSound.play();
    }

    if(harry.x>9990){
      gameState=Over;
      checkPointSound.play()
    }

  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     harry.changeAnimation("collided", harryCollided);
    harry.scale=3;
    obstaclesGroup.destroyEach();
     harry.velocityY = 0
     harry.velocityX=0;
      ground.velocityX=0;
     
    
    obstaclesGroup.setLifetimeEach(-1);
    lampGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     lampGroup.setVelocityXEach(0); 

   }else if(gameState===Over){
   
    obstaclesGroup.destroyEach();
    lampGroup.destroyEach();
    harry.destroy();
    fort.destroy();
    end.visible=true;
    bgSound.stop()
   }

   

  harry.collide(ground);
  
  if(mousePressedOver(restart)) {
      reset();
    }


    drawSprites();    
}

function reset(){
  gameState=PLAY;
  obstaclesGroup.destroyEach();
  lampGroup.destroyEach();
  harry.changeAnimation("running",harryRunning);
  score=0;
  harry.x=0;
  harry.scale=3;

}


function spawnObstacles(){
 if (frameCount % 100 === 0){
   var obstacle = createSprite(camera.position.x +800,430,10,40);
   obstacle.velocityX =0;
   //obstacle.debug=true;
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addAnimation("witchf",witchImg);
              obstacle.scale = 1.5;
              break;
      case 2: obstacle.addAnimation("villan1",villanImg);
              obstacle.scale=1.8;
              break;
      
      default: break;
    }
   
         
    
    obstacle.lifetime = 800;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnlamps() {
  //write code here to spawn the lamps and trees
  if (frameCount % 160 === 0) {
    var lamp = createSprite(camera.position.x+Math.round(random(850,1000)),350,40,10);
   
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: lamp.addImage(lampImg);
              lamp.scale = 0.5;
              break;
      case 2: lamp.addImage(treeImg)
             lamp.scale= 0.93
              break;
      
      default: break;
    }
    
    lamp.velocityX = 0;
    
    
    //adjust the depth
    lamp.depth = harry.depth;
    harry.depth = harry.depth + 1;
    
    //add each cloud to the group
    lampGroup.add(lamp);
  }
}

