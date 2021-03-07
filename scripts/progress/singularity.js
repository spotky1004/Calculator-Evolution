(function() {
  singularityMachineData = { // singularityMachine
    BaseBoost: {color: "#630b0b", name: "Base", hasBoost: true, boostType: "add", challengeIdx: 0, idx: 0},
    DigitBoost: {color: "#63370b", name: "Digit", hasBoost: true, boostType: "add", challengeIdx: 1, idx: 1},
    MoneyBoost: {color: "#63630b", name: "Money", hasBoost: true, boostType: "mul", challengeIdx: 2, idx: 2},
    RpBoost: {color: "#0b630b", name: "RP", hasBoost: true, boostType: "mul", challengeIdx: 3, idx: 3},
    ResearchSpeedBoost: {color: "#0b6337", name: "R.Speed", boostType: "mul", challengeIdx: 4, hasBoost: true, idx: 4},
    SpeedBoost: {color: "#0b6363", name: "Speed", hasBoost: true, boostType: "mul", challengeIdx: 5, idx: 5},
    QubitBoost: {color: "#630b56", name: "Qubit", hasBoost: true, boostType: "mul", challengeIdx: 6, idx: 6},
    Incrementer: {color: "#0b3763", name: "Incrementer", hasBoost: false, idx: 7},
    Booster: {hasArrow: false, color: "#808080", name: "Booster", hasBoost: true, challengeIdx: 7, idx: 8},
    Merger: {hasTier: false, color: "#000000", name: "Merger", hasBoost: false, idx: 9},
    Output: {hasArrow: false, hasTier: false, hasValue: false, name: "Output", hasBoost: false, idx: 10}
  }
  machineIdx = ["BaseBoost", "DigitBoost", "MoneyBoost", "RpBoost", "ResearchSpeedBoost", "SpeedBoost", "QubitBoost", "Incrementer", "Booster", "Merger", "Output"];
  challengeIdx = ["BaseBoost", "DigitBoost", "MoneyBoost", "RpBoost", "ResearchSpeedBoost", "SpeedBoost", "QubitBoost",  "Booster"];
  challengeDesc = [
    "Base is capped at 50 (can extend with only grid)",
    "Digit is capped at 20 (can extend with only grid)",
    "CPU upgrade effect ^0.75",
    "All quantum upgrade cost x2",
    "Divide research upgrade effect by 20",
    "Lock Durability and Max durability research",
    "Reduce Quantum Lab requirement isn't allowed",
    "Effects of all previous Challenges"
  ]

  // singularityGridBlock
  for (var i = 0; i < 25; i++) {
    var gridNode = document.createElement("span");
    gridNode.classList.add("singularityGridBlock");
    gridNode.onclick = new Function(`singularityGridClick(${i%5}, ${Math.floor(i/5)}, "l")`);
    gridNode.onmousedown = new Function(`singularityGridDown(${i%5}, ${Math.floor(i/5)})`);
    gridNode.addEventListener('contextmenu', new Function(`singularityGridClick(${i%5}, ${Math.floor(i/5)}, "r")`));
    gridNode.onmouseover = new Function(`singularityGridOver(${i%5}, ${Math.floor(i/5)})`);
    gridNode.onmouseout = new Function(`singularityGridOut()`);
    $("#singularityGridOutInnerWarp").append(gridNode);
    var txtNode = document.createElement("div");
    txtNode.classList.add("machineTier");
    txtNode.innerHTML = "0";
    txtNode.style.display = "none";
    gridNode.append(txtNode);
    var txtNode = document.createElement("div");
    txtNode.classList.add("machineName");
    txtNode.innerHTML = "name";
    txtNode.style.display = "none";
    gridNode.append(txtNode);
    var txtNode = document.createElement("div");
    txtNode.classList.add("machineValue");
    txtNode.innerHTML = "0";
    txtNode.style.display = "none";
    gridNode.append(txtNode);
    var arrowNode = document.createElement("div");
    arrowNode.classList.add("machineArrow");
    arrowNode.style.display = "none";
    gridNode.append(arrowNode);
  }

  // singularityGridMachines
  for (var i = 0; i < 11; i++) {
    var thisMachine = singularityMachineData[machineIdx[i]];

    var machineNode = document.createElement("span");
    machineNode.classList.add("singularityGridMachines");
    machineNode.style.setProperty("--col", thisMachine.color);
    machineNode.onclick = new Function(`singularityMachineSelect.bind(this)(${i})`);
    $("#singularityMachines").append(machineNode);

    var nameNode = document.createElement("div");
    nameNode.classList.add("singularityGridMachineTxt");
    nameNode.innerHTML = thisMachine.name;
    machineNode.append(nameNode);

    var nameNode = document.createElement("div");
    nameNode.classList.add("singularityGridMachineTxt");
    nameNode.classList.add("singularityGridMachineTxtQuantity");
    nameNode.innerHTML = `Quantity 0`;
    machineNode.append(nameNode);
  }

  // merge grid inner elements
  const machineTier = document.getElementsByClassName("machineTier");
  const machineName = document.getElementsByClassName("machineName");
  const machineValue = document.getElementsByClassName("machineValue");
  const machineArrow = document.getElementsByClassName("machineArrow");
  gridInnerElements = [];
  for (let i = 0; i < 25; i++) {
    gridInnerElements.push([machineTier[i], machineName[i], machineValue[i], machineArrow[i]]);
  }

  // wormholeChallenge
  for (let i = 0; i < 8; i++) {
    var thisData = singularityMachineData[challengeIdx[i]];

    var cahllengeNode = document.createElement("div");
    cahllengeNode.classList.add("wormholeChallenge");
    cahllengeNode.style.setProperty("--col", thisData.color + '44');
    cahllengeNode.onclick = new Function(`wormholeChallengeEnter(${i})`);
    $("#wormholeChallengeInnerWarp").append(cahllengeNode);

    var nameNode = document.createElement("div");
    nameNode.innerHTML = `${thisData.name} Challenge (0/10)`;
    nameNode.classList.add("wormholeChallengeName");
    cahllengeNode.append(nameNode);

    var effectNode = document.createElement("div");
    effectNode.innerHTML = `None`;
    effectNode.classList.add("wormholeChallengeEffect");
    cahllengeNode.append(effectNode);

    var effectNode = document.createElement("div");
    effectNode.innerHTML = `Goal: Infinity QL`;
    effectNode.classList.add("wormholeChallengeGoal");
    cahllengeNode.append(effectNode);
  }
  
  // prevent right click
  $("#singularityGridOutInnerWarp").addEventListener('contextmenu', event => event.preventDefault());

  singularityGridIdx = [
    1, 4, 9, 16, 25,
    2, 3, 8, 15, 24,
    5, 6, 7, 14, 23,
    10, 11, 12, 13, 22,
    17, 18, 19, 20, 21
  ]; // grid open order calcGridOpened()

  selectedMachine = -1; // machineIdx[i]
  gridOn = undefined; // {x: 0, y: 0}
  gridEditing = 1;
  gridHold = undefined;
  singularityBoostsBase = {
    BaseBoost: D(0),
    DigitBoost: D(0),
    MoneyBoost: D(1),
    RpBoost: D(1),
    ResearchSpeedBoost: D(1),
    SpeedBoost: D(1),
    QubitBoost: D(1)
  };
  singularityBoosts = {};
  mergerWorks = {};
  for (var i in singularityBoostsBase) singularityBoosts[i] = D(singularityBoostsBase[i]);

  gridTestMode = 0;
})();

