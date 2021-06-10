var PLAY = 1;
var END = 0;
var gameState = PLAY;

var car, car_speeding, car_collided;
var track, invisibleGround, trackImage;

var cloudsGroup, cloudImage;
var hurdlesGroup, hurdle1, hurdle2, hurdle3, hurdle4, hurdle5, hurdle6;

var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  car_speeding =   loadImage("cr.png");
  car_collided = loadImage("cr.png");
  
  trackImage = loadImage("r.png");
  
  cloudImage = loadImage("cloud.png");
  
  hurdle1 = loadImage("o.png");
  
  gameOverImg = loadImage("G.png");
  restartImg = loadImage("RE.png");
  bg = loadImage("b.jpg")
}

function setup() {
  createCanvas(600, 200);
  
  car = createSprite(50,180,20,50);
  
  car.addAnimation("speeding", car_speeding);
  car.addAnimation("collided", car_collided);
  car.scale = 0.5;
  
  track = createSprite(200,180,400,20);
  track.addImage("track",trackImage);
  track.x = track.width /2;
  track.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,70);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.3;
  restart.scale = 0.3;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  hurdlesGroup = new Group();
  
  score = 0;
}

function draw() {
  background(bg)

  text("Score: "+ score, 500,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    track.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && car.y >= 159) {
      car.velocityY = -15;
    }

    if(keyDown("right_arrow") && car.y >= 159) {
      car.velocityX= 15;
    }
  
    if(keyDown("s") && car.y >= 159) {
      car.velocityX = 0;
    }

    if(keyDown("left_arrow") && car.y >= 159) {
      car.velocityX = -15;
    }

    car.velocityY = car.velocityY + 0.8
  
    if (track.x < 0){
      track.x = track.width/2;
    }
  
    car.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(hurdlesGroup.isTouching(car)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    track.velocityX = 0;
    car.velocityY = 0;
    car.velocityX = 0;
    hurdlesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the car animation
    car.changeAnimation("collided",car_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    hurdlesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 0;
    
    //adjust the depth
    cloud.depth = car.depth;
    car.depth = car.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var hurdle = createSprite(600,165,10,40);
    //hurdle.debug = true;
    hurdle.velocityX = -(6 + 3*score/100);
    
    //generate random hurdles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: hurdle.addImage(hurdle1);
              break;
      case 2: hurdle.addImage(hurdle1);
              break;
      case 3: hurdle.addImage(hurdle1);
              break;
      case 4: hurdle.addImage(hurdle1);
              break;
      case 5: hurdle.addImage(hurdle1);
              break;
      case 6: hurdle.addImage(hurdle1);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the hurdle           
    hurdle.scale = 0.5;
    hurdle.lifetime = 300;
    //add each hurdle to the group
    hurdlesGroup.add(hurdle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  hurdlesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  car.changeAnimation("speeding",car_speeding);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}