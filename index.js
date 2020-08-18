const $ = _ => document.querySelector(_);
const D = num => new Decimal(num);

savePoint = 'CalculatorEvolution1';
tempGame = {
  number: D(0),
  base: D(2),
  digits: D(1),
  mDigits: D(6),
  tLast: new Date().getTime(),
  programActive: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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

function renderAll() {
  $("#basedNumber").innerHTML = dNum(game.number.floor()).toString(dNum(game.base)).padStart(dNum(game.digits), 0).toUpperCase();
  $("#memoryDigit").innerHTML = ("").padStart(dNum(game.mDigits)-dNum(game.digits), 0);
  $("#numberBase").innerHTML = game.base;
  renderProgram();
};
function renderProgram() {
  for (var i = 0; i < 3; i++) {
    $(".program:nth-of-type(" + (i+1) + ")").className = ((game.programActive[i]) ? "program active" : "program");
  }
}

function calcAll() {
  calcProgram();
}
function calcProgram() {
  if (game.programActive[0]) {
    game.number = game.number.add(tGain).min(game.base.pow(game.digits).sub(1));
  }
  if (game.programActive[1]) {
    if (game.number.gte(game.base.pow(game.digits).sub(1)) && game.digits.lt(game.mDigits)) {
      game.number = game.number.sub(game.base.pow(game.digits).sub(1));
      game.digits = game.digits.add(1);
    }
  }
  if (game.programActive[2]) {
    if (game.digits.gte(game.mDigits) && game.number.gte(game.base.pow(game.digits).sub(1)) && game.base.lt(36)) {
      game.number = D(0);
      game.digits = D(1);
      game.base = game.base.add(1);
    }
  }
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

document.addEventListener("DOMContentLoaded", function(){
  load();
  setInterval( function () {
    tGain =  (new Date().getTime()-game.tLast)/10;
    calcAll();
    renderAll();
    game.tLast = new Date().getTime();
  }, 33);
  setInterval( function () {
    save();
  }, 5000);
});
