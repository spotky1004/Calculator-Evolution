(function(){
  quantumUpgrades = {};
})();

function quantum() {
  // can quantum check
  if (calcQuantumLabGain().lt(1)) return;

  // give quantum lab
  game.quantumLab = game.quantumLab.add(calcQuantumLabGain());
  commandAppend(`Built your ${ordNum(game.quantumLab)} Quantum Lab!`, 161, 1);

  // reset func
  quantumReset();
}
function renderQunatum() {
  $("#quantumButton").className = calcQuantumLabGain().gte(1) ? "" : "disabled";
  $("#quantumLabCost").innerHTML = `Next Lab: ${dNotation(D(1e100).mul(D(1e10).pow(game.quantumLab**2)), 0)}$, ${dNotation(D(1e11).mul(D(10).pow(game.quantumLab**2)), 0)} RP`;
  $("#quantumDesc").innerHTML = `You have ${game.quantumLab} Quantum Lab which makes Qubit Prodution ${dNotation(calcQubitSpeed(), 4, 0)}x faster<br>Each Qubit makes your CPU 2x faster (x${dNotation(calcQubitEffect(), 4, 0)})`;
  $("#qubitDisplay").innerHTML = `You have ${game.qubit.sub(calcUsedQubit())}/${game.qubit} Qubit (next Qubit in ${dNotation(D(3).pow(game.qubit.add(1)).sub(game.qubitProgress).div(calcQubitSpeed()), 3, 2)} sec)`;
}
function calcQuantum() {
  game.qubitProgress = game.qubitProgress.add(calcQubitSpeed().mul(tGain));
  game.qubit = D.max(0, game.qubitProgress.log(3)).floor(0);
}

function getMaxQuantumLabGain() {
  return D(1);
}
function calcQuantumLabGain() {
  // Money: e100, e110, e130, e160...
  var fromMoneyGain = game.money.div(1e100).log(10).div(10).sqrt(2).add(1);
  if (fromMoneyGain.isNaN()) fromMoneyGain = D(0);
  // RP   : e11 , e12 , e14 , e17 ...
  var fromRpGain = game.researchPoint.div(1e11).log(10).sqrt(2).add(1);
  if (fromRpGain.isNaN()) fromRpGain = D(0);

  var labGain = D.min(
    fromMoneyGain,
    fromRpGain,
    getMaxQuantumLabGain()
  ).sub(game.quantumLab);

  return labGain;
}

function calcQubitSpeed() {
  return game.quantumLab.pow(game.quantumLab.sqrt(2)).mul(D(10).pow(game.quantumLab.sub(1))).sub(0.1);
}
function calcUsedQubit() {
  return D(0);
}
function calcQubitEffect() {
  return D(2).pow(game.qubit);
}
