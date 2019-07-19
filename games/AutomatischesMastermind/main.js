// zoom (größe jedes feldes)
var zoom = 75;
// farbige stecker
var gf = [];
// weiße und schwarze stecker
var cr = [];
// richtiger code
var rc = [];
// reihe / spielzug
var tr = 0;
// größe des spielfeldes
var gfSize = [4,7];
// LEER (GRAU); ROT; GRÜN; BLAU; GELB; PINK; BRAUN
colors = [[100,100,100],[255,0,0],[0,255,0],[0,0,255],[255,255,0],[214, 100, 195],[132, 79, 30]]
var maxPossible = Math.pow(4,6);
var maxPossibleShown = false;
var showRC = false;
var possibleCodeShown = false;
var possibleCode = [0,0,0,0];
var cnv;

Array.prototype.copy = function() {
	return this.slice(0);
};


function setup() {
  cnv = createCanvas(1000,600);
	cnv.parent("canvas-holder")
  // spielfeld initialisieren
  rc = genCode(gfSize[0]);
  gf = createGF(gfSize[1],gfSize[0]);
  cr = createGF(gfSize[1],2);
}

// maus gedrückt?
//   - Spielstein setzen
//   - knöpfe überwachen
function mousePressed() {
  let x = Math.floor(mouseX / zoom)
  let y = Math.floor(mouseY / zoom)
  if (tr == y && x < gfSize[0] && y < gfSize[1]) {
    gf[y][x]++;
    if (gf[y][x] == colors.length) {
      gf[y][x] = 0;
    }
  }
  // autom. zug
  if (x>=7&&x<10&&y>=4&&y<6){
    autoMoveV2();
  }
  // zug beenden
  if (x>=7&&x<10&&y>=2&&y<4){
    finishMove();
  }
}
// richtigen code generieren
function genCode(l) {
  var arr = [];
  for (var i = 0; i < l; i++) {
    arr.push(Math.floor(Math.random() * (colors.length-1))+1);
  }
  return arr;
}
// array mit bestimmter größe erstellen
function createGF(ys,xs) {
  let arr = [];
  for (var y = 0; y < ys; y++) {
    arr.push([])
    for (var x = 0; x < xs; x++) {
      arr[y].push(0);
    }
  }
  return arr;
}

function draw() {
  background(50);
  drawGF();
  if (showRC){
    drawRC();
  } else {
    textSize(zoom*0.3);
    fill(255);
    stroke(200);
    text('"s" drücken, um richtigen Code anzuzeigen.', (gfSize[0]+3)*zoom, zoom*0.5)
  }
  drawUI();
	drawStats();

}
function drawStats() {
	stroke(255)
	fill(255)
	if (maxPossibleShown){
		text("Mögliche lösungen: " + maxPossible,(gfSize[0]+3)*zoom,zoom*1.5)
	} else {
		text('"k" drücken, um die Anzahl\naller möglichen Codes anzuzeigen',(gfSize[0]+3)*zoom,zoom*1.5)
	}
	if (possibleCodeShown) {
		showPossibleCode()
	} else {
		text('"p" drücken, um einen möglichen\n Code anzuzeigen\n(nicht zwangsläufig der beste)',(gfSize[0]+3)*zoom,zoom*7)
	}
}
function keyPressed() {
  if (key == "s"){
    if (showRC){
      showRC = false;
    } else {
      showRC = true;
    }
  }
	if (key == "k") {
		maxPossibleShown = !maxPossibleShown
	}
	if (key == "p") {
		possibleCodeShown = !possibleCodeShown
	}
}
// autom. zug
function autoMove() {
  c = [0,0,0,0]
  let failed = false;
  while (true) {
    c[0]++;
    for (var i = 0; i < c.length; i++) {
      if (c[i] == colors.length){
        c[i] = 0;
        if (i+1 >= c.length){
          alert("Das AI weiss nicht weiter...");
          failed = true
          break
        }
        c[i+1]++;
      }
    }
    if (isPossibleCode(c) || failed) {
      break
    }
  }
  gf[tr] = c;
  finishMove();
}
// überprüfen ob der code übereinstimmt
function isPossibleCode(c) {
  corr = isValidCode(c)
  if (corr) {
    for (var i = 0; i < tr; i++) {
      if (!(getCorrCustom(c,gf[i])[0] == cr[i][0] && getCorrCustom(c,gf[i])[1] == cr[i][1])) {
        corr = false
      }
    }
  }
  return corr
}
// zug beenden
function finishMove() {
  if (isValidCode(gf[tr])){
    cr[tr] = getCorr(gf[tr]);
    if (getCorr(gf[tr])[0] == gfSize[0]){
      alert("Gewonnen!");
    }
    tr++;
    if (tr == gfSize[1]) {
      alert("Verloren!");
    }
  } else {
    alert("Im Code können keine leeren stellen sein.");
  }
	let tempvar = getAllCodes()
	maxPossible = tempvar.length
	possibleCode = tempvar[0]
}

