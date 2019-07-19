



//var myAudioContext = new AudioContext();
var spawnRate = 1500;
var money = 50
var img_tower_simple;
var cells = [[]];
var cells_size_x = 10;
var cells_size_y = 10;
var zoom = 50;
var offset = [0,0];
var drag_start = [0,0];
// CURSORS: ARROW, CROSS, HAND, MOVE, TEXT, WAIT
var street = [[2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7],[3,7],[4,7],[5,7],[6,7],[6,6],[6,5],[6,4],[7,4],[8,4],[9,4],[10,4]]
var bullets = [];
var enemies = [];
var draggingActive = false
var selOffer = 0;

var offers;
/*
var towers = {
  'schoko':{
    'value': 1,
    'tex_url': 'assets/schoko.png',
    'price': 5,
    'mode': 'shoot',
    'show_name': "Schoko Muffin",
    'desc': "Schießt mittelgroße Schokoladenstreußel."
  },
  'blaubeer':{
    'value': 1,
    'tex_url': 'assets/blaubeer.png',
    'price': 20,
    'mode': 'slow',
    'show_name': "Blaubeer Muffin",
    'desc': "Schießt klebrige Blaubeeren, die Gegner verlangsamen."
  }
}
*/
function preload() {
  img_tower_simple = loadImage("./assets/tower_simple.png");
}

function setup() {
  createCanvas(1200,800)
  createCells();
  //offers = createOffers(towers)
  enemies.push(new enemy(street[0],"NORMAL"))
  cursor(CROSS);
  createEnemies();
}

function draw() {
  background(100)
  showCells();
  updateEnemies();
  updateBullets();
  cursor(CROSS);
  renderGUI();
}

function renderGUI() {
  textSize(50);
  fill(255,255,0)
  stroke(0)
  text("Geld: " + money,  width / 2, 70)
  //showMenu();
}

function updateBullets() {
  for (var i = 0; i < bullets.length; i++) {
    if (bullets[i].dead == false){
      bullets[i].move();
      bullets[i].show();
    }
  }
}

function updateEnemies() {
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].dead == false){
      enemies[i].move();
      enemies[i].show();
    }
  }
}

function createEnemies() {
  enemies.push(new enemy(street[0],"NORMAL"));
  setTimeout(createEnemies, spawnRate);
}

function showMenu() {
  fill(200);
  stroke(50);
  rect(900,0,1200,800)
  for (var i = 0; i < offers.length; i++) {
    offers[i].show()
  }
}

function keyPressed() {

}

function mouseClicked() {
}

function placeTower() {
  if (money >= 10){
    money -= 10
    let x = floor((mouseX-offset[0])/zoom)
    let y = floor((mouseY-offset[1])/zoom)
    if (cells[x][y].tower != "STREET"){
      cells[x][y] = new cell(x,y,false,"SIMPLE",0)
    }
  }
}

function mousePressed() {
  drag_start[0] = mouseX - offset[0];
  drag_start[1] = mouseY - offset[1];
}

function mouseWheel(event) {
  zoom -= event.delta / 20;
  /*offset[0] += (mouseX) * (event.delta / 20);
  offset[1] += (mouseY) * (event.delta / 20);*/
}

function mouseDragged() {
  draggingActive = true;
  offset[0] = mouseX - drag_start[0]
  offset[1] = mouseY - drag_start[1]
}

function mouseReleased() {
  cursor(ARROW);
  if (draggingActive == true){
    draggingActive = false;
  } else {
    placeTower();
  }
}

function showCells() {
    for (var x = 0; x < cells_size_x; x++) {
      for (var y = 0; y < cells_size_y; y++) {
        cells[x][y].show()
      }
    }
}

function createCells() {
  for (var x = 0; x < cells_size_x; x++) {
    cells.push(new Array());
    for (var y = 0; y < cells_size_y; y++) {
      cells[x].push(new cell(x,y,false,"EMPTY"));
    }
  }
  for (tile of street) {
    cells[tile[0]][tile[1]] = new cell(tile[0],tile[1],false,"STREET")
  }
}

function findEnemy(thisx,thisy,r){
  let succ = false;
  let eBest = 0;
  let distMin = r;
  for (var i = 0; i < enemies.length; i++) {
    let dist = pytagoras((enemies[i].x-thisx),(enemies[i].y-thisy));
    if ((enemies[i].dead == false) && (dist < distMin)){
      distMin = dist;
      eBest = i
      succ = true;
    }
  }
  if (succ && (eBest != 0)) {
    //console.log(i);
    return eBest;
  } else {
    return false
  }
}

function pytagoras(a,b) {
  return Math.sqrt(Math.pow(a,2)+Math.pow(b,2));
}


