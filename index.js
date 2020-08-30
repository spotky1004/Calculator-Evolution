//dev QoL?
const $ = _ => document.querySelector(_);
const D = num => new Decimal(num);

//set vars
savePoint = 'CalculatorEvolution2';
siSymbol = ['', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
tabNow = 0;
rebooting = 0;

//temp var for game object
tempGame = {
  number: D(0),
  base: D(2),
  digits: D(1),
  mDigits: D(6),
  tLast: new Date().getTime(),
  programActive: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  money: D(0),
  shopBought: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  researchPoint: D(0),
  researchSpeed: [0, 0, 0, 0, 0],
  researchLevel: [0, 0, 0, 0, 0],
  researchProgress: [0, 0, 0, 0, 0],
  t2toggle: 0,
  optionToggle: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
game = {};

//meta function
function save() {
  localStorage[savePoint] = JSON.stringify(game);
  commandAppend('save', 70);
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
  commandAppend('load', 70);
}

//number function
function dNum(infNum) {
  return Number(infNum.valueOf());
}
function dNotation(infNum, dim=0) {
  if (!(infNum instanceof Decimal)) {
    infNum = D(infNum);
  }
  if (infNum.gte(1e5)) {
    numI = Math.floor(infNum.mantissa*1000)/1000;
    numE = dNotation(infNum.exponent, 0);
    if (numI >= 10) {
      numE = numE.add(1);
      numI /= 10;
    }
    if (numI.toString().length == 1) numI += '.';
    numI = numI.toString().padEnd(5, '0');
    return numI + 'e' + numE;
  } else {
    return dNum(infNum).toFixed(D(dim).sub(infNum.add(1).log(10)).max(0).valueOf());
  }
}
function baseNum(infNum, base, len=0) {
  if (!(infNum instanceof Decimal)) {
    infNum = D(infNum);
  }
  if (!(base instanceof Decimal)) {
    base = D(base);
  }
  if (infNum.gte(base.pow(len).mul(0.9999)) && len != 0) {
    return ('').padStart(len, dNum(base.sub(1)).toString(dNum(base)).toUpperCase());
  }
  infNum = dNum(infNum.floor()).toString(dNum(base)).toUpperCase();
  if ((infNum).indexOf(".") != -1) {
    infNum = infNum.substr(0, (infNum).indexOf("."));
  }
  infNum = infNum.padStart(dNum(len), 0);
  return infNum;
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

//update DOM
function renderAll() {
  renderBasic();
  switch (tabNow) {
    case 0:
    renderProgram();
      break;
    case 1:
    renderShop();
      break;
    case 2:
    renderResearch();
      break;
    case 4:
    renderOption();
      break;
  }
}
function renderBasic() {
  $("#basedNumber").innerHTML = baseNum(game.number, game.base, game.digits);
  $("#money").innerHTML = dNotation(game.money, 5);
  $("#memoryDigit").innerHTML = ("").padStart(dNum(game.mDigits)-dNum(game.digits), 0);
  $("#numberBase").innerHTML = game.base;
  commandFloat();
}
function renderProgram() {
  for (var i = 0; i < 4; i++) {
    $(".program:nth-of-type(" + (i+1) + ")").className = ((game.programActive[i]) ? "program active" : "program");
  }
  $(".program:nth-of-type(4)").style.display = ((game.shopBought[0]) ? "block" : "none");
  if (game.shopBought[1]) {
    $(".program:nth-of-type(2) > span:nth-child(2)").innerHTML = "Mine_2.0.exe"
  }
}
function renderShop() {
  for (var i = 0; i < 5; i++) {
    $(".shopItem:nth-of-type(" + (i+1) + ")").className = ((game.shopBought[i]) ? "shopItem bought" : "shopItem");
  }
  for (var i = 0; i < 5; i++) {
    $(".shopBox:nth-of-type(2) > .shopItem:nth-of-type(" + (i+1) + ") > .itemCost > .itemCostNum").innerHTML = dNotation(calcShopCost()[i+5], 5);
  }
  $("#cpuHz").innerHTML = notationSI(calcCPU(), 0);
}
function renderResearch() {
  if (calcRPGain().gte(1)) {
    $('#rebootButton').className = "";
  } else {
    $('#rebootButton').className = "disabled";
  }
  $('#rebootDesc').innerHTML = "If you Reboot now, you'll get " + dNotation(calcRPGain()) + " Research Points<br>You need to reach " + baseNum(calcRPGain().add(20).pow(6).sub(1).ceil(), game.base) + "(" + game.base + ") to get next RP<br>You lose Number, Memory, Base, Upgrades, Money on Reboot";
  $('#rpDisplay').innerHTML = "You have " + dNotation(game.researchPoint) + " Research Points";
  for (var i = 0; i < 3; i++) {
    $('.research:nth-of-type(' + (i+1) + ') > .researchName > span').innerHTML = dNotation(calcResearchSpeed(game.researchSpeed[i]));
    $('.research:nth-of-type(' + (i+1) + ') > .researchProgress > .innerBar').style.width = game.researchProgress[i]*64 + 'vw';
    $('.research:nth-of-type(' + (i+1) + ') > .researchProgress > .researchLevel').innerHTML = 'Lv.' + game.researchLevel[i];
    $('.research:nth-of-type(' + (i+1) + ') > .researchCost > span:nth-child(1)').innerHTML = dNotation(calcResearchCost()[i][0]);
    $('.research:nth-of-type(' + (i+1) + ') > .researchCost > span:nth-child(2)').innerHTML = dNotation(calcResearchCost()[i][1]);
  }
}
function renderOption() {
  for (var i = 0; i < 1; i++) {
    $('.optionBtn:nth-of-type(' + (i+1) + ')').className = 'optionBtn' + ((game.optionToggle[i]) ? '' : ' disabled');
  }
}

//calculate upper things(update DOM)
function calcAll() {
  game.mDigits = calcMaxDigit();
  calcProgram();
  calcResearch();
}
function calcProgram() {
  if (game.programActive[0]) {
    game.number = game.number.add(calcCPU().mul(tGain)).min(game.base.pow(game.digits).sub(1));
    rainbowEffect("#basedNumber");
  } else {
    delRainbowEffect("#basedNumber");
  }
  if (game.programActive[1]) {
    moneyGot = calcCPU().mul(tGain/3e4).mul(game.number);
    if (game.shopBought[1]) moneyGot = moneyGot.mul(game.digits);
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
function calcResearch() {
  if (calcRPGain().gte(1)) {
    game.t2toggle = 1;
  }
  if (game.t2toggle) {
    $('#researchWarp').style.display = "block";
  } else {
    $('#researchWarp').style.display = "none";
  }
  for (var i = 0; i < 5; i++) {
    game.researchProgress[i] += Number(calcResearchSpeed(game.researchSpeed[i]).div(calcResearchDivide(i)).valueOf())*tGain;
    if (game.researchProgress[i] >= 1) {
      game.researchProgress[i] = 0;
      game.researchLevel[i]++;
    }
  }
}

//calculate etc
function calcCPU() {
  var tempVar = D(1);
  tempVar = tempVar.mul(D(2).pow(game.shopBought[5]+game.researchLevel[0]))
  return tempVar;
}
function calcShopCost() {
  const tempArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  tempArr[0] = D(0.03);
  tempArr[1] = D(1e6);
  tempArr[5] = D(3+game.shopBought[5]/9).pow(game.shopBought[5]);
  return tempArr;
}
function calcShopMax() {
  const tempArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  tempArr[0] = 1;
  tempArr[1] = 1;
  tempArr[5] = 100;
  return tempArr;
}
function calcRPGain() {
  var tempNum = game.number.add(1).pow(1/6).floor().sub(19);
  return tempNum.max(0);
}
function calcResearchCost() {
  var tempArr = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
  tempArr[0][0] = D(10+Math.sqrt(game.researchSpeed[0])).pow(game.researchSpeed[0]/1.2); tempArr[0][1] = D(1e10).mul(D(10).pow(game.researchSpeed[0]**2)).pow(game.researchSpeed[0]/100+1).sub(1e10);
  tempArr[1][0] = D(10+game.researchSpeed[1]**2).pow(game.researchSpeed[1]); tempArr[1][1] = D(1e10).mul(D(10).pow(game.researchSpeed[1]**2+1)).pow(game.researchSpeed[1]+1).sub(1e10);
  tempArr[2][0] = D(80).mul(D(2).pow(game.researchSpeed[2])); tempArr[2][1] = D(1e16).mul(D(10).pow(game.researchSpeed[2])).pow(Math.sqrt(game.researchSpeed[2])/4+1);
  return tempArr;
}
function calcResearchSpeed(lv) {
  if (lv != 0) {
    return D(100).pow(lv-1);
  } else {
    return D(0);
  }
}
function calcResearchDivide(num) {
  switch (num) {
    case 0:
    return D(20).mul(D(game.researchLevel[num]+1).factorial());
      break;
    case 1:
    return D(40).mul(D(game.researchLevel[num]**2+1).factorial());
      break;
    case 2:
    return D(80).mul(D(game.researchLevel[num]*2+1).factorial());
      break;
    default:
    return D(1e308);
  }
}
function calcMaxDigit() {
  var tempNum = D(6);
  tempNum = tempNum.add(game.researchLevel[2]);
  return tempNum;
}

//element onclick
function goTab(num) {
  if (!rebooting) {
    for (var i = 0; i < 5; i++) {
      $(".tab:nth-of-type(" + (i+1) + ")").style.display = "none";
    }
    $(".tab:nth-of-type(" + (num+1) + ")").style.display = "block";
    tabNow = num;
    renderAll();
  }
}
function activeProgram(num) {
  if (rebooting) return;
  if (num == 3 && !game.shopBought[0]) return;
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
    for (var i = game.programActive.length-1; i > -1; i--) {
      if (game.programActive[i] && i != num) {
        game.programActive[i] = 0;
        programCount--;
      }
      if (programCount < game.researchLevel[1]+2) break;
    }
  }
  game.programActive[num] = !game.programActive[num];
  if (game.programActive[num]) {
    commandAppend('start ' + $('.program:nth-of-type(' + (num+1) + ') > span:nth-child(2)').innerHTML);
  } else {
    commandAppend('kill ' + $('.program:nth-of-type(' + (num+1) + ') > span:nth-child(2)').innerHTML, -110);
  }
  renderProgram();
}
function shopBuy(num) {
  if (game.money.gte(calcShopCost()[num]) && game.shopBought[num] < calcShopMax()[num]) {
    game.money = game.money.sub(calcShopCost()[num]);
    game.shopBought[num]++;
    switch (num) {
      case 0:
      commandAppend('buy Base_Increaser.exe', -60);
        break;
      case 1:
      commandAppend('buy Mine_2.0.exe', -60);
        break;
      case 5:
      commandAppend('upgrade CPU', -60);
        break;
    }
  }
  renderShop();
}
function reboot() {
  if (!rebooting && calcRPGain().gte(1)) {
    //calculate
    game.researchPoint = game.researchPoint.add(calcRPGain());
    gotRP = calcRPGain();
    for (var i = 0; i < game.programActive.length; i++) {
      game.programActive[i] = 0;
    }
    game.shopBought[5] = 0;
    game.money = D(0);
    //animation
    commandAppend('rebooting... (Got ' + dNotation(gotRP) +' RP)', 75);
    rebooting = 1;
    $('#rebootButton').innerHTML = "Rebooting";
    setTimeout( function () {
      $('#rebootButton').className = "disabled";
    }, 500);
    setTimeout( function () {
      rebooting = 0;
      $('#rebootButton').className = "";
      $('#rebootButton').innerHTML = "Reboot";
      commandAppend('done!', 75);
    }, 5000);
    tempNum = game.number;
    for (var i = 0; i < 50; i++) {
      setTimeout( function () {
        game.number = game.number.mul(0.99).sub(tempNum.div(50)).max(0);
        game.digits = game.digits.sub(1).max(1);
        game.base = game.base.sub(1).max(2);
        game.number = game.number.min(game.base.pow(game.digits).sub(1));
      }, i*90);
    }
  }
}
function researchBuy(num) {
  if (game.researchPoint.gte(calcResearchCost()[num][0]) && game.money.gte(calcResearchCost()[num][1])) {
    game.researchPoint = game.researchPoint.sub(calcResearchCost()[num][0]);
    game.money = game.money.sub(calcResearchCost()[num][1]);
    game.researchSpeed[num]++;
    renderAll();
  }
}
function optionBtn(num) {
  game.optionToggle[num] = !game.optionToggle[num];
}

//visual effect
function rainbowEffect(sel, pow=1) {
  if (!game.optionToggle[0]) {
    delRainbowEffect(sel);
    return;
  }
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
function commandAppend(str, hue=0) {
  if (!game.optionToggle[0]) {
    return;
  }
  commandFloat(7);
  commandTxt = document.createElement('span');
  commandTxt.className += 'commandTxt';
  commandTxt.innerHTML = '> ' + str;
  commandTxt.style.bottom = '0vh';
  commandTxt.style.opacity = 1;
  commandTxt.style.filter = 'hue-rotate(' + hue + 'deg)';
  $('#commandArea').appendChild(commandTxt);
}
function commandFloat(speed=1) {
  eleArr = document.getElementsByClassName("commandTxt");
  for (var i = 0; i < eleArr.length; i++) {
    eleArr[i].style.bottom = (Number(eleArr[i].style.bottom.replace('vh', ''))+tSpeed*5*speed) + 'vh';
    eleArr[i].style.opacity = eleArr[i].style.opacity-tSpeed/3*speed;
    if (eleArr[i].style.opacity < 0) {
      eleArr[i].remove();
    }
  }
}

//hotkey
(function(){
  document.addEventListener('keydown', function(e){
    const keyCode = e.keyCode;
    if (keyCode == 49) {
      activeProgram(0);
    }
    if (keyCode == 50) {
      activeProgram(1);
    }
    if (keyCode == 51) {
      activeProgram(2);
    }
    if (keyCode == 52) {
      activeProgram(3);
    }
  })
})();

//game loop
document.addEventListener("DOMContentLoaded", function(){
  load();
  setInterval( function () {
    tGain = (new Date().getTime()-game.tLast)/1000;
    tSpeed = 0.033;
    game.tLast = new Date().getTime();
    calcAll();
    renderAll();
  }, 33);
  setInterval( function () {
    save();
  }, 20000);
});