// basic
function singularity() {
  if (game.quantumLab.lt(80)) return;
  if (game.t4resets.lt(1) && !confirm("If you go singularity you'll lose everything that you have!\nAre you sure to reset all progress?")) return;

  game.t4resets = game.t4resets.add(1);
  game.singularityPower = game.singularityPower.add(calcSingularityPowerGain());
  game.t4resetTime = Math.min(game.t4resetTime, new Date().getTime() - game.singularityTime);
  singularityReset();

  commandAppend(`Go singularity (${ordNum(game.t4resets)})`, (30+game.t4resets.toNumber()*3)%360, 1);
}
function renderSingularity() {
  $("#singularityButton").className = game.quantumLab.gte(80) ? "" : "disabled";
  $("#singularityDesc").innerHTML = game.quantumLab.gte(80) ? `If you go singularity now, you'll get <b>${dNotation(calcSingularityPowerGain(), 4, 0)} SP</b> ${game.quantumLab.lt(500) ? `(next SP at ${calcSingularityPowerGain(1)} QL)`: ''}` : 'You need 80 Quantum Labs to go Singularity';
  $("#singularityDesc").innerHTML += `<br>You have <b><span style="color: #fff;">${dNotation(game.singularityPower, 4, 0)} Singularity Power</span></b>`;
  $("#singularityDesc").innerHTML += `<br>Each SP increases Multi Process by 4 (tot ${Math.floor(Math.min(25, game.singularityPower.toNumber()*4)+Math.max(0, game.singularityPower.toNumber()*4-25)**0.5)}, softcap at 25)`
  $("#singularityDesc").innerHTML += `<br>And boosts grid machine Power by x${dNotation(game.singularityPower.pow(4).pow(game.quantumUpgradeBought.includes('75')?D(1).add(game.singularityPower.add(1).log(10).pow(0.8)):1), 4, 0)}`;
  if (calcMilestoneDone() < 7) $("#singularityDesc").innerHTML += `<br>Have ${2**calcMilestoneDone()*2} SP to retain Keep ${romanize(calcMilestoneDone()+1).toUpperCase()}`;
  $("#wormholeChallengeWarp").style.display = game.t4resets.gte(2) || (game.t5resets.gte(1) && game.singularityPower.gte(1)) ? "block" : "none";
  $("#gridReq").innerHTML = `Complete ${4-(calcChallengeDone()+3)%4} more challenge to unlock ${ordNum(calcGridOpened()+1)} Grid space`;
  $("#challengeRewardMachine").style.color = game.challengeEntered == -1 ? "inherit" : singularityMachineData[challengeIdx[game.challengeEntered]].color;
  $("#challengeRewardMachine").style.textShadow = game.challengeEntered == -1 ? "inherit" : `0 0 0.3vh ${singularityMachineData[challengeIdx[game.challengeEntered]].color}`;
  [...document.getElementsByClassName("wormholeChallengeName")].forEach((ele, idx) => ele.innerHTML = `${singularityMachineData[challengeIdx[idx]].name} Challenge (${game.wormholeChallengeProgress[idx]}/10)`);
  [...document.getElementsByClassName("wormholeChallenge")].forEach((ele, idx) => ele.style.setProperty("--progress", `${10*game.wormholeChallengeProgress[idx]}%`));
  [...document.getElementsByClassName("wormholeChallengeEffect")].forEach((ele, idx) => ele.innerHTML = challengeDesc[idx]);
  [...document.getElementsByClassName("wormholeChallengeGoal")].forEach((ele, idx) => ele.innerHTML = game.wormholeChallengeProgress[idx] == 10 ? `Record: ${game.challengeRecord[idx]} QL` : `Goal: ${dNotation(calcChallengeGoal(idx), 4, 0)} QL`);
  $("#exitChallenge").style.display = game.challengeEntered == -1 ? "none" : "block";
}
function calcSingularity(dt) {
  for (var i in singularityBoostsBase) singularityBoosts[i] = D(singularityBoostsBase[i]);
  for (var i in game.singularityGrid) game.singularityGrid[i].update(dt);
  for (var i in mergerWorks) mergerWorks[i] = [...new Set(mergerWorks[i])];
  if (game.achievements.includes(33)) game.singularityPower = game.singularityPower.add(calcSingularityPowerGain().mul(game.quantumUpgradeBought.includes('77')?calcRealDt(dt):dt).div(10));
  if (game.challengeEntered != -1) {
    game.challengeRecord[game.challengeEntered] = D.max(game.challengeRecord[game.challengeEntered], game.quantumLab);
    if (game.quantumLab.gte(calcChallengeGoal(game.challengeEntered))) {
      if (game.wormholeChallengeProgress[game.challengeEntered] < 10) {
        game.wormholeChallengeProgress[game.challengeEntered]++;
        game.singularityPower = game.singularityPower.add(1);
        commandAppend(`Challenge Done! (x${game.wormholeChallengeProgress[game.challengeEntered]-1})`, 30, 1);
        if (!game.achievements.includes(29)) {
          game.challengeEntered = -1;
          singularityReset();
        }
      }
    }
  }
}
function renderGrid() {
  var unlockedBool = game.singularityPower.gte(1) || game.t5resets.gte(1);
  $("#singularityGridWarp").style.display = (unlockedBool ? "block" : "none");
  if (unlockedBool) {
    $("#singularityGridOutInnerWarp").style.setProperty("--s", Math.min($("#singularityGridOutWarp").offsetWidth, $("#singularityGridOutWarp").offsetHeight) + 'px');
    $("#singularityGridOutInnerWarp").style.marginTop = Math.max(0, ($("#singularityGridOutWarp").offsetHeight-$("#singularityGridOutInnerWarp").offsetHeight)/2) + 'px';
    [...document.getElementsByClassName("singularityGridBlock")].forEach((ele, idx) => {ele.classList[singularityGridIdx[idx]>calcGridOpened()?"add":"remove"]("disabled")});
    for (let i = 0, l = gridInnerElements.length; i < l; i++) {
      const tempEle = gridInnerElements[i];
      var thisMachine = game.singularityGrid[i%5 + '' + Math.floor(i/5)];
      if (typeof thisMachine != "undefined") {
        var tempObj = singularityMachineData[thisMachine.type];
        tempEle[0].innerHTML = thisMachine.tier;
        tempEle[1].innerHTML = tempObj.name;
        tempEle[2].innerHTML = dNotation(thisMachine.value, 2, 2);
        tempEle[3].style.setProperty("--arrowState", thisMachine.rotate);
        tempEle[0].style.display = typeof tempObj.hasTier == "undefined" || tempObj.hasTier == 1 ? "block" : "none";
        tempEle[1].style.display = typeof tempObj.hasName == "undefined" || tempObj.hasName == 1 ? "block" : "none";
        tempEle[2].style.display = typeof tempObj.hasValue == "undefined" || tempObj.hasValue == 1 ? "block" : "none";
        tempEle[3].style.display = typeof tempObj.hasArrow == "undefined" || tempObj.hasArrow == 1 ? "block" : "none";
        tempEle[3].style.setProperty("--cCol", tempObj.color);
      } else {
        for (var j = 0; j < 4; j++) tempEle[j].style.display = "none";
      }
    }
    [...document.getElementsByClassName("singularityGridMachines")].forEach((ele, idx) => {
      var machineHave = getSingularityMachineHave(machineIdx[idx]);
      ele.style.display = machineHave < 1 ? "none" : "block";
      ele.classList[selectedMachine==idx?"add":"remove"]("selected");
    });
    [...document.getElementsByClassName("singularityGridMachineTxtQuantity")].forEach((ele, idx) => {
      var machineHave = getSingularityMachineHave(machineIdx[idx]);
      ele.innerHTML = machineHave-clacMachineUsed(machineIdx[idx]);
    });
    renderGridSideInfo();
  } else {
    game.singularityGrid = {};
  }
}
function singularityMachineChanged() {
  for (var i in game.singularityGrid) game.singularityGrid[i].value = D(1);
  mergerWorks = {};
}
function getSingularityMachineHave(name) {
  if (gridTestMode) return 25;
  if (challengeIdx.includes(name)) {
    return game.wormholeChallengeProgress[singularityMachineData[name].challengeIdx]+(name=="MoneyBoost");
  }
  switch (name) {
    case "Incrementer":
      return 2+calcChallengeDone();
    case "Output":
      return 1;
    case "Merger":
      return game.achievements.includes(33)*2;
  }
  return 0;
}
function wormholeChallengeEnter(idx) {
  if (game.challengeEntered == -1) {
    if (!canJoinWormholeChallenge() || !(calcChallengeDone() > 10 || confirm(`Do you want to enter wormhole challenge?\nEntering will perform Singularity reset without SP`))) return;
    game.challengeTime = new Date().getTime();
    game.challengeEntered = idx;
    game.quantumUpgradeBought = [];
    singularityReset();
   if (game.achievements.includes(32) && game.wormholeChallengeProgress[game.challengeEntered] != 10) game.quantumLab = D.min(game.maxQuantumLab, calcChallengeGoal(idx).div(2)).floor(0);
  }
}
function renderSingularityInfo() {
  $("#singularityInfo").style.display = game.challengeEntered != -1 ? "block" : "none";
  if (game.challengeEntered != -1) $("#singularityInfo").innerHTML = `In ${singularityMachineData[challengeIdx[game.challengeEntered]].name} Challenge x${game.wormholeChallengeProgress[game.challengeEntered]} - QL ${dNotation(game.quantumLab, 4, 0)}/${dNotation(calcChallengeGoal(game.challengeEntered), 4, 0)}`;
}

