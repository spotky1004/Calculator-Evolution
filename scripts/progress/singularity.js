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
    Merger: {hasTier: false, hasValue: false, color: "#000000", name: "Merger", hasBoost: false, idx: 9},
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
    "Divide max process by 10"
  ]

  // singularityGridBlock
  for (var i = 0; i < 25; i++) {
    var gridNode = document.createElement("span");
    gridNode.classList.add("singularityGridBlock");
    gridNode.onclick = new Function(`singularityGridClick(${i%5}, ${Math.floor(i/5)}, "l")`);
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
  for (var i in singularityBoostsBase) singularityBoosts[i] = D(singularityBoostsBase[i]);
})();

// basic
function singularity() {
  if (game.quantumLab.lt(80)) return;
  if (game.t4resets.lt(1) && !confirm("If you go singularity you'll lose everything that you have!\nAre you sure to reset all progress?")) return;

  game.t4resets = game.t4resets.add(1);
  game.singularityPower = game.singularityPower.add(calcSingularityPowerGain());
  singularityReset();

  commandAppend(`Go singularity (${ordNum(game.t4resets)})`, (30+game.t4resets.toNumber()*3)%360, 1);
}
function renderSingularity() {
  $("#singularityButton").className = game.quantumLab.gte(80) ? "" : "disabled";
  $("#singularityDesc").innerHTML = game.quantumLab.gte(80) ? `If you go singularity now, you'll get <b>${dNotation(calcSingularityPowerGain())} SP</b> ${game.quantumLab.lt(500) ? `(next SP at ${calcSingularityPowerGain(1)} QL)`: ''}` : 'You need 80 Quantum Labs to go Singularity';
  $("#singularityDesc").innerHTML += `<br>You have <b><span style="color: #fff;">${dNotation(game.singularityPower, 4, 0)} Singularity Power</span></b>`;
  $("#singularityDesc").innerHTML += `<br>Each SP increases Multi Process by 4 (tot ${Math.floor(Math.min(25/4, game.singularityPower.valueOf())*4)}, cap at 25)`
  $("#singularityDesc").innerHTML += `<br>And boosts grid machine Power by x${dNotation(game.singularityPower.pow(4), 4, 0)}`;
  $("#singularityDesc").innerHTML += `<br>Have ${3**calcMilestoneDone()*2} SP to retain Keep ${romanize(calcMilestoneDone()+1).toUpperCase()}`;
  $("#wormholeChallengeWarp").style.display = game.t4resets.gte(2) ? "block" : "none";
  $("#gridReq").innerHTML = `Complete ${4-(calcChallengeDone()+3)%4} more challenge to unlock ${ordNum(calcGridOpened()+1)} Grid space`;
  //$("#challengeReq").innerHTML = `Go singularity ${dNotation(game.t4resets.toNumber(), 4, 0)}/${calcWormholeChallengeReq()} times to enter Challenge (Increases per challenge complete)`;
  [...document.getElementsByClassName("wormholeChallengeName")].forEach((ele, idx) => ele.innerHTML = `${singularityMachineData[challengeIdx[idx]].name} Challenge (${game.wormholeChallengeProgress[idx]}/10)`);
  [...document.getElementsByClassName("wormholeChallenge")].forEach((ele, idx) => ele.style.setProperty("--progress", `${10*game.wormholeChallengeProgress[idx]}%`));
  [...document.getElementsByClassName("wormholeChallengeEffect")].forEach((ele, idx) => ele.innerHTML = challengeDesc[idx]);
  [...document.getElementsByClassName("wormholeChallengeGoal")].forEach((ele, idx) => ele.innerHTML = `Goal: ${dNotation(calcChallengeGoal(idx), 4, 0)} QL`);
  $("#exitChallenge").style.display = game.challengeEntered == -1 ? "none" : "block";
}
function calcSingularity() {
  for (var i in singularityBoostsBase) singularityBoosts[i] = D(singularityBoostsBase[i]);
  for (var i in game.singularityGrid) game.singularityGrid[i].update();
  if (game.challengeEntered != -1) {
    if (game.quantumLab.gte(calcChallengeGoal(game.challengeEntered))) {
      if (game.wormholeChallengeProgress[game.challengeEntered] < 10) game.wormholeChallengeProgress[game.challengeEntered]++;
      game.singularityPower = game.singularityPower.add(1);
      game.challengeEntered = -1;
      singularityReset();
      commandAppend("Challenge Done!", 30, 1);
    } else if (calcChallengeTimeLeft() < 0) {
      /*game.challengeEntered = -1;
      singularityReset();
      commandAppend("Challenge Fail...", 30, 1);*/
    }
  }
}
function renderGrid() {
  $("#singularityGridWarp").style.display = (game.singularityPower.gte(1) ? "block" : "none");
  if (game.singularityPower.gte(1)) {
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
        tempEle[2].innerHTML = dNotation(thisMachine.value, 3, 2);
        tempEle[3].style.setProperty("--arrowState", thisMachine.rotate);
        tempEle[0].style.display = typeof tempObj.hasTier == "undefined" || tempObj.hasTier == 1 ? "block" : "none";
        tempEle[1].style.display = typeof tempObj.hasName == "undefined" || tempObj.hasName == 1 ? "block" : "none";
        tempEle[2].style.display = typeof tempObj.hasValue == "undefined" || tempObj.hasValue == 1 ? "block" : "none";
        tempEle[3].style.display = typeof tempObj.hasArrow == "undefined" || tempObj.hasArrow == 1 ? "block" : "none";
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
}
function getSingularityMachineHave(name) {
  if (challengeIdx.includes(name)) {
    return game.wormholeChallengeProgress[singularityMachineData[name].challengeIdx]+(name=="MoneyBoost");
  }
  switch (name) {
    case "Incrementer":
      return 2+calcChallengeDone();
    case "Output":
      return 1;
  }
  return 0;
}
function wormholeChallengeEnter(idx) {
  if (game.challengeEntered == -1) {
    if (!canJoinWormholeChallenge() || !(calcChallengeDone() > 10 || confirm(`Do you want to enter wormhole challenge?\nEntering will preform Singularity reset without SP`))) return;
    game.challengeTime = new Date().getTime();
    game.challengeEntered = idx;
    singularityReset();
  }
}
function renderSingularityInfo() {
  $("#singularityInfo").style.display = game.challengeEntered != -1 ? "block" : "none";
  $("#singularityInfo").innerHTML = `In Challenge ${game.challengeEntered+1} (QL ${dNotation(game.quantumLab, 4, 0)}/${dNotation(calcChallengeGoal(game.challengeEntered), 4, 0)})`;
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
      singularityMachineChanged();
    } else if (thisName == thisMachine.type) {
      for (let i = 0; i < 1+keyDowns[16]*8; i++) {
        if (machineHave-clacMachineUsed(thisName) < 1 || calcProcessLeft() < 1 || thisMachine.tier >= 9) break f1;
        game.singularityGrid[x + '' + y].tier++;
      }
    } else {
      thisMachine.rotate = (thisMachine.rotate+1)%4;
      singularityMachineChanged();
    }
  } else {
    delete game.singularityGrid[x + '' + y];
    singularityMachineChanged();
  }
}
function singularityGridOver(x, y) {
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
    if (thisData.hasTier != false) thingToWrite += `<br>Tier: ${dNotation(thisMachine.tier, 0, 0)} / 9`;
    if (thisData.hasValue != false) thingToWrite += `<br>Value: ${dNotation(thisMachine.value, 4, 2)}`;
    if (thisData.hasValue != false) thingToWrite += `<br>> Power: ${dNotation(thisMachine.getPower(), 4, 2)}`;
    if (thisData.hasBoost) thingToWrite += `<br>&nbsp;> Boost: ${thisMachine.getBoostString()}`;
    if (gridEditing) {
      thingToWrite += selectedMachine != thisData.idx ? `<br><br>LM: rotate` : `<br><br>LM: upgrade<br>Shift+LM: max upgrade`;
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
  if (game.achievements.includes(30)) tempSpGain4 = tempSpGain4.mul(4);

  return tempSpGain4; // return SP gain
}
function calcGridOpened() {
  return Math.min(25, 4+Math.floor((calcChallengeDone()+3)/4));
}
function clacMachineUsed(name) {
  if (typeof name == "number") name = machineIdx[name];
  var tempUsed = 0;
  for (var i in game.singularityGrid) if (game.singularityGrid[i].type == name) tempUsed += game.singularityGrid[i].tier+1;
  return tempUsed;
}
function calcGridMult() {
  var mul = D(1);
  mul = mul.mul(game.singularityPower.pow(4));
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
function calcRealTgain() {
  return tGain*singularityBoosts.SpeedBoost.toNumber()*(game.achievements.includes(31)?2:1);
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
      goal = D(10).add(lv**3);
      break;
    case 5:
      goal = D(50).add(10*lv);
      break;
    case 6:
      goal = D(80).add((10+lv)*lv);
      break;
    case 7:
      goal = D(Infinity).add((7+lv**2)*lv);
      break;
  }
  if (lv >= 5) goal = goal.pow(lv/25+0.8);
  if (game.achievements.includes(29)) goal = goal.sub(2);
  return D.max(1, goal.floor(0));
}
function calcChallengeTimeLeft() {
  return (game.challengeTime - new Date().getTime())/1000 + 60*30;
}
function calcMilestoneDone() {
  return D.max(D(game.singularityPower).div(2).log(3).add(1), 0).floor(0).toNumber();
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

  update () {
    if (isProcessExceed()) return 0;
    var power = this.getPower();
    if (typeof this.getPointedMachine() == "undefined") return 0;
    switch (this.type) {
      case "Incrementer":
      this.getPointedMachine().value = this.getPointedMachine().value.add(power.mul(calcRealTgain()));
        break;
      default:
        if (this.getPointedMachine().type == "Output" && typeof singularityBoosts[this.type] != "undefined") {
          singularityBoosts[this.type] = singularityBoosts[this.type][singularityMachineData[this.type].boostType](this.getBoost())
        } else {
          return 0;
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

  getPower () {
    var power = this.value.mul(D(1e4).pow(this.tier));
    var iMachines = this.getInteracts();
    if (this.type != "Booster") for (var i = 0, l = iMachines.length; i < l; i++) if (iMachines[i].type == "Booster") power = power.mul(iMachines[i].getPower());
    power = power.pow(this.tier/20+0.5);
    power = power.mul(calcGridMult());
    return power;
  }

  getBoost() {
    var power = this.getPower();
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
  getBoostString() {
    var boostNum = this.getBoost();
    var tempObj = singularityMachineData[this.type];
    return tempObj.name + ' ' + (tempObj.boostType == "mul" ? 'x' : '+') + dNotation(boostNum, 4, 2);
  }
}
