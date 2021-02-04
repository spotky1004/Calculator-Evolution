(function(){
  savePoint = 'CalculatorEvolution2';
})();

tempGame = {
  gameSpeed: 1,
  lastRestoreSaved: 0,
  saveRestorePoint: 0,
  startTime: new Date().getTime(),
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
  rebootTime: new Date().getTime(),
  t2toggle: 0,
  t2resets: D(0),
  optionToggle: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  achievements: [],
  durability: D(1),
  t3toggle: 0,
  t3resets: D(0),
  quantumLab: D(0),
  qubit: D(0),
  qubitProgress: D(0),
  quantumUpgradeBought: [],
  quantumUpgradePreset: {},
  quantumAutomateToggle: [1, 1, 1, 1, 1, 1],
  quantumTime: new Date().getTime(),
  t4toggle: 0,
  t4resets: D(0),
  singularityTime: new Date().getTime(),
  singularityMachine: {},
  singularityGrid: {},
  singularityGridActivate: 0,
  singularityPower: D(0),
};
game = {};

function save() {
  if ((new Date().getTime())-game.lastRestoreSaved >= 1000*3600) {
    localStorage[`CalculatorEvolution2_restore${game.saveRestorePoint%24}`] = JSON.stringify(game);
    game.saveRestorePoint++;
    game.lastRestoreSaved = new Date().getTime();
  }
  localStorage[savePoint] = JSON.stringify(game);
  commandAppend('save', 70);
}
function load() {
  // type fix
  // Number
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
  // singularityGrid
  for (var i in game.singularityGrid) {
    singularityGrid[i] = new singularityMachine(game.singularityGrid[i]);
  }

  // old version fix
  if (game.researchSpeed.length == 5) {
    for (var i = 0; i < 4; i++) {
      game.researchSpeed.push(0);
      game.researchLevel.push(0);
      game.researchProgress.push(0);
    }
  }

  commandAppend('load', 70);
}
function hardReset() {
  for (const i in tempGame) {
    game[i] = tempGame[i];
  }
  save();
}

function exportGame() {
  prompt("Your Savefile:", btoa(JSON.stringify(game)));
}
function importGame() {
  var recSaveFile = atob(window.prompt("Import Savefile here", ""));
  try {
    game = JSON.parse(recSaveFile);
    save();
    load();
  } catch (e) {
    alert("Invaild Savefile!");
  }
}