// dom
function singularityGridClick(x, y, side='l') {
  if (singularityGridIdx[x+y*5] > calcGridOpened() || !gridEditing) return;
  var thisMachine = game.singularityGrid[x + '' + y];
  var thisName = machineIdx[selectedMachine];
  var machineHave = getSingularityMachineHave(thisName);
  f1: if (side == "l") {
    if (typeof thisMachine == "undefined") {
      if (selectedMachine == -1 || machineHave-clacMachineUsed(thisName) < 1 || calcProcessLeft() < 1) break f1;
      game.singularityGrid[x + '' + y] = new SingularityMachine({position: {x: x, y: y}, rotate: 0, tier: 0, type: thisName, value: D(1)});
      if (machineHave-clacMachineUsed(thisName) < 1) selectedMachine = -1;
      singularityMachineChanged();
    } else if (thisName == thisMachine.type) {
      for (let i = 0; i < 1+(keyDowns[16]?1:0)*8; i++) {
        if (machineHave-clacMachineUsed(thisName) < 1 || calcProcessLeft() < 1 || thisMachine.tier >= 9) break f1;
        game.singularityGrid[x + '' + y].tier++;
        if (machineHave-clacMachineUsed(thisName) < 1) selectedMachine = -1;
      }
    } else {
      thisMachine.rotate = (thisMachine.rotate+1)%4;
      singularityMachineChanged();
    }
  } else {
    if (typeof game.singularityGrid[x + '' + y] == "undefined") break f1;
    delete game.singularityGrid[x + '' + y];
    singularityMachineChanged();
  }
}
function singularityGridDown(x, y) {
  documentHold = 1;
  if (documentHold) gridHold = {x: x, y: y};
}
function singularityGridOver(x, y) {
  if (typeof gridHold != "undefined" && !(gridHold.x == x && gridHold.y == y)) {
    var tempDeg = (Math.atan2(x - gridHold.x, y - gridHold.y)*2/Math.PI+4)%4;
    if (tempDeg%2 == 1) tempDeg = (tempDeg+2)%4;
    if (typeof game.singularityGrid[gridHold.x + '' + gridHold.y] != "undefined") {
      game.singularityGrid[gridHold.x + '' + gridHold.y].rotate = Math.floor(tempDeg);
      singularityMachineChanged();
    }
    gridHold = {x: x, y: y};
  }
  gridOn = {x: x, y: y};
  renderGridSideInfo();
}
function singularityGridOut() {
  gridOn = undefined;
  renderGridSideInfo();
}
function renderGridSideInfo() {
  var thingToWrite = "";
  var thisMachine = typeof gridOn == "undefined" ? undefined : game.singularityGrid[gridOn.x + '' + gridOn.y];
  if (typeof thisMachine != "undefined") {
    var thisData = singularityMachineData[thisMachine.type];
    thingToWrite += `Name: ${singularityMachineData[thisMachine.type].name}`;
    if (thisMachine.type != "Merger") {
      if (thisData.hasTier != false) thingToWrite += `<br>Tier: ${dNotation(thisMachine.tier, 0, 0)} / 9`;
      if (thisData.hasValue != false) thingToWrite += `<br>Value: ${dNotation(thisMachine.value, 4, 2)}`;
      if (thisData.hasValue != false) thingToWrite += `<br>> Power: ${dNotation(thisMachine.getPower(), 4, 2)}`;
      if (thisData.hasBoost) thingToWrite += `<br>&nbsp;> Boost: ${thisMachine.getBoostString()}`;
    } else if (typeof mergerWorks[gridOn.x + '' + gridOn.y] != "undefined") {
      var m = [...new Set(mergerWorks[gridOn.x + '' + gridOn.y])];
      thingToWrite += "<br><br>Boost List<br>---------------";
      for (var i = 0; i < m.length; i++) {
        var tempMachine = game.singularityGrid[m[i]];
        if (tempMachine.type == "Merger") continue;
        var tempData = singularityMachineData[tempMachine.type];
        if (tempData.hasBoost != false) thingToWrite += `<br><span style="color: ${tempData.color}; text-shadow: 0 0 1vh ${tempData.color}; filter: brightness(1.8);">${tempMachine.getBoostString(m.concat([gridOn.x + '' + gridOn.y]))}</span>`;
      }
    }
    if (gridEditing) {
      thingToWrite += "<br>";
      if (selectedMachine != thisData.idx && thisData.hasArrow != false) {
        thingToWrite += `<br>LM: rotate`;
      } else if (thisData.hasTier != false) {
        thingToWrite += `<br>LM: upgrade<br>Shift+LM: max upgrade`;
      }
      thingToWrite += `<br>RM: remove`;
    }
  } else if (typeof gridOn != "undefined") {
    thingToWrite += "Nothing here";
    if (selectedMachine != -1 && gridEditing) thingToWrite += `<br><br>LM: place`;
  } else {
    thingToWrite += "Boost List<br>---------------<br>";
    for (var i in singularityBoosts) thingToWrite += `<span style="color: ${singularityMachineData[i].color}; text-shadow: 0 0 1vh ${singularityMachineData[i].color}; filter: brightness(1.8) grayscale(${singularityBoosts[i].eq(singularityBoostsBase[i])?1:0});">${singularityMachineData[i].name} ${singularityMachineData[i].boostType == "mul" ? "x" : "+"}${dNotation(singularityBoosts[i], 4, 2)}</span><br>`;
  }
  $("#singularityEffects").innerHTML = thingToWrite;
}
function singularityMachineSelect(idx) {
  if (getSingularityMachineHave(machineIdx[idx])-clacMachineUsed(machineIdx[idx]) < 1) return;
  selectedMachine = selectedMachine != idx ? idx : -1;
}

