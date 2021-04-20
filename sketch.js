var bg;
var dog, dogImg, happyImg, sadImg, rest;
var database;
var foodS, foodStock;

var gameState, gameS;

var bedroom, bedr, garden, gardn, bathroom, bathr;

var feed, add;
var fedTime, lastFed;
var currentTime;
var foodObj;
var name = "Oreo";

var response, responseJSON, datetime, hour, minute;

function preload()
{ 
  bg = loadImage("images/Garden.png");
  dogImg = loadImage("images/Dog.png");
  play = loadImage("images/running.png");
  rest = loadImage("images/Lazy.png");
  bedr = loadImage("images/Bed Room.png");
  gardn = loadImage("images/Garden.png");
  bathr = loadImage("images/Wash Room.png");
  sadImg = loadImage("images/Lazy.png");
  happyImg = loadImage("images/Lazy.png");
}

function setup() {
  createCanvas(1500, 1000);

  bedroom = createSprite(750, 500,1500,1000);
  bedroom.addImage(bedr);
  bedroom.scale = (1.6);

  bedroom.visible = false;

  bathroom = createSprite(750, 500,1500,1000);
  bathroom.addImage(bathr);
  bathroom.scale = (1.6);

  bathroom.visible = false;

  dog = createSprite(750, 500);
  dog.addImage(dogImg);
  dog.scale = (0.5);

  dog.visible = false;

  garden = createSprite(750, 500,1500,1000);
  garden.addImage(gardn);
  garden.scale = (1.6);

  garden.visible = false;
  
  database = firebase.database();



  foodStock = database.ref("Food");
  foodStock.on("value", readStock);

  gameState = database.ref("gameState");
  gameState.on("value", readGameState);

  foodObj = new food();

  feed = createButton("Feed My Pet "+name)
  feed.position(220,900)
  feed.size(120, 40);
  feed.mousePressed(function(){
    foodS = foodS-1
    FeedDog();
  });

  add = createButton("Add Food")
  add.position(220, 960)
  add.size(120, 40);
  add.mousePressed(function(){
    AddFood();
  });

  home = createButton("Home")
  home.position(220, 40)
  home.size(120, 30);
  home.mousePressed(function(){
    update("House");
  });

  bed = createButton("Bedroom")
  bed.position(220, 80)
  bed.size(120, 30);
  bed.mousePressed(function(){
    update("Sleeping");
  });

  bath = createButton("Bathroom")
  bath.position(220, 120)
  bath.size(120, 30);
  bath.mousePressed(function(){
    update("Bathing");
  });

  gar = createButton("Garden")
  gar.position(220, 160)
  gar.size(120, 30);
  gar.mousePressed(function(){
    update("Playing");
  });
}


function draw() {  
  background("lightgreen");

  fedTime = database.ref('FeedTime');
  fedTime.on("value", readLastTime);


  if (gameS !== "House") {
    feed.hide();
    add.hide();
  }

  /*
  currentTime = hour;
   
  if (currentTime == (lastFed + 1)) {
    update("Playing");
    background(garden);
  }
  
  if (currentTime == (lastFed + 2)) {
    update("Sleeping");
    background(bedr);
  }
 
  if (currentTime > (lastFed + 2) && currentTime < (lastFed + 4)) {
    update("Bathing");
    background(bathr);
  }

  if (currentTime > (lastFed + 4)){
    update("hungry");
  }
  
  */


 drawSprites();

 if (gameS === "House") {
  dog.visible = true;

  bedroom.visible = false;
  bathroom.visible = false;
  garden.visible = false;  

  foodObj.display();
  
  feed.show();
  add.show();
}
  
 if (gameS === "Sleeping") {
  bedroom.visible = true;

  bathroom.visible = false;
  garden.visible = false;
  dog.visible = false;

 

}

 if (gameS === "Bathing") {
  bathroom.visible = true;

  bedroom.visible = false;
  dog.visible = false;
  garden.visible = false;

 
}

if (gameS === "Playing") {
  bathroom.visible = false;
  bedroom.visible = false;
  dog.visible = false;

  garden.visible = true;

 
}

  

  
  worldTime();

  fill(255);
  textSize(30);
  textFont("Times New Roman");5
  text("Food Left : " +foodS +" 🥛", 390, 960);

  currentTime = hour;

  fill(255);
  textSize(30);
  textFont("Times New Roman");
  text("Last Fed : " +lastFed%12 +" pm", 40, 960);
  text("Time : " +currentTime%12 + " pm", 1240, 960);

}

function readLastTime(data) {
  lastFed = data.val();
}

function writeLastTime(t) {

  database.ref("/").update({
    FeedTime : t
  })
}

function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x) {

  if (x <= 0) {
    x = 0;
    
    dog.addImage(rest);
  }
  else {
    x = x - 1;
  }

  database.ref("/").update({
    Food : x
  })
}

function updateGameS() {
  database.ref('/').update({
    gameState : gameS
  })
}

function readGameState(data) {
  gameS = data.val();
}

async function worldTime() {
  response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata");
  responseJSON = await response.json();

  datetime = responseJSON.datetime;
  hour = datetime.slice(11, 13) ;
  minute = datetime.slice(14, 16);
}

function FeedDog(){

  if(foodS>0){

    worldTime();

    database.ref('/').update({
    Food : foodObj.getFoodStock(),
    FeedTime : hour
  })

  foodS--

  
  
  database.ref('/').update({
    Food : foodS
  });

  }

}

function AddFood(){

  foodS++

  database.ref('/').update({
    Food : foodS
  });
}

function update(state) {
  database.ref('/').update({
    gameState : state
  })
}



