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
    ],
    // Data_Holder.exe
    [
      {
        "itemName": "Data_Holder.exe",
        "itemCost": '2e15',
        "itemDesc": "Keep your base(cap: 36), programs on reboot",
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
        "itemName": "Base_Increaser_2.0.exe",
        "itemCost": '4.4444e70',
        "itemDesc": "Increase digit won't reset anything",
      },
    ]
  ];
})();

function renderBasic() {
  $("#basedNumber").innerHTML = formatWithBase(game.number, game.base, game.digits, 1);
  $("#money").innerHTML = dNotation(game.money, 5);
  $("#memoryDigit").innerHTML = ("").padStart(dNum(game.mDigits)-dNum(game.digits), 0);
  $("#numberBase").innerHTML = game.base;

  commandFloat();
}
function renderProgram() {
  var programPoint = [-1, 1, -1, 0, 2, 3, -1]
  for (var i = 0; i < 7; i++) {
    $(".program:nth-of-type(" + (i+1) + ")").className = ((game.programActive[i]) ? "program active" : "program") + (i==6 ? " permanent": "");
    if (programPoint[i] != -1) {
      if (game.shopBought[programPoint[i]]-1 == -1) continue;
      $(".program:nth-of-type(" + (i+1) + ") > span:nth-child(2)").innerHTML = shopItems[programPoint[i]][game.shopBought[programPoint[i]]-1].itemName;
    }
  }
  $(".program:nth-of-type(4)").style.display = ((game.shopBought[0]) ? "block" : "none");
  $(".program:nth-of-type(5)").style.display = ((game.shopBought[2]) ? "block" : "none");
  $(".program:nth-of-type(6)").style.display = ((game.shopBought[3]) ? "block" : "none");
  $(".program:nth-of-type(7)").style.display = ((game.researchLevel[0]>=1) ? "block" : "none");
}
function renderShop() {
  for (var i = 0; i < 5; i++) {
    var infoObj = shopItems[i][Math.min(game.shopBought[i], shopItems[i].length-1)];
    if (typeof infoObj != "undefined") {
      $(".shopItem:nth-of-type(" + (i+1) + ") > .itemName").innerHTML = infoObj.itemName;
      $(".shopItem:nth-of-type(" + (i+1) + ") > .itemCost > .itemCostNum").innerHTML = dNotation(infoObj.itemCost, 4) + '$';
      $(".shopItem:nth-of-type(" + (i+1) + ") > .itemDesc").innerHTML = infoObj.itemDesc;
      if (shopItems[i].length == game.shopBought[i]) {
        $(".shopItem:nth-of-type(" + (i+1) + ")").className = ((game.shopBought[i]) ? "shopItem bought" : "shopItem");
      }
    }
  }
  for (var i = 0; i < 5; i++) {
    $(".shopBox:nth-of-type(2) > .shopItem:nth-of-type(" + (i+1) + ") > .itemCost > .itemCostNum").innerHTML = dNotation(calcShopCost()[i+5], 5);
  }
  $("#cpuHz").innerHTML = notationSI(calcCPU(), 0);
}
function renderOption() {
  for (var i = 0; i < 1; i++) {
    $('#optionToggle' + i).className = 'optionBtn' + ((game.optionToggle[i]) ? '' : ' disabled');
  }
}
function renderInfo() {
  renderOverclockInfo();
}