function showPossibleCode() {
	for (var i = 0; i < possibleCode.length; i++) {
		fill(colors[possibleCode[i]][0],colors[possibleCode[i]][1],colors[possibleCode[i]][2]);
    stroke(0);
    rect((i+gfSize[0]+3)*zoom,zoom * 7,zoom*0.95,zoom*0.95);
	}
}

// herausfinden wie viele weiße / schwarze stecker
function getCorr(tcode) {
  rcc = [];
  i = rc.length;
  while(i--) rcc[i] = rc[i];
  let w = 0;
  let b = 0;
	let checkLater = [];
  for (var i = 0; i < tcode.length; i++) {
    if (tcode[i] == rcc[i]) {
      b++;
      rcc[i] = colors.length+1;
			checkLater.push(false)
    } else {
			checkLater.push(true)
    }
  }
	for (var i = 0; i < tcode.length; i++) {
		if (checkLater[i]) {
			for (var j = 0; j < rcc.length; j++) {
        if (rcc[j] == tcode[i]) {
          w++;
          rcc[j] = colors.length+1;
          break
        }
      }
		}
	}
  return [b,w]
}
// gibt das ergebniss bei einem selbst gewähltem richtigem code zurück
function getCorrCustom(tcode,orcode) {
  rcode = [];
  i = orcode.length;
  while(i--) rcode[i] = orcode[i];
  let w = 0;
  let b = 0;
	let checkLater = [];
  for (var i = 0; i < tcode.length; i++) {
    if (tcode[i] == rcode[i]) {
      b++;
      rcode[i] = colors.length+1;
			checkLater.push(false)
    } else {
      checkLater.push(true)
    }
  }
	for (var i = 0; i < tcode.length; i++) {
		if (checkLater[i]) {
			for (var j = 0; j < rcode.length; j++) {
        if (rcode[j] == tcode[i]) {
          w++;
          rcode[j] = colors.length+1;
          break
        }
      }
		}
	}
	return [b,w]
}
// überprüfen ob keine leeren zellen da sind
function isValidCode(tcode) {
  let v = true;
  for (var i = 0; i < tcode.length; i++) {
    if (tcode[i] == 0) {
      v = false;
    }
  }
  return v
}
// spielfeld anzeigen
function drawRC() {
  for (var i = 0; i < rc.length; i++) {
    fill(colors[rc[i]][0],colors[rc[i]][1],colors[rc[i]][2]);
    stroke(0);
    rect((i+gfSize[0]+3)*zoom,0,zoom*0.95,zoom*0.95);
  }
}
function drawGF() {
  for (var y = 0; y < gf.length; y++) {
    for (var x = 0; x < gf[y].length; x++) {
      fill(colors[gf[y][x]][0],colors[gf[y][x]][1],colors[gf[y][x]][2]);
			if (tr == y) {
				stroke(255,0,0)
			} else {
				stroke(0);
			}
			strokeWeight(2);
      rect(x*zoom,y*zoom,zoom*0.95,zoom*0.95);
    }
  }
	strokeWeight(1)
  for (var i = 0; i < cr.length; i++) {
    textSize(zoom*0.9);
    fill(0);
    stroke(0);
    text(cr[i][0],gfSize[0]*zoom,(i+0.8)*zoom)
    fill(255);
    stroke(0);
    text(cr[i][1],(gfSize[0]+1)*zoom,(i+0.8)*zoom)
  }
}
function drawUI() {
	strokeWeight(1)
  fill(220,220,75);
  stroke(0)
  rect(7*zoom, 4*zoom, zoom*3,zoom*2)
  fill(0);
  textSize(25);
  text("Automatischer Zug",7.1*zoom, 4.9*zoom);
  fill(100,255,100);
  stroke(0);
  rect(7*zoom, 2*zoom, zoom*3,zoom*2)
  fill(0);
  textSize(25);
  text("Spielzug beenden",7.1*zoom, 2.9*zoom);
}
