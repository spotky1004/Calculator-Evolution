function rebootReset() {
  game.rebootNum = D(0);
  game.durability = D(1).mul(game.researchLevel[5]+1);
  if (!game.programActive[4]) {
    for (var i = 0; i < game.programActive.length; i++) {
      game.programActive[i] = 0;
    }
    game.base = D(2);
  }
  if (!game.programActive[4] || game.shopBought[2] < 2) game.digits = D(1);
  if (!game.programActive[4] || game.shopBought[2] < 2) game.number = D(0);
  if (!game.programActive[4] || game.shopBought[2] < 3) game.money = D(0);
  if (!game.programActive[4] || game.shopBought[2] < 3) game.shopBought[5] = 0;
  game.rebootTime = new Date().getTime();
}

function quantumReset() {
  if (!game.quantumUpgradeBought.includes('65')) game.programActive[4] = false;
  rebootReset();
  if (!game.quantumUpgradeBought.includes('63')) game.researchPoint = D(0);
  if (game.achievements.includes(22)) game.researchPoint = game.researchPoint.add(100);
  for (var i = 0; i < 9; i++) {
    game.researchProgress[i] = 0;
    if (!game.quantumUpgradeBought.includes('66')) game.researchLevel[i] = (game.quantumUpgradeBought.includes('62') ? Math.min(3, game.researchLevel[i]) : 0);
    game.researchSpeed[i] = 0;
  }
  game.durability = D(1).mul(game.researchLevel[5]+1);
  if (!game.quantumUpgradeBought.includes('66')) {
    for (var i = 0; i < 15; i++) {
      if (i < 5) {
        if (game.quantumUpgradeBought.includes('64')) continue;
        if (game.quantumUpgradeBought.includes('61')) {
          game.shopBought[i] = Math.min(1, game.shopBought[i]);
          continue;
        }
      }
      game.shopBought[i] = 0;
    }
  }
  if (game.quantumUpgradeBought.includes('41') && game.researchLevel[1] < 2) game.researchLevel[1] = 2;
  game.quantumTime = new Date().getTime();
  game.t2resets = D(0);
}

function singularityReset() {
  if (!game.quantumUpgradeBought.includes('67')) game.quantumUpgradeBought = [];
  quantumReset();
  if (!game.quantumUpgradeBought.includes('67')) game.qubit = D(0);
  if (!game.quantumUpgradeBought.includes('67')) game.qubitProgress = D(0);
  if (!game.quantumUpgradeBought.includes('67')) game.quantumLab = D(0);
  game.singularityTime = new Date().getTime();
  singularityMachineChanged();
  game.t3resets = D(0);
  dokeepMilestone();
}

function infinityReset() {
  game.quantumUpgradeBought = [];
  game.singularityPower = D(0);
  game.t4resets = D(0);
  if (game.ipPassiveBought < 7) game.singularityGrid = {};
  if (game.ipPassiveBought < 5) game.wormholeChallengeProgress = new Array(8).fill(0);
  if (game.ipPassiveBought < 3) game.challengeRecord = new Array(8).fill(D(0));
  game.challengeEntered = -1;
  singularityReset();

  if (game.ipPassiveBought >= 1) game.singularityPower = D.max(game.singularityPower, game.t5resets);
}