class cell {
  constructor(x,y,blocked,tower,id) {
    this.x = x;
    this.y = y;
    this.tickv = 0;
    this.tower = tower;
    this.blocked = blocked;
    this.offerID = id
    this.color = [100,100,255];
    if (this.tower == "STREET"){
      this.color = [122, 72, 25]
    }
  }
  show(){
    this.tickv++;
    if ((this.tickv % 30) == 0){
      this.shoot();
    }
    stroke(20);
    fill(this.color[0], this.color[1],this.color[2]);
    rect(offset[0]+this.x*zoom,offset[1]+this.y*zoom,zoom*0.95,zoom*0.95);
    if (this.tower == "SIMPLE"){
      image(img_tower_simple,offset[0]+this.x*zoom,offset[1]+this.y*zoom,zoom*0.95,zoom*0.95);
    }
  }
  shoot(){
    if (this.tower == "SIMPLE"){
      let targetEnemy = this.findEnemy(3)
      if (targetEnemy != false){
        //console.log("succ" + targetEnemy);
        //print(this.x + " und " + this.y)
        bullets.push(new bullet(targetEnemy,this.x,this.y,"SIMPLE",this.r));
      }
    }
  }
  findEnemy(r){
    return findEnemy(this.x,this.y,r);
  }
}


class enemy {
  constructor(pos,type) {
    this.type = type;
    this.x = pos[0];
    this.y = pos[1];
    this.progress = 0;
    this.speed = 0.001;
    this.dead = false;
    this.health = 1;
    this.damageMultiplicator = 1 / (enemies.length + 1)
  }
  move(){
    if (this.health <= 0){
      this.dead = true;
      money += 5;
    }
    if (ceil(street.length * this.progress)+1 >= street.length){
      this.dead = true
    } else {
      this.progress += this.speed;
      let street_x = street[floor(street.length * this.progress)][0];
      let street_y = street[floor(street.length * this.progress)][1];
      let street_xb = street[ceil(street.length * this.progress)][0];
      let street_yb = street[ceil(street.length * this.progress)][1];
      this.x = lerp(street_x,street_xb, (street.length * this.progress) % 1)
      this.y = lerp(street_y,street_yb, (street.length * this.progress) % 1)
    }
  }
  show(){
    fill(200,50,50);
    stroke(0)
    ellipse(offset[0]+(this.x + 0.5)*zoom,offset[1]+(this.y + 0.5)*zoom,zoom*0.5,zoom*0.5);
    strokeWeight(2);
    stroke(0,255,0)
    line(offset[0]+(this.x + 0)*zoom,offset[1]+(this.y + 1)*zoom,offset[0]+(this.x + this.health)*zoom,offset[1]+(this.y + 1)*zoom);
    stroke(255,100,100)
    line(offset[0]+(this.x + this.health)*zoom,offset[1]+(this.y + 1)*zoom,offset[0]+(this.x + 1)*zoom,offset[1]+(this.y + 1)*zoom);
    strokeWeight(1);
  }
}


class bullet {
  constructor(targetEnemyIndex,x,y,type,r) {
    this.tar = targetEnemyIndex;
    this.x = x;
    this.y = y;
    this.sender_x = x;
    this.sender_y = y;
    this.sender_r = r;
    this.type = type
    this.dead = false;
  }
  findEnemy(r){
    return findEnemy(this.sender_x,this.sender_y,r);
  }
  move(){
    //console.log(this.tar);
    if (enemies[this.tar].dead == false){
      this.x += min(0.04,max(-0.04,(enemies[this.tar].x-this.x)))
      this.y += min(0.04,max(-0.04,(enemies[this.tar].y-this.y)))
      let dist = pytagoras((enemies[this.tar].x-this.x),(enemies[this.tar].y-this.y))
      if (dist < 0.1){
        this.hit()
      }
    } else {
      this.tar = this.findEnemy(99999);
      if (this.tar == false){
        this.dead = true
      }
    }
  }
  hit() {
    enemies[this.tar].health -= 0.9 * enemies[this.tar].damageMultiplicator;
    this.dead = true;
  }
  show(){
    if (this.type == "SIMPLE"){
      fill(0);
      stroke(127);
      ellipse(offset[0]+(this.x + 0.5)*zoom,offset[1]+(this.y + 0.5)*zoom,zoom*0.2,zoom*0.2);
    }
  }
}
/*
function createOffers(towers){
  a = []
  for (const o of towers) {
    a.push(new Offer(o["name"],o["price"],o["desc"],o["show_name"]))
  }
  return a
}

class Offer {
  constructor(name,price,desc,show_name) {
    this.name = name
    this.show_name
    this.price = price
    this.desc = desc
  }
}*/