// calc
function calcSingularityPowerGain(calcNext=0, baseRes=game.quantumLab) {
  var tempSpGain = baseRes.sub(70).div(10); // div
  var tempSpGain2 = tempSpGain.floor(0).add(1).mul(tempSpGain.floor(0)).div(2).floor(0); // sum
  var tempSpGain3 = tempSpGain2.add(tempSpGain.mod(1).mul(tempSpGain.add(1)).floor(0)); // offset
  if (calcNext) return D.max(80, baseRes.div(10).floor(0).mul(10).add(D(10).div(tempSpGain.floor(0).add(1)).mul(tempSpGain3.sub(tempSpGain2).add(1)).ceil(0))); // retuen calc next
  var tempSpGain4 = D.max(0, tempSpGain3).floor(0); // floor, fix before mul

  // multiplies
  if (game.achievements.includes(34)) tempSpGain4 = tempSpGain4.mul(4);
  if (game.quantumUpgradeBought.includes('72')) tempSpGain4 = tempSpGain4.mul(D(10).mul((Math.max(0, new Date().getTime() - game.singularityTime)/1000)**0.6));
  if (game.quantumUpgradeBought.includes('73')) tempSpGain4 = tempSpGain4.mul(D(2).pow(D(game.quantumLab).pow(1/3)));
  if (game.quantumUpgradeBought.includes('74')) tempSpGain4 = tempSpGain4.mul(game.challengeRecord.reduce((a, b) => a.mul(b.add(1)), D(1)).pow(1/4));
  if (game.quantumUpgradeBought.includes('76')) tempSpGain4 = tempSpGain4.mul(calcMultiProcess());
  tempSpGain4 = tempSpGain4.mul(calcIpUpgradeEffect(3));

  // return SP gain
  if (baseRes.lt(80)) return D(0);
  return tempSpGain4.floor(0);
}
function calcGridOpened() {
  if (gridTestMode) return 25;
  var tempSpace = Math.min(25, 4+Math.floor((calcChallengeDone()+3)/4));
  if (game.achievements.includes(33)) tempSpace += 2;
  return tempSpace;
}
function clacMachineUsed(name) {
  if (typeof name == "number") name = machineIdx[name];
  var tempUsed = 0;
  for (var i in game.singularityGrid) if (game.singularityGrid[i].type == name) tempUsed += game.singularityGrid[i].tier+1;
  return tempUsed;
}
function calcGridMult() {
  var mul = D(1);
  mul = mul.mul(game.singularityPower.pow(4).pow(game.quantumUpgradeBought.includes('75')?D(1).add(game.singularityPower.add(1).log(10).pow(0.8)):1));
  if (game.quantumUpgradeBought.includes('71')) mul = mul.mul(D(1.01).pow(game.quantumLab).mul(game.quantumLab.pow(2)).add(1));
  return mul;
}
function calcWormholeChallengeReq() {
  return Math.floor(2+calcChallengeDone()**1.2)*0;
}
function canJoinWormholeChallenge() {
  return game.t4resets.gte(calcWormholeChallengeReq());
}
function canEnterWoemholeChallenge() {
  return game.t4resets.gte(calcWormholeChallengeReq());
}
function calcRealDt(dt=0) {
  return D(dt).mul(singularityBoosts.SpeedBoost).mul(game.achievements.includes(37)?2:1);
}
function calcChallengeDone() {
  return game.wormholeChallengeProgress.reduce((a, b) => a + b, 0);
}
function calcChallengeGoal(idx, lv=game.wormholeChallengeProgress[idx]) {
  var goal = D(Infinity);
  switch (idx) {
    case 0:
      goal = D(1).add(lv**2);
      break;
    case 1:
      goal = D(1).add(lv**2);
      break;
    case 2:
      goal = D(2).mul(lv+1);
      break;
    case 3:
      goal = D(3).mul((lv/2+1)**2);
      break;
    case 4:
      goal = D(10).add(lv**2);
      break;
    case 5:
      goal = D(50).add(10*lv);
      break;
    case 6:
      goal = D(73).add((10+lv)*lv);
      break;
    case 7:
      goal = D(202).mul(lv/10+1);
      break;
  }
  if (lv >= 5) goal = goal.pow(lv/25+0.8);
  if (game.achievements.includes(29)) goal = goal.sub(2);
  if (lv == 10) goal = D(Infinity);
  return D.max(1, goal.floor(0));
}
function calcChallengeTimeLeft() {
  return (game.challengeTime - new Date().getTime())/1000 + 60*30;
}
function calcMilestoneDone() {
  var tempDone = D.max(D(game.singularityPower).div(2).log(2).add(1), 0).floor(0).toNumber();
  tempDone = Math.min(game.achievements.includes(30)?7:6, tempDone);
  return tempDone;
}

