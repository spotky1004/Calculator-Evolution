(function(){
  rebooting = 0;
})();

function renderResearch() {
  if (calcRPGain().gte(1)) {
    $('#rebootButton').className = "";
  } else {
    $('#rebootButton').className = "disabled";
  }
  $('#rebootDesc').innerHTML = "If you Reboot now, you'll get " + dNotation(calcRPGain(), 4) + " Research Points<br>You need to reach " + formatWithBase(calcRPGain().plus(20).pow(6).sub(1).ceil(), game.base) + "(" + game.base + ") to get next RP<br>You lose Number, Memory, Base, Upgrades, Money on Reboot";
  $('#rpDisplay').innerHTML = "You have " + dNotation(game.researchPoint, 4) + " Research Points";
  for (var i = 0; i < 5; i++) {
    $('.research:nth-of-type(' + (i+1) + ') > .researchProgress > .innerBar').style.width = game.researchProgress[i]*26 + 'vw';
    $('.research:nth-of-type(' + (i+1) + ') > .researchProgress > .researchLevel').innerHTML = 'Lv.' + game.researchLevel[i];
    $('.research:nth-of-type(' + (i+1) + ') > .researchProgress > .researchProgressDisplay').innerHTML = `(${dNotation(game.researchProgress[i]*calcResearchDivide(i), 2)}/${dNotation(calcResearchDivide(i), 2)})`;
    $('.research:nth-of-type(' + (i+1) + ') > .researchCost > span:nth-child(1)').innerHTML = dNotation(calcResearchCost()[i][0], 3);
    $('.research:nth-of-type(' + (i+1) + ') > .researchCost > span:nth-child(2)').innerHTML = dNotation(calcResearchCost()[i][1], 3);
  }
  $('.research:nth-of-type(4) > .researchProgress').style.display = ((game.researchLevel[0]>=1) ? "block" : "none");
  $('.research:nth-of-type(5) > .researchProgress').style.display = ((game.researchLevel[0]>=1) ? "block" : "none");
}
function renderOverclockInfo() {
  document.getElementById('overclockInfo').style.display = ((game.researchLevel[0]>=1)?"block":"none");
  document.getElementById('overclockInfo').innerHTML = `Overclock Mult: x${dNotation(getOverclockPower(), 2)}<br>Durability: ${dNotation(game.durability.mul(100), 2)}%`;
}

function reboot() {
  if (!rebooting && calcRPGain().gte(1)) {
    //calculate
    game.researchPoint = game.researchPoint.plus(calcRPGain());
    gotRP = calcRPGain();
    rebootReset();

    //animation
    commandAppend('reboot', 75);
    rebooting = 1;
    $('#rebootButton').innerHTML = "Rebooting";
    setTimeout( function () {
      rebooting = 0;
      $('#rebootButton').className = "";
      $('#rebootButton').innerHTML = "Reboot";
      commandAppend('reboot done! (Got ' + dNotation(gotRP, 4) +' RP)', 75, 1);
    }, 5000);
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

function calcResearch() {
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
function calcRPGain() {
  var tempNum = game.rebootNum.plus(2).pow(1/6).floor().sub(19);
  return Decimal.max(tempNum, 0);
}
function calcResearchCost() {
  var tempArr = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
  tempArr[0][0] = D(10+Math.sqrt(game.researchSpeed[0])).pow(game.researchSpeed[0]/1.2); tempArr[0][1] = D(1e10).mul(D(10).pow(game.researchSpeed[0]**2)).pow(game.researchSpeed[0]/100+1).sub(1e10);
  tempArr[1][0] = D(10+game.researchSpeed[1]**2).pow(game.researchSpeed[1]); tempArr[1][1] = D(1e10).mul(D(10).pow(game.researchSpeed[1]**2+1)).pow(game.researchSpeed[1]/2+1).sub(1e10);
  tempArr[2][0] = D(25).mul(D(2).pow(game.researchSpeed[2])); tempArr[2][1] = D(1e16).mul(D(10).pow(game.researchSpeed[2])).pow(Math.sqrt(game.researchSpeed[2])/4+1);
  tempArr[3][0] = D(4e3).mul(D(1.3+game.researchSpeed[3]/15).pow(game.researchSpeed[3])); tempArr[3][1] = D(1e32).mul(D(10).pow(game.researchSpeed[3]**1.46)).pow(Math.sqrt(game.researchSpeed[3])/20+1);
  tempArr[4][0] = D(3e3).mul(D(1.4+game.researchSpeed[4]/9).pow(game.researchSpeed[4])); tempArr[4][1] = D(1e30).mul(D(10).pow(game.researchSpeed[4]**1.2)).pow(Math.sqrt(game.researchSpeed[4])/20+1);
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
    return D(20).mul(factorial(game.researchLevel[num]+1));
      break;
    case 1:
    return D(40).mul(factorial(game.researchLevel[num]*2.5));
      break;
    case 2:
    return D(80).mul(factorial(game.researchLevel[num]*2+1));
      break;
    case 3:
    return D(10).mul(factorial(game.researchLevel[num]));
      break;
    case 4:
    return D(100).mul(factorial(game.researchLevel[num]));
      break;
    default:
    return D(1e308);
  }
}

getOverclockBasePower = () => { return D.pow(2, game.researchLevel[3]).mul(10) };
function getOverclockPower() {
  if (game.programActive[6]) {
    return getOverclockBasePower().mul(game.durability);
  } else {
    return D(1);
  }
}
