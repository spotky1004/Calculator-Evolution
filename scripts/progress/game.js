(function(){
  siSymbol = ['', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
  tabNow = 0;
  shopItems = [
    // Base_Increaser.exe
    [
      {
        "itemName": "Base_Increaser.exe",
        "itemCost": '0.03',
        "itemDesc": "Increase your base to store more number",
      },
      {
        "itemName": "Base_Increaser_2.0.exe",
        "itemCost": '1.004e33',
        "itemDesc": "Can increase base with only 12 digits",
      },
      {
        "itemName": "Base_Increaser_3.0.exe",
        "itemCost": '1.1111e45',
        "itemDesc": "Extend base cap based on Digits",
      },
      {
        "itemName": "Base_Increaser_4.0.exe",
        "itemCost": '8.421e100',
        "itemDesc": "Increase base won't reset memory",
      },
      {
        "itemName": "Base_Increaser_5.0.exe",
        "itemCost": '7.7777e200',
        "itemDesc": "Increase base won't reset anything",
      },
    ],
    // Miner.exe
    [
      {
        "itemName": "Miner_2.0.exe",
        "itemCost": '1e6',
        "itemDesc": "Multiply mine power by Digits",
      },
      {
        "itemName": "Miner_3.0.exe",
        "itemCost": '2.4680e55',
        "itemDesc": "Multiply mine power by Research Point",
      },
      {
        "itemName": "Miner_4.0.exe",
        "itemCost": '2.2222e179',
        "itemDesc": "Multiply mine power by Overclock Power",
      },
      {
        "itemName": "Miner_5.0.exe",
        "itemCost": '4.04e1000',
        "itemDesc": "Each Qubit multiply Mine Power by x2.4",
      }
    ],
    // Data_Holder.exe
    [
      {
        "itemName": "Data_Holder.exe",
        "itemCost": '2e15',
        "itemDesc": "Keep your Base and Programs on reboot",
      },
      {
        // dino ref.!
        "itemName": "Data_Holder_2.0.exe",
        "itemCost": '1.997e80',
        "itemDesc": "Keep your Digit and Number on reboot",
      },
      {
        "itemName": "Data_Holder_3.0.exe",
        "itemCost": '0.911e90',
        "itemDesc": "Keep your Money and Upgrade on reboot",
      },
    ],
    // Auto_Upgrader.exe
    [
      {
        "itemName": "Auto_Upgrader.exe",
        "itemCost": '3.21e30',
        "itemDesc": "Buy CPU upgrade automatically",
      }
    ],
    // Memory.exe
    [
      {
        "itemName": "Memory_2.0.exe",
        "itemCost": '4.4444e70',
        "itemDesc": "Increase digit won't reset anything",
      },
    ]
  ];

  hardResetTimeout = 0;
  hardResetConfrim = 100;

  tps = [];
  tpsRecording = 0;
  lastTpsRecord = new Date().getTime();

  bugfixerConfirm = 1;

  for (let i = 0; i < 7; i++) {
    var programStatusNode = document.createElement("span");
    programStatusNode.classList.add("programStatusNode");
    programStatusNode.innerHTML = i+1;
    $("#programStatusArea").append(programStatusNode);
  }

  documentHold = 0;
  document.onmousedown = function() {documentHold = 1};
  document.onmouseup = function() {documentHold = 0; gridHold = undefined;};

  // theme init
  themeUrls = ['./themes/none.css', './themes/compact.css', './themes/aqua.css', './themes/magenta.css'];
  themeName = ["Default", "Compact", "Aqua", "Magenta (by RedMountain)"];
  var link = document.createElement( "link" );
  link.id = "compactCssElement";
  link.href = `./themes/none.css`;
  link.type = "text/css";
  link.rel = "stylesheet";
  link.media = "screen,print";
  document.getElementsByTagName( "head" )[0].appendChild( link );

  // notation init
  notationNames = ["Default", "Logarithm"];

  gamePaused = 0;
})();

function renderBasic() {
  $("#basedNumber").innerHTML = formatWithBase(game.number, game.base, game.digits, 1, 60);
  $("#money").innerHTML = dNotation(game.money, 5);
  tempRes = ` <span style="filter: grayscale(${!game.programActive[1]*1})">(+${dNotation(calcMoneyGain(), 2, 2).padEnd(7, 'B').replace(/B/g, "&nbsp;")}$/s)</span>`;
  if (game.t2toggle) tempRes += ` | ${dNotation(game.researchPoint, 4, 0)} RP\n`;
  if (game.t3toggle) tempRes += `
   | ${(!keyDowns[17] ?
     dNotation(game.qubit, 4, 0) + " Qubit":
     `${game.qubit.sub(calcUsedQubit())}/${game.qubit} Qubit (next Qubit in ${timeNotation(D(3).pow(game.qubit.sub(calcChallengeDone()).add(1)).sub(game.qubitProgress).div(calcQubitSpeed()))})`
     )} , 
   ${dNotation(game.quantumLab, 4, 0)} Lab\n`;
  // I'm lazy (just copied that from quantum.js, will fix) :v
  if (game.t4toggle) tempRes += ` | ${dNotation(game.singularityPower, 4, 0)} SP\n`;
  if (game.t5toggle) tempRes += ` | ${dNotation(game.infinityPoint, 4, 0)} IP\n`;
  $("#otherRes").innerHTML = tempRes;
  $("#memoryDigit").innerHTML = ("").padStart(Math.min(80, dNum(game.mDigits)-dNum(game.digits)), 0);
  $("#numberBase").innerHTML = game.base;

  // tabs
  $('#mainNav > .tabNav:nth-child(7)').style.display = (game.t3toggle ? 'inline-block' : 'none');
  $('#mainNav > .tabNav:nth-child(7)').classList[calcQuantumLabGain().gte(1)?"add":"remove"]("available")
  $('#mainNav > .tabNav:nth-child(8)').style.display = (game.t4toggle ? 'inline-block' : 'none');
  $('#mainNav > .tabNav:nth-child(9)').style.display = (game.t5toggle ? 'inline-block' : 'none');

  commandFloat();

  // programStatusArea
  $("#programStatusArea").style.display = game.t3toggle ? "block" : "none";
  [...document.getElementsByClassName("programStatusNode")].forEach((ele, idx) => {ele.classList[game.programActive[idx]?"add":"remove"]("activated")});
  $("#programStatusProcess").innerHTML = `${calcMultiProcess()-calcProcessLeft()}/${calcMultiProcess()}`;

}
function renderModule() {
  $("#processes").innerHTML = `Process ${calcProcessActive()}/${calcMultiProcess()}`;

  // program
  var programPoint = [-1, 1, 4, 0, 2, 3, -1];
  var defNames = ["", "Miner.exe", "Memory.exe", "Increment.exe", "Data_Holder.exe", "Auto_Upgrader.exe", ""];
  for (var i = 0; i < 7; i++) {
    $(".program:nth-of-type(" + (i+1) + ")").className = ((game.programActive[i]) ? "program active" : "program") + (i==6 ? " permanent": "");
    if (programPoint[i] != -1) {
      if (game.shopBought[programPoint[i]]-1 == -1) {
        $(".program:nth-of-type(" + (i+1) + ") > span:nth-child(2)").innerHTML = defNames[i];
        continue;
      }
      $(".program:nth-of-type(" + (i+1) + ") > span:nth-child(2)").innerHTML = shopItems[programPoint[i]][game.shopBought[programPoint[i]]-1].itemName;
    }
  }
  $(".program:nth-of-type(4)").style.display = ((game.shopBought[0]) ? "block" : "none");
  $(".program:nth-of-type(5)").style.display = ((game.shopBought[2]) ? "block" : "none");
  $(".program:nth-of-type(6)").style.display = ((game.shopBought[3]) ? "block" : "none");
  $(".program:nth-of-type(7)").style.display = ((game.researchLevel[1]>=1) ? "block" : "none");

  // grid
  renderGrid();
}
function renderShop() {
  for (var i = 0; i < 5; i++) {
    var infoObj = shopItems[i][Math.min(game.shopBought[i], shopItems[i].length-1)];
    if (typeof infoObj == "undefined") continue;
    $(".shopItem:nth-of-type(" + (i+1) + ") > .itemName").innerHTML = infoObj.itemName;
    $(".shopItem:nth-of-type(" + (i+1) + ") > .itemCost > .itemCostNum").innerHTML = dNotation(infoObj.itemCost, 4) + '$';
    $(".shopItem:nth-of-type(" + (i+1) + ") > .itemDesc").innerHTML = infoObj.itemDesc;
    $(".shopItem:nth-of-type(" + (i+1) + ")").className = ((calcShopMax()[i] == game.shopBought[i]) ? "shopItem bought" : "shopItem");
  }
  for (var i = 0; i < 5; i++) {
    $(".shopBox:nth-of-type(2) > .shopItem:nth-of-type(" + (i+1) + ") > .itemCost > .itemCostNum").innerHTML = dNotation(calcShopCost(i+5, game.shopBought[i+5]), 5);
  }
  $("#cpuHz").innerHTML = notationSI(calcCPU(), 0);
  $("#cpuSpeed").innerHTML = dNotation(calcCpuUpgradeEffect(), 4, 1);
}
function renderOption() {
  for (var i = 0; i < 3; i++) {
    $('#optionToggle' + i).className = 'optionBtn' + ((game.optionToggle[i]) ? '' : ' disabled');
  }
}
function renderBasicInfo() {
  $('#basicInfo').innerHTML = `Number: ${dNotation(game.number, 2, 0)} / ${dNotation(game.base.pow(game.digits), 2, 0)}`;
  $('#basicInfo').innerHTML += `<br>Digit: ${dNotation(game.digits, 2, 0)} / ${dNotation(calcMaxDigit(), 2, 0)} ${!singularityBoosts.DigitBoost.eq(0)?`(+${dNotation(singularityBoosts.DigitBoost.floor(0), 2, 0)})`:""}`;
  $('#basicInfo').innerHTML += `<br>Base: ${dNotation(game.base, 2, 0)} / ${dNotation(Math.max(game.base, calcMaxBase()), 2, 0)} ${!singularityBoosts.BaseBoost.eq(0)?`(+${dNotation(singularityBoosts.BaseBoost.floor(0), 2, 0)})`:""}`

}
function renderStat() {
  $("#statsText").innerHTML = `You've played this game for ${timeNotation((new Date().getTime()-game.startTime)/1000)}`;
  if (game.t2toggle) $("#statsText").innerHTML += `<br><br>You've done Reboot ${dNotation(game.t2resets, 4, 0)} times`;
  if (game.t2toggle) $("#statsText").innerHTML += `<br>You spent ${timeNotation((new Date().getTime()-game.rebootTime)/1000)} in this Reboot`;
  if (game.t3toggle) $("#statsText").innerHTML += `<br><br>You've done Quantum ${dNotation(game.t3resets, 4, 0)} times`;
  if (game.t3toggle) $("#statsText").innerHTML += `<br>You spent ${timeNotation((new Date().getTime()-game.quantumTime)/1000)} in this Quantum`;
  if (game.t4toggle) $("#statsText").innerHTML += `<br><br>You've gone Singularity ${dNotation(game.t4resets, 4, 0)} times`;
  if (game.t4toggle) $("#statsText").innerHTML += `<br>You spent ${timeNotation((new Date().getTime()-game.singularityTime)/1000)} in this Singularity`;
  if (game.t5toggle) $("#statsText").innerHTML += `<br><br>You've gone Infinity ${dNotation(game.t5resets, 4, 0)} times`;
  if (game.t5toggle) $("#statsText").innerHTML += `<br>You spent ${timeNotation((new Date().getTime()-game.t5resetTime)/1000)} in this Infinity`;
  if (game.t5toggle) $("#statsText").innerHTML += `<br>Your fast Infinity is ${timeNotation((game.t5record)/1000)} / ${dNotation(D.max(5, game.bestIp), 4, 0)} IP`;
}
function renderCalcDebugInfo() {
  $("#debugInfoArea").style.display = game.optionToggle[1] ? "block" : "none";
  if (!game.optionToggle[1]) return;
  tpsRecording++;
  if (game.tLast-lastTpsRecord > 1000) {
    lastTpsRecord = game.tLast;
    tps.push(tpsRecording);
    if (tps.length >= 10) tps.splice(0, 1);
    tpsRecording = 0;
    $("#debugInfoArea").innerHTML = "TPS: " + tps.reduce((a, b) => (a+b)/2, 0).toFixed(0);
  }
}

function goTab(num) {
  // block locked tabs
  if (!game.t3toggle && num == 5) return;
  if (!game.t4toggle && num == 7) return;
  if (!game.t5toggle && num == 8) return;

  // make, delete events
  deleteEvents(tabNow);
  makeEvents(num);

  // go to tab
  if (!rebooting || game.t3toggle) {
    for (var i = 0; i < document.getElementsByClassName('tab').length; i++) {
      $(".tab:nth-of-type(" + (i+1) + ")").style.display = "none";
    }
    $(".tab:nth-of-type(" + (num+1) + ")").style.display = num != 0 ? "block" : "flex";
    tabNow = num;
    renderAll();
  }
}
function deleteEvents(tab) {
  // TODO
}
function makeEvents(tab) {
  // TODO
}
function optionBtn(num) {
  game.optionToggle[num] ^= 1;
  switch (num) {
    case 0:
    setEffects();
      break;
  }
}
function setEffects() {
  // thanks RedMountain! :D
  $('#rebootButton').style.animation = game.optionToggle[0] ? 'rebootButtonGlow linear 8s infinite' : 'none';
  $('#rebootButton').style.color = game.optionToggle[0] ? '' : '#49d124';
  $('#rebootButton').style.textShadow = game.optionToggle[0] ? '' : '0 0 0.4vh #49d124';
  $('#rebootButton').style.backgroundColor = game.optionToggle[0] ? '' : '#2e8018';
  $('#rebootButton').style.border = game.optionToggle[0] ? '' : '0.4vh solid #49d124';
  $('#rebootButton').style.boxShadow = game.optionToggle[0] ? '' : '0 0 0 0 #2e8018 inset';
  $('body').style.setProperty('--whiteglow', game.optionToggle[0] ? 'whiteGlow ease 5s infinite' : 'none');
  $('body').style.setProperty('--color', game.optionToggle[0] ? '' : '#fff');
  $('body').style.setProperty('--shadow', game.optionToggle[0] ? '' : '0 0 2vw #fff');
}
function setTheme() {
  document.getElementById("compactCssElement").href = themeUrls[game.theme];
  document.getElementById("themeBtn").innerHTML = `Theme: ${themeName[game.theme]}`;
}
function setNotation() {
  document.getElementById("notationBtn").innerHTML = `Notation: ${notationNames[game.notation]}`;
}
function basicInits() {
  setTheme();
  setNotation();
}
function calcToggleTabs() {
  if (calcRPGain().gte(1)) game.t2toggle = 1;
  if (game.money.gte(1e80)) game.t3toggle = 1;
  if (game.quantumLab.gte(70)) game.t4toggle = 1;
  if (!game.money.isFinite() || game.t5resets.gte(1)) game.t5toggle = 1;
}
function activeProgram(num) {
  if (rebooting) return;
  if (num == 3 && !game.shopBought[0]) return;
  if (num == 4 && !game.shopBought[2]) return;
  if (num == 5 && !game.shopBought[3]) return;
  if (num == 6 && (game.programActive[6] || game.researchLevel[1]<1)) return;
  var programCount = calcProcessActive();
  if (game.programActive[num]) {
    programCount--;
  } else {
    programCount++;
  }
  if (programCount >= calcMultiProcess()+1) {
    for (var i = 5; i > -1; i--) {
      if (game.programActive[i] && i != num) {
        game.programActive[i] = 0;
        programCount--;
      }
      if (programCount < calcMultiProcess()+1) break;
    }
  }
  game.programActive[num] = !game.programActive[num];
  if (num == 6) {
    commandAppend('start overclock.exe', 140);
  } else if (game.programActive[num]) {
    commandAppend('start ' + $('.program:nth-of-type(' + (num+1) + ') > span:nth-child(2)').innerHTML);
  } else {
    commandAppend('kill ' + $('.program:nth-of-type(' + (num+1) + ') > span:nth-child(2)').innerHTML, -110);
  }
  renderModule();
}
function shopBuy(num) {
  if (game.money.gte(calcShopCost(num, game.shopBought[num])) && game.shopBought[num] < calcShopMax()[num]) {
    switch (num) {
      case 0: case 1: case 2: case 3: case 4:
      commandAppend(`buy ${shopItems[num][Math.min(game.shopBought[num], calcShopMax()[num]-1)].itemName}`);
        break;
      case 5:
      if (!game.t3toggle) commandAppend('upgrade CPU', -60);
        break;
    }
    if (game.quantumUpgradeBought.includes('42') && num > 4) {
      shopMaxBuy(num);
    } else {
      game.money = game.money.sub(calcShopCost(num, game.shopBought[num]));
      game.shopBought[num]++;
    }
  }
  if (tabNow == 1) renderShop();
}
function shopMaxBuy(num) {
  var mPoint = 30, maxA = 2**mPoint;
  for (var i = 0; i < mPoint; i++) {
    maxA += 2**(mPoint-1-i)*((game.money.gte(calcShopCost(num, maxA)))*2-1);
  }
  for (var i = 0; i < 6; i++) {
    if (game.money.gt(calcShopCost(num, maxA))) maxA++;
    if (game.money.lt(calcShopCost(num, maxA))) maxA--;
  }
  var bulkLv = maxA;
  var bulkBuyCount = bulkLv-game.shopBought[num]+1;
  if (game.money.gte(calcShopCost(num, maxA)) && bulkBuyCount > 0) {
    game.money = game.money.sub(calcShopCost(num, maxA));
    game.shopBought[num] += bulkBuyCount;
  }
}
function resetGame() {
  if (typeof hardResetTimeout != "undefined") clearTimeout(hardResetTimeout);
  hardResetConfrim--;
  $("#hardResetBtn").innerHTML = `${hardResetConfrim} more clicks!`;
  if (hardResetConfrim == 0) {
    hardResetConfrim = 100;
    $("#hardResetBtn").innerHTML = `Hard Reset`;
    clearTimeout(hardResetTimeout);
    commandAppend("reset all", -90);
    commandAppend("buy calculator", -60);
    hardReset();
  }
  hardResetTimeout = setTimeout( function () {
    $("#hardResetBtn").innerHTML = `Hard Reset`;
    hardResetConfrim = 100;
  }, 10000);
}

function calcCpuUpgradeEffect() {
  var eff = D(2);
  if (game.quantumUpgradeBought.includes('11')) eff = eff.mul(1.1);
  if (game.challengeEntered == 2 || game.challengeEntered == 7) eff = eff.pow(0.75);
  return eff;
}
function calcCPU() {
  var tempVar = D(1);
  tempVar = tempVar.mul(calcCpuUpgradeEffect().pow(
    game.shopBought[5]+
    game.researchLevel[0]*(game.quantumUpgradeBought.includes('13')?2:1)
  )).mul(getOverclockPower());
  tempVar = tempVar.mul(calcQubitEffect());
  if (game.quantumUpgradeBought.includes('14')) tempVar = tempVar.mul(D(9).pow(game.quantumLab));
  if (game.quantumUpgradeBought.includes('15')) tempVar = tempVar.mul(D.max(1, D(30).pow(D.max(0, calcMaxDigit().sub(calcMaxDigit().lt(2000)?game.digits:0)))));
  if (game.quantumUpgradeBought.includes('16')) tempVar = tempVar.mul(game.researchPoint.add(1).pow(0.25));
  if (game.quantumUpgradeBought.includes('17')) tempVar = tempVar.mul(D(10).pow(game.singularityPower.pow(0.5)));
  if (game.achievements.includes(25)) tempVar = tempVar.mul(25);
  tempVar = tempVar.mul(calcIpUpgradeEffect(0));
  return tempVar;
}
function calcShopCost(idx, lv) {
  var cost = D(Infinity);
  switch (idx) {
    case 0: case 1: case 2: case 3: case 4:
    tempObj = shopItems[idx][Math.min(lv, calcShopMax()[idx]-1)];
    if (typeof tempObj != "undefined") cost = D(tempObj.itemCost);
      break;
    case 5:
    cost = D(3+lv/9).pow(lv).div(50);
      break;
    default:

  }
  if (game.achievements.includes(4)) cost = cost.mul(0.95);
  if (game.achievements.includes(21)) cost = cost.div(10);
  return cost;
}
function calcShopMax() {
  const tempArr = new Array(15).fill(Infinity);
  for (var i = 0; i < 5; i++) {
    tempArr[i] = shopItems[i].length;
  }
  tempArr[5] = 1e15;
  return tempArr;
}
function calcMaxDigit() {
  var tempNum = D(6);
  tempNum = tempNum.plus(game.researchLevel[2]);
  if (game.quantumUpgradeBought.includes('12')) tempNum = tempNum.plus(game.base.pow(0.6).floor());
  if (game.challengeEntered == 1 || game.challengeEntered == 7) tempNum = D.min(tempNum, 20);
  tempNum = tempNum.add(singularityBoosts.DigitBoost);
  return tempNum.floor(0);
}
function calcMaxBase() {
  var tempNum = D(36);
  if (game.shopBought[0] >= 3) tempNum = tempNum.add(game.digits);
  if (game.challengeEntered == 0 || game.challengeEntered == 7) tempNum = D.min(50, tempNum);
  tempNum = tempNum.add(singularityBoosts.BaseBoost);
  return tempNum.floor(0);
}
function calcMoneyGain() {
  moneyGain = D.max(0, calcCPU().mul(game.number)).div(3e4);
  if (game.achievements.includes(1)) moneyGain = moneyGain.mul(1.25);
  if (game.achievements.includes(13)) moneyGain = moneyGain.mul(5);
  if (game.achievements.includes(13)) moneyGain = moneyGain.mul(10);
  if (game.achievements.includes(20)) moneyGain = moneyGain.mul(10);
  if (game.shopBought[1] >= 1) moneyGain = moneyGain.mul(game.digits);
  if (game.shopBought[1] >= 2) moneyGain = moneyGain.mul(game.researchPoint.add(1));
  if (game.shopBought[1] >= 3) moneyGain = moneyGain.mul(getOverclockPower());
  if (game.shopBought[1] >= 4) moneyGain = moneyGain.mul(D(2.4).pow(game.qubit));
  moneyGain = moneyGain.mul(singularityBoosts.MoneyBoost);
  return moneyGain;
}
function getBaseIncreaseReq() {
  return game.base.pow(
    (
      game.shopBought[0] >= 2 ?
      D.min(12, game.mDigits) :
      game.mDigits
    )
  ).sub(1);
}
function calcProgram(dt=0) {
  if (isProcessExceed() && !game.quantumUpgradeBought.includes('47')) game.programActive = [...new Array(15).fill(0)];
  if (rebooting) return;
  if (game.programActive[0]) {
    game.number = D.min(game.number.plus(calcCPU().mul(calcRealDt(dt))), game.base.pow(game.digits).sub(1));
    game.rebootNum = D.max(game.number, game.rebootNum);
    rainbowEffect("#basedNumber");
  } else {
    delRainbowEffect("#basedNumber");
  }
  if (game.programActive[1]) {
    game.money = game.money.plus(calcMoneyGain().mul(calcRealDt(dt)));
    rainbowEffect("#money");
  } else {
    delRainbowEffect("#money");
  }
  if (game.programActive[2]) {
    if (game.number.gte(game.base.pow(game.digits).sub(1)) && game.digits.lt(game.mDigits)) {
      if (game.shopBought[4] < 1) game.number = game.number.sub(game.base.pow(game.digits).sub(1));
      game.digits = game.digits.plus(1);
      if (game.quantumUpgradeBought.includes('45') && calcMaxDigit().gte(2000)) game.digits = D.min(D.max(game.digits, calcCPU().add(1).log(game.base)), calcMaxDigit());
    }
  }
  if (game.programActive[3]) {
    if (
      (game.digits.gte(
        (
          game.shopBought[0] >= 2 ?
          D.min(13, game.mDigits) :
          D(1e308)
        )
      ) ||
      game.number.gte(getBaseIncreaseReq())) &&
      game.base.lt(calcMaxBase())
    ) {
      var tempBase = D(game.base);
      game.base = (game.quantumUpgradeBought.includes('45') ? calcMaxBase() : game.base.plus(1));
      if (!tempBase.eq(game.base)) {
        if (game.shopBought[0] < 5) game.number = D(0);
        if (game.shopBought[0] < 4) game.digits = D(1);
      }
    }
  }
  if (game.programActive[5]) {
    shopBuy(5);
  }
  if (game.programActive[6]) {
    if (game.ipPassiveBought < 2) game.durability = game.durability.sub(getOverclockPower().add(1).log(2).div(D.pow(1.1, game.researchLevel[4])).div(1000).mul(calcRealDt(dt)));

    // minus bug fix
    if (game.durability.lte(0.01)) game.durability = D(0);

    // hardcap fix
    if (game.durability.eq(0) && calcRPGain().lt(1)) {
      commandAppend('Fatal Error Found...', -120, 1);
      commandAppend('shutdown system (focus Reboot)', 0);
      if (!game.t4toggle) goTab(2);
      for (var i = 0; i < game.programActive.length; i++) {
        game.programActive[i] = 0;
      }
      game.shopBought[5] = 0;
      game.money = D(0);
      game.rebootNum = D(0);
      game.durability = D(1);
      game.base = D(2);
      game.digits = D(1);
      game.number = D(0);
    }
  } // Overclocker.exe
}
function calcProcessActive() {
  var activeProcress = 0;
  for (var i = 0; i < game.programActive.length; i++) if (game.programActive[i]) activeProcress++;
  for (var i in game.singularityGrid) activeProcress += game.singularityGrid[i].tier+1;
  return activeProcress;
}
function calcMultiProcess() {
  var maxProcess = game.researchLevel[1]+1;
  maxProcess += Math.floor(Math.min(25, game.singularityPower.toNumber()*4)+Math.max(0, game.singularityPower.toNumber()*4-25)**0.5);
  if (game.achievements.includes(7)) maxProcess += 1;
  if (game.achievements.includes(34)) maxProcess += 10;
  if (game.ipPassiveBought >= 6) maxProcess += 250;

  return maxProcess;
}
function calcProcessLeft() {
  return calcMultiProcess()-calcProcessActive();
}
function isProcessExceed() {
  return calcProcessLeft() < 0;
}

function bugFixer() {
  bugFixerNaN();
}
function bugFixerNaN() {
  if (game.qubit.isNaN()) {
    if (bugfixerConfirm && confirm("NaN bug detected!\nConfirm will reset your money, number, qubit, RP, research progress\n* You will see this prompt for every refresh")) {
      bugfixerConfirm = 0;
      return;
    }
    game.money = D(0);
    game.number = D(0);
    game.qubit = D(0);
    game.qubitProgress = D(0);
    game.rebootNum = D(0);
    game.researchPoint = D(0);
    game.researchProgress = new Array(9).fill(0);
    commandAppend("run Bug_Fixer.exe");
  }
}