// SingularityMachine
class SingularityMachine {
  constructor(attrs={}) {
    this.position = attrs.position; // form: {x: 0, y: 0}
    this.rotate = attrs.rotate%4; // 2 = top, 3 = right, 0 = down, 1 = left
    this.tier = attrs.tier;
    this.type = attrs.type; // refer machineIdx
    this.value = attrs.value;
  }

  update (dt) {
    if (isProcessExceed() && !game.quantumUpgradeBought.includes('47')) return 0;
    var power = this.getPower();
    if (typeof this.getPointedMachine() == "undefined") return 0;
    switch (this.type) {
      case "Incrementer":
      this.getPointedMachine().value = this.getPointedMachine().value.add(power.mul(calcRealDt(dt)));
        break;
      case "Merger":
        var m = [...new Set(mergerWorks[this.position.x + '' + this.position.y])];
        if (this.getPointedMachine().type == "Output" && typeof m != "undefined") {
          for (var i = 0; i < m.length; i++) {
            var tempMachine = game.singularityGrid[m[i]];
            var tempData = singularityMachineData[tempMachine.type];
            if (typeof singularityBoosts[tempMachine.type] == "undefined") continue;
            singularityBoosts[tempMachine.type] = singularityBoosts[tempMachine.type][tempData.boostType](tempMachine.getBoost(m.concat([this.position.x + '' + this.position.y])));
          }
          break;
        }
        // no break
      default:
        switch (this.getPointedMachine().type) {
          case "Output":
            if (typeof singularityBoosts[this.type] != "undefined") {
              singularityBoosts[this.type] = singularityBoosts[this.type][singularityMachineData[this.type].boostType](this.getBoost());
            } else {
              return 0;
            }
            break;
          case "Merger":
            var p = this.getPointed();
            if (typeof mergerWorks[p] == "undefined") mergerWorks[p] = [];
            if (this.type != "Merger") {
              if (!singularityMachineData[this.type].hasBoost) return 0;
              mergerWorks[p].push(this.position.x + '' + this.position.y);
            } else if (typeof mergerWorks[this.position.x + '' + this.position.y] != "undefined") {
              mergerWorks[p] = [...new Set(mergerWorks[p].concat(mergerWorks[this.position.x + '' + this.position.y]).concat([this.position.x + '' + this.position.y]))];
            }
            break;
        }
    }
    return 1;
  }

