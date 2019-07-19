function genProbability() {
  for (var i = 0; i < tr; i++) {
    let crc = [cr[i][0],cr[i][1]]
    let prob_in = [0,0,0,0,0,0,0];
    let prob_cr = [0,0,0,0,0,0,0];
    let gfc = [gf[i][0],gf[i][1],gf[i][2],gf[i][3],gf[i][4],gf[i][5],gf[i][6]]
    for (var j = 0; j < gfc.length; j++) {
      prob_in[gfc[j]] += crc[1];
      prob_cr[gfc[j]] += crc[0]
    }
    console.log("Richtige: " + prob_cr);
    console.log("Im Code: " + prob_in);
  }
}


function getAllCodes() {
  c = [0,0,0,0]
  pcodes = [];
  let failed = false;
  while (true) {
    c[0]++;
    for (var i = 0; i < c.length; i++) {
      if (c[i] == colors.length){
        c[i] = 0;
        if (i+1 >= c.length){
          failed = true
          break
        }
        c[i+1]++;
      }
    }
    if (isPossibleCode(c)) {
      copy = []
      f = c.length
      while(f--){copy[f] = c[f]}
      pcodes.push(copy)
    }
    if (failed) {
      break
    }
  }
  return pcodes
}


function isPossibleCodeCustom(c,gfc,crc,trc) {
  corr = true
  if (corr) {
    for (var i = 0; i < trc; i++) {
      if (!(getCorrCustom(c,gfc[i])[0] == crc[i][0] && getCorrCustom(c,gfc[i])[1] == crc[i][1])) {
        corr = false
      }
    }
  }
  return corr
}

function prep() {
  gf[tr][0] = 1
  gf[tr][1] = 2
  gf[tr][2] = 3
  gf[tr][3] = 4
  finishMove()
  gf[tr][0] = 2
  gf[tr][1] = 3
  gf[tr][2] = 5
  gf[tr][3] = 6
  finishMove()
}


function autoMoveV2() {
  pcodes = getAllCodes()
  drawStats(pcodes.length)
  console.log("Anzahl der möglichen Codes:" + pcodes.length);
  results_main = createGF(pcodes.length,pcodes.length);
  for (var h = 0; h < pcodes.length; h++) { // schleife für alle codes bei denen angenommen wird, dass sie richtig sind. (B)
    for (var i = 0; i < pcodes.length; i++) { // schleife für alle codes, die zum testen angeügt werden (A)
      let gf_copy = gf.copy() // kopie vom speilfeld
      let tr_copy = tr+1
      gf_copy[tr] = pcodes[i].copy() // code anfügen (A)
      let rc_copy = [];
      for (var j = 0; j < tr_copy; j++) {
        res = getCorrCustom(pcodes[h].copy(),gf_copy[j].copy()) // ergebniss bei code (A) in annahme, dass (B) richtig ist
        rc_copy.push(res.copy())
      }
      for (var j = 0; j < pcodes.length; j++) {
        if (isPossibleCodeCustom(pcodes[j].copy(),gf_copy.copy(),rc_copy.copy(),tr_copy)) {
          results_main[h][i]++;
        }
      }
      //console.log(results_main[h][i]);
    }
  }
  //console.log(results_main);
  let results_comp = []
  for (var i = 0; i < results_main.length; i++) {
    sum = 0
    for (var j = 0; j < results_main[i].length; j++) {
      sum += results_main[i][j]
    }
    results_comp.push(sum)
  }
  //console.log(results_comp)
  let best = 1000000000
  let bestId = 0
  for (var i = 0; i < results_comp.length; i++) {
    if (results_comp[i] < best) {
      best = results_comp[i]
      bestId = i
    }
  }
  //console.log(pcodes[bestId]);
  gf[tr] = pcodes[bestId].copy()
  finishMove()
}