function goTab(num) {
  if (!rebooting) {
    for (var i = 0; i < document.getElementsByClassName('tab').length; i++) {
      $(".tab:nth-of-type(" + (i+1) + ")").style.display = "none";
    }
    $(".tab:nth-of-type(" + (num+1) + ")").style.display = "block";
    tabNow = num;
    renderAll();
  }
}
function optionBtn(num) {
  game.optionToggle[num] = !game.optionToggle[num];
}
function activeProgram(num) {
  if (rebooting) return;
  if (num == 3 && !game.shopBought[0]) return;
  if (num == 4 && !game.shopBought[2]) return;
  if (num == 5 && !game.shopBought[3]) return;
  if (num == 6 && (game.programActive[6] || game.researchLevel[0]<1)) return;
  var programCount = 0;
  if (game.programActive[num]) {
    programCount--;
  } else {
    programCount++;
  }
  for (var i = 0; i < game.programActive.length; i++) {
    if (game.programActive[i]) {
      programCount++;
    }
  }
  if (programCount >= game.researchLevel[1]+2) {
    for (var i = 5; i > -1; i--) {
      if (game.programActive[i] && i != num) {
        game.programActive[i] = 0;
        programCount--;
      }
      if (programCount < game.researchLevel[1]+2) break;
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
  renderProgram();
}
function shopBuy(num) {
  if (game.money.gte(calcShopCost()[num].floor()) && game.shopBought[num] < calcShopMax()[num]) {
    game.money = game.money.sub(calcShopCost()[num]);
    game.shopBought[num]++;
    switch (num) {
      case 0: case 1: case 2: case 3: case 4:
      commandAppend(`buy ${shopItems[num][Math.min(game.shopBought[num], calcShopMax()[num]-1)].itemName}`);
        break;
      case 5:
      commandAppend('upgrade CPU', -60);
        break;
    }
  }
  renderShop();
}

function calcCPU() {
  var tempVar = D(1);
  tempVar = tempVar.mul(D(2).pow(game.shopBought[5]+game.researchLevel[0])).mul(getOverclockPower());
  return tempVar;
}
function calcShopCost() {
  const tempArr = new Array(15).fill(D(Infinity));
  for (var i = 0; i < 5; i++) {
    var tempObj = shopItems[i][Math.min(game.shopBought[i], calcShopMax()[i]-1)];
    if (typeof tempObj != "undefined") {
      tempArr[i] = D(tempObj.itemCost);
    }
  }
  tempArr[5] = D(3+game.shopBought[5]/9).pow(game.shopBought[5]).div(5);
  tempArr[6] = D(1e32).mul( D(10).pow(game.shopBought[6]).pow(Math.max(1, game.shopBought[6]/10+1-0.5)) );
  return tempArr;
}
function calcShopMax() {
  const tempArr = new Array(15).fill(Infinity);
  for (var i = 0; i < 5; i++) {
    tempArr[i] = shopItems[i].length;
  }
  tempArr[5] = 100;
  return tempArr;
}
function calcMaxDigit() {
  var tempNum = D(6);
  tempNum = tempNum.plus(game.researchLevel[2]);
  return tempNum;
}
function calcMaxBase() {
  var tempNum = D(36);
  if (game.shopBought[0] >= 3) tempNum = tempNum.add(game.digits);
  return tempNum;
}
function getBaseIncreaseReq() {
  return game.base.pow(
    (
      game.shopBought[0] >= 2 ?
      D.min(12, game.digits) :
      game.digits
    )
  ).sub(1);
}
function calcProgram() {
  if (rebooting) {
    return;
  }
  if (game.programActive[0]) {
    game.number = D.min(game.number.plus(calcCPU().mul(tGain)), game.base.pow(game.digits).sub(1));
    game.rebootNum = D.max(game.number, game.rebootNum);
    rainbowEffect("#basedNumber");
  } else {
    delRainbowEffect("#basedNumber");
  }
  if (game.programActive[1]) {
    moneyGain = D.max(0, calcCPU().mul(tGain/3e4).mul(game.number));
    if (game.shopBought[1] >= 1) moneyGain = moneyGain.mul(game.digits);
    if (game.shopBought[1] >= 2) moneyGain = moneyGain.mul(game.researchPoint);
    game.money = game.money.plus(moneyGain);
    rainbowEffect("#money");
  } else {
    delRainbowEffect("#money");
  }
  if (game.programActive[2]) {
    if (game.number.gte(game.base.pow(game.digits).sub(1)) && game.digits.lt(game.mDigits)) {
      if (game.shopBought[4] < 1) game.number = game.number.sub(game.base.pow(game.digits).sub(1));
      game.digits = game.digits.plus(1);
    }
  }
  if (game.programActive[3]) {
    if (
      (game.digits.gte(
        (
          game.shopBought[0] >= 2 ?
          D.min(13, game.mDigits) :
          game.mDigits
        )
      ) ||
      game.number.gte(getBaseIncreaseReq())) &&
      game.base.lt(calcMaxBase())
    ) {
      if (game.shopBought[0] < 5) game.number = D(0);
      if (game.shopBought[0] < 4) game.digits = D(1);
      game.base = game.base.plus(1);
    }
  }
  if (game.programActive[5]) {
    shopBuy(5);
  }
  if (game.programActive[6]) {
    game.durability = game.durability.sub(getOverclockPower().add(1).log(2).div(D.pow(2, game.researchLevel[7])).div(1000).mul(tGain));
    if (game.durability.lte(0.01)) game.durability = D(0);
  }
}