  getInteracts () {
    var interactMachines = [];
    for (var i = -1; i < 2; i++) {
      for (var j = -1; j < 2; j++) {
        if (i == 0 && j == 0) continue;
        var tempIMachine = game.singularityGrid[(this.position.x+i) + '' + (this.position.y+j)];
        if (typeof tempIMachine == "undefined") continue;
        interactMachines.push(tempIMachine);
      }
    }
    return interactMachines;
  }

  getPointed = () => {return this.rotate%2 ? (this.position.x+(this.rotate-2)) + '' + this.position.y : this.position.x + '' + (this.position.y-(this.rotate-1))};
  getPointedMachine = () => {return game.singularityGrid[this.getPointed()]};

  getPower (mergerExtra=[]) {
    var tempValue = this.value;
    if (mergerExtra) for (var i = 0, l = mergerExtra; i < mergerExtra.length; i++) if (game.singularityGrid[mergerExtra[i]].type == "Merger") tempValue = tempValue.add(game.singularityGrid[mergerExtra[i]].value);
    var power = tempValue.mul(D(1e4).pow(this.tier));
    var iMachines = this.getInteracts();
    if (this.type != "Booster") for (var i = 0, l = iMachines.length; i < l; i++) if (iMachines[i].type == "Booster") power = power.mul(iMachines[i].getPower());
    power = power.pow(this.tier/15+0.5);
    power = power.mul(calcGridMult());
    return power;
  }

  getBoost(mergerExtra=[]) {
    var power = this.getPower(mergerExtra);
    var value = this.value;
    var effect = D(0);
    switch (this.type) {
      case "BaseBoost":
        effect = power.log(10);
        break;
      case "DigitBoost":
        effect = power.log(5);
        break;
      case "MoneyBoost":
        effect = power.mul(power.add(1).log(10)).mul(value.add(1).log(10).pow(2)).add(1);
        break;
      case "RpBoost":
        effect = power.div(1e5).add(1).log(10).pow(2).add(1);
        break;
      case "ResearchSpeedBoost":
        effect = power.pow(0.8).add(1);
        break;
      case "SpeedBoost":
        effect = power.log(10).pow(0.7).add(1);
        break;
      case "QubitBoost":
        effect = power.pow(0.75).add(1);
        break;
    }
    return effect;
  }
  getBoostString(mergerExtra=[]) {
    var boostNum = this.getBoost(mergerExtra);
    var tempObj = singularityMachineData[this.type];
    return tempObj.name + ' ' + (tempObj.boostType == "mul" ? 'x' : '+') + dNotation(boostNum, 4, 2);
  }
}
