var m = 0;
var w = 800;
var h = 600;
var img_m;
var anim = 0
var frame = 0;
var offers = [];
var mpst = 0;

function antiCheat() {
  debugger
  console.log("hehehheeheh");
  setTimeout(antiCheat, 100)
}

function preload() {
  img_m = loadImage("muffin.png");
}
function setup() {
  createCanvas(w,h);
  offers[0] = new Offer("Einfache Backstube", 0, 10, 1);
  offers[1] = new Offer("Muffinfabrik", 1, 30, 3)
  offers[2] = new Offer("Fertigungshalle", 2, 100, 12)
  setTimeout(antiCheat, 100)
}
function draw() {

  frame++;
  fill(80,70,140);
  rect(-10,-10,1020,820);
  fill(0);
  stroke(0);
  textSize(50);
  text("Muffins: " + m, 20, 50);
  fill(0,0,255);
  stroke(0);
  textSize(25);
  text("Insgesamt " + mpst + " Muffins/s",  500, 35);
  // muffin
  image(img_m, 50+anim,50+anim, 300-anim*2, 500-anim*2)
  // menü
  fill(60,120,200);
  stroke(30,60,100);
  rect(400,50,600,500)

  displayOffers();

  if (anim > 0){
    anim -= anim / 10
  }
}


function mousePressed() {
  if (mouseX > 50 && mouseX < 350 && mouseY > 100 && mouseY < 550){
    m += 1
    anim = 20
  }
  for (var i = 0; i < offers.length; i++){
    offers[i].testMouse(mouseX,mouseY);
  }
}

function displayOffers() {
  for (var i = 0; i < offers.length; i++){
    offers[i].show()
    if (frame % 60 == 0){
      offers[i].calc()
    }
  }
}


class Offer {
  constructor(o_name, o_count, o_p, o_mps) {
    this.name = o_name;
    this.count = o_count;
    this.p = o_p;
    this.sp = o_p
    this.mps = o_mps;
    this.anz = 0
  }

  calc(){
    m += this.mps * this.anz;
    if (this.anz != 0){
      anim = 10
    }
  }
  show(){
    //rahmen
    stroke(0);
    if (this.p <= m){
      fill(30,60,250);
    } else {
      fill(150,60,30);}

    rect(410, 60+this.count*100,w-10,90)
    //name
    fill(0);
    textSize(20);
    text(this.name, 420,90+this.count*100);
    // anz
    fill(0,255,0);
    textSize(20);
    text("Gekaufte: " + this.anz, 420,140+this.count*100);
    // preis
    fill(255,0,0);
    textSize(20);
    text("Preis: " + this.p, 420,120+this.count*100);
    // mps
    fill(0,0,255);
    textSize(20);
    text("Muffins/s: " + (this.mps * this.anz), 550,120+this.count*100);

  }

  testMouse(x,y){
    if(x > 410 && y > (60+this.count*100) && x < w-10 && y < 150+this.count*100 && m >= this.p){
      m -= this.p;
      this.anz += 1;
      mpst += this.mps
      this.p = (this.anz+1) * this.sp
    }
  }




}
