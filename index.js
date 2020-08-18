const $ = _ => document.querySelector(_);
const D = num => new Decimal(num);

savePoint = 'CalculatorEvolution2';
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
  if (infNum.gte(1e5)) {
    return infNum.toFixed(3).valueOf();
  } else {
    return dNum(infNum).toFixed(D(dim).sub(infNum.log(10)));
  }
}

function renderAll() {
  $("#basedNumber").innerHTML = dNum(game.number.floor()).toString(dNum(game.base)).padStart(dNum(game.digits), 0).toUpperCase();
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
  for (var i = 0; i < 1; i++) {
    $(".shopItem:nth-of-type(" + (i+1) + ")").className = ((game.shopBought[i]) ? "shopItem bought" : "shopItem");
  }
}

function calcAll() {
  calcProgram();
}
function calcProgram() {
  if (game.programActive[0]) {
    game.number = game.number.add(calcCPU().mul(tGain)).min(game.base.pow(game.digits).sub(1));
  }
  if (game.programActive[1]) {
    game.money = game.money.add(calcCPU().mul(tGain/1e5).mul(game.number));
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

  return tempVar;
}
function calcShopCost() {
  const tempArr = [];
  tempArr[0] = D(0.03);
  return tempArr;
}
function calcShopMax() {
  const tempArr = [];
  tempArr[0] = 1;
  return tempArr;
}

function goTab(num) {
  for (var i = 0; i < 2; i++) {
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
    game.money.sub(calcShopCost()[num]);
    game.shopBought[num]++;
  }
  renderShop();
}

document.addEventListener("DOMContentLoaded", function(){
  load();
  setInterval( function () {
    tGain =  (new Date().getTime()-game.tLast)/1000;
    calcAll();
    renderAll();
    game.tLast = new Date().getTime();
  }, 33);
  setInterval( function () {
    save();
  }, 5000);
});
