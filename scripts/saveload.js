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
  programActive: new Array(15).fill(0),
  money: D(0),
  shopBought: new Array(15).fill(0),
  researchPoint: D(0),
  researchSpeed: new Array(9).fill(0),
  researchLevel: new Array(9).fill(0),
  researchProgress: new Array(9).fill(0),
  rebootTime: new Date().getTime(),
  t2toggle: 0,
  t2time: 0,
  t2resets: D(0),
  optionToggle: new Array(9).fill(1),
  theme: 0,
  notation: 0,
  hyperMode: false,
  achievements: [],
  durability: D(1),
  t3toggle: 0,
  t3resets: D(0),
  quantumLab: D(0),
  maxQuantumLab: D(0),
  qubit: D(0),
  qubitProgress: D(0),
  quantumUpgradeBought: [],
  quantumUpgradePreset: {},
  quantumAutomateToggle: new Array(7).fill(1),
  quantumTime: new Date().getTime(),
  t4toggle: 0,
  t4resets: D(0),
  t4resetTime: 1e110,
  singularityTime: new Date().getTime(),
  singularityGrid: {},
  singularityPower: D(0),
  wormholeChallengeProgress: new Array(8).fill(0),
  challengeRecord: new Array(8).fill(D(0)),
  challengeEntered: -1,
  b: 0,
  infinityPoint: D(0),
  t5toggle: 0,
  t5resets: D(0),
  t5resetTime: 0,
  t5record: 1e200,
  bestIp: D(0),
  infinityUpgradeSpent: new Array(5).fill(D(0)),
  ipPassiveBought: 0
};
game = {};

//            vvv    commandAppear=1
function save(c=1) {
  if ((new Date().getTime())-game.lastRestoreSaved >= 1000*3600) {
    localStorage[`CalculatorEvolution2_restore${game.saveRestorePoint%24}`] = JSON.stringify(game);
    game.saveRestorePoint++;
    game.lastRestoreSaved = new Date().getTime();
  }
  localStorage[savePoint] = JSON.stringify(game);
  if (c) commandAppend('save', 70);
}
function load(c=1) {
  // type fix
  // Number(string) -> Deciamal
  for (const i in tempGame) {
    if (Array.isArray(tempGame[i])) {
      var temp = tempGame[i];
      game[i] = [];

      for (var j = 0, l = temp.length; j < l; j++) {
        if (temp[j] instanceof Decimal) {
          game[i].push(D(temp[j]));
        } else {
          game[i].push(temp[j]);
        }
      }
    } else if (tempGame[i] instanceof Decimal) {
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
    if (typeof tempLoad[i] == "undefined") continue;
    if (tempGame[i] instanceof Decimal) {
      game[i] = D(tempLoad[i]);
    } else {
      game[i] = tempLoad[i];
    }
  }
  for (var i = 0, l = game.challengeRecord.length; i < l; i++) game.challengeRecord[i] = D(game.challengeRecord[i]);
  for (var i = 0, l = game.infinityUpgradeSpent.length; i < l; i++) game.infinityUpgradeSpent[i] = D(game.infinityUpgradeSpent[i]);
  // Obj -> SingularityMachine
  for (var i in game.singularityGrid) {
    game.singularityGrid[i] = new SingularityMachine(game.singularityGrid[i]);
    game.singularityGrid[i].value = D(game.singularityGrid[i].value);
  }

  // old version fix
  if (game.researchSpeed.length == 5) {
    for (var i = 0; i < 4; i++) {
      game.researchSpeed.push(0);
      game.researchLevel.push(0);
      game.researchProgress.push(0);
    }
  }
  if (game.b == 0) {
    game.quantumUpgradeBought = [];
    dokeepMilestone();
    game.b++;
  }

  // offline progress delete
  gamePauseFix(new Date().getTime() - game.tLast);

  // bug fix
  game.quantumUpgradeBought = [...new Set(game.quantumUpgradeBought)];
  if (game.t5record < 0) game.t5record = 1e200;

  if (c) commandAppend('load', 70);
}
function hardReset() {
  for (const i in tempGame) {
    game[i] = tempGame[i];
  }
  save();
}

function exportGame() {
  copyText(btoa(JSON.stringify(game)));
  commandAppend('export game to clipboard');
}
function importGame() {
  var recSaveFile = atob(window.prompt("Import Savefile here", ""));
  try {
    game = JSON.parse(recSaveFile);
    save(0);;
    load(0);
    commandAppend('import string to game');
  } catch (e) {
    console.log(e);
    commandAppend('invaild savefile!', -110, 1);
  }
  basicInits();
}
function undoGame() {
  var uSave = JSON.parse(localStorage[`CalculatorEvolution2_restore${(game.saveRestorePoint-1)%24}`]);
  if (game.saveRestorePoint-uSave.saveRestorePoint == 1) {
    if (!confirm(`Are you sure to load ${timeNotation((new Date().getTime() - uSave.lastRestoreSaved)/1000)} ago save?`)) return;
    game = uSave;
    save(0);
    load(0);
    commandAppend("load backup #" + uSave.saveRestorePoint)
  } else {
    alert("no backup found!");
  }
  setTheme();
}

function openSavefileList() {
  
}