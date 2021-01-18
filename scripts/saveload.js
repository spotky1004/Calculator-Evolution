(function(){
  savePoint = 'CalculatorEvolution2';
})();

tempGame = {
  gameSpeed: 1,
  number: D(0),
  rebootNum: D(0),
  base: D(2),
  digits: D(1),
  mDigits: D(6),
  tLast: new Date().getTime(),
  programActive: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  money: D(0),
  shopBought: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  researchPoint: D(0),
  researchSpeed: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  researchLevel: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  researchProgress: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  t2toggle: 0,
  optionToggle: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  achievements: [],
  durability: D(1),
};
game = {};

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

  // old version fix
  if (game.researchSpeed.length == 5) {
    for (var i = 0; i < 4; i++) {
      game.researchSpeed.push(0);
      game.researchLevel.push(0);
      game.researchProgress.push(0);
    }
  }
}
function hardReset() {
  for (const i in tempGame) {
    game[i] = tempGame[i];
  }
  save();
}
