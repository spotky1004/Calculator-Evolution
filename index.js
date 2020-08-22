const $ = _ => document.querySelector(_);
const D = num => new Decimal(num);

savePoint = 'CalculatorEvolution2';
siSymbol = ['', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
tabNow = 0;
tempGame = {
  number: D(0),
  base: D(2),
  digits: D(1),
  mDigits: D(6),
  tLast: new Date().getTime(),
  programActive: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  money: D(0),
  shopBought: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};
game = {};

function save() {
  localStorage[savePoint] = JSON.stringify(game);
}
function load() {
  for (const i in tempGame) {
    if (tempGame[i] instanceof Decimal) {
      game[i] = D(tempGame[i]);
    } else {
      game[i] = tempGame[i];
    }
  }
  if (localStorage[savePoint] !== undefined) {
    tempLoad = JSON.parse(localStorage[savePoint]);
  } else {
    tempLoad = {};
  }
  for (const i in game) {
    if (tempLoad[i] !== undefined) {
      if (tempGame[i] instanceof Decimal) {
        game[i] = D(tempLoad[i]);
      } else {
        game[i] = tempLoad[i];
      }
    }
  }
}

function dNum(infNum) {
  return Number(infNum.valueOf());
}
function dNotation(infNum, dim=0) {
  if (!(infNum instanceof Decimal)) {
    infNum = D(infNum);
  }
  if (infNum.gte(1e5)) {
    return infNum.mantissa.toFixed(3) + 'e' + dNotation(infNum.exponent, 0);
  } else {
    return dNum(infNum).toFixed(D(dim).sub(infNum.add(1).log(10)).max(0).valueOf());
  }
}
function notationSI(num, dim=0) {
  if (!(num instanceof Decimal)) {
    num = D(num);
  }
  if (num.gt(1024**8)) {
    return dNotation(num.div(1024**8), dim) + 'Y';
  } else {
    numLv = Math.floor(num.log(1024));
    return num.div(1024**numLv).toFixed(dim) + siSymbol[numLv];
  }
}

function renderAll() {
  numStr = dNum(game.number.floor()).toString(dNum(game.base)).padStart(dNum(game.digits), 0).toUpperCase();
  if ((numStr).indexOf(".") != -1) {
    numStr = numStr.substr(0, (numStr).indexOf("."));
  }
  $("#basedNumber").innerHTML = numStr;
  $("#money").innerHTML = dNotation(game.money, 5);
  $("#memoryDigit").innerHTML = ("").padStart(dNum(game.mDigits)-dNum(game.digits), 0);
  $("#numberBase").innerHTML = game.base;
  switch (tabNow) {
    case 0:
    renderProgram();
      break;
    case 1:
    renderShop();
      break;
  }
};
function renderProgram() {
  for (var i = 0; i < 4; i++) {
    $(".program:nth-of-type(" + (i+1) + ")").className = ((game.programActive[i]) ? "program active" : "program");
  }
  $(".program:nth-of-type(4)").style.display = ((game.shopBought[0]) ? "block" : "none");
}
function renderShop() {
  for (var i = 0; i < 5; i++) {
    $(".shopItem:nth-of-type(" + (i+1) + ")").className = ((game.shopBought[i]) ? "shopItem bought" : "shopItem");
  }
  for (var i = 0; i < 5; i++) {
    $(".shopBox:nth-of-type(2) > .shopItem:nth-of-type(" + (i+1) + ") > .itemCost > .itemCostNum").innerHTML = dNotation(calcShopCost()[i+5], 5);
  }
  $("#cpuHz").innerHTML = notationSI(D(2).pow(game.shopBought[5]+1), 0);
}

function calcAll() {
  calcProgram();
}
function calcProgram() {
  if (game.shopBought[1]) {
    $(".program:nth-of-type(2) > span:nth-child(2)").innerHTML = "Mine_2.0.exe"
  }
  if (game.programActive[0]) {
    game.number = game.number.add(calcCPU().mul(tGain)).min(game.base.pow(game.digits).sub(1));
    rainbowEffect("#basedNumber");
  } else {
    delRainbowEffect("#basedNumber");
  }
  if (game.programActive[1]) {
    moneyGot = calcCPU().mul(tGain/1e5).mul(game.number);
    if (game.shopBought[1]) moneyGot.mul(game.digits);
    game.money = game.money.add(moneyGot);
    rainbowEffect("#money");
  } else {
    delRainbowEffect("#money");
  }
  if (game.programActive[2]) {
    if (game.number.gte(game.base.pow(game.digits).sub(1)) && game.digits.lt(game.mDigits)) {
      game.number = game.number.sub(game.base.pow(game.digits).sub(1));
      game.digits = game.digits.add(1);
    }
  }
  if (game.programActive[3]) {
    if (game.digits.gte(game.mDigits) && game.number.gte(game.base.pow(game.digits).sub(1)) && game.base.lt(36)) {
      game.number = D(0);
      game.digits = D(1);
      game.base = game.base.add(1);
    }
  }
}

function calcCPU() {
  var tempVar = D(1);
  tempVar = tempVar.mul(D(2).pow(game.shopBought[5]))
  return tempVar;
}
function calcShopCost() {
  const tempArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  tempArr[0] = D(0.03);
  tempArr[1] = D(1e6);
  tempArr[5] = D(3+game.shopBought[5]/10).pow(game.shopBought[5]);
  return tempArr;
}
function calcShopMax() {
  const tempArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  tempArr[0] = 1;
  tempArr[1] = 1;
  tempArr[5] = 100;
  return tempArr;
}

function goTab(num) {
  for (var i = 0; i < 3; i++) {
    $(".tab:nth-of-type(" + (i+1) + ")").style.display = "none";
  }
  $(".tab:nth-of-type(" + (num+1) + ")").style.display = "block";
  tabNow = num;
  renderAll();
}
function activeProgram(num) {
  for (var i = 0; i < game.programActive.length; i++) {
    if (i != num) {
      game.programActive[i] = 0;
    }
  }
  game.programActive[num] = !game.programActive[num];
  renderProgram();
}
function shopBuy(num) {
  if (game.money.gte(calcShopCost()[num]) && game.shopBought[num] < calcShopMax()[num]) {
    game.money = game.money.sub(calcShopCost()[num]);
    game.shopBought[num]++;
  }
  renderShop();
}

function rainbowEffect(sel, pow=1) {
  if ($(sel).style.filter != "") {
    thisHue = Number($(sel).style.filter.replace('hue-rotate(', '').replace('deg)', ''));
  } else {
    thisHue = 0;
  }
  $(sel).style.filter = 'hue-rotate(' + (thisHue+1) + 'deg)';
}
function delRainbowEffect(sel) {
  $(sel).style.filter = 'hue-rotate(0deg)';
}

document.addEventListener("DOMContentLoaded", function(){
  load();
  setInterval( function () {
    tGain = (new Date().getTime()-game.tLast)/1000;
    game.tLast = new Date().getTime();
    calcAll();
    renderAll();
  }, 33);
  setInterval( function () {
    save();
  }, 5000);
});
