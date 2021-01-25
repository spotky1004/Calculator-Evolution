(function(){
  // upgrade
  quantumUpgradeDesc = [
    // 1: Base
    [
      "CPU upgrade effect x${dNotation(1.1, 0, 1)} (x${!game.quantumUpgradeBought.includes('11') ? dNotation(calcCpuUpgradeEffect(), 0, 1) : dNotation(calcCpuUpgradeEffect().div(1.1), 0, 1)} -> x${!game.quantumUpgradeBought.includes('11') ? dNotation(calcCpuUpgradeEffect().mul(1.1), 0, 1) : dNotation(calcCpuUpgradeEffect(), 0, 1)})",
      "Increase digit cap based on base (+${dNotation(game.base.pow(0.6).floor(), 4, 0)})",
      "'Bonus CPU Level' research's effect x2",
      "Each Quantum Lab Boosts CPU by x27 (x${dNotation(D(27).pow(game.quantumLab), 4, 0)})",
      "Each Qubit boosts Mine Power by x2.4 (x${dNotation(D(2.4).pow(game.qubit), 4, 0)})",
      "Coming Soon!"
    ],
    // 2: Research
    [
      "RP gain x10",
      "Boost RP gain based on Qubit and RP (x${dNotation(D(1.2).pow(game.qubit).pow(D.min(game.researchPoint.add(1).log(10).div(25), 1)), 4, 2)})",
      "Multiply research upgrade effect by x10 (x${!game.quantumUpgradeBought.includes('23') ? dNotation(calcPerResearchSpeedBase(), 4, 0) : dNotation(calcPerResearchSpeedBase().div(10), 4, 0)} -> x${!game.quantumUpgradeBought.includes('23') ? dNotation(calcPerResearchSpeedBase().mul(10), 4, 0) : dNotation(calcPerResearchSpeedBase(), 4, 0)})",
      "Boost Research speed based on Time spent on this quantum and RP (x${dNotation(D(2).pow(D(game.tLast-game.quantumTime).pow(0.2)).pow(D.min(10, D.max(1, game.researchPoint.log(10).div(20)))), 4, 2)})",
      "Remove money requirement from research",
      //Each Qubit add Research upgrade before multiply by +10 (${!game.quantumUpgradeBought.includes('25') ? dNotation(calcPerResearchSpeedBaseBeforeMult(), 4, 0) : dNotation(calcPerResearchSpeedBaseBeforeMult().sub(game.qubit.mul(10)), 4, 0) } -> ${!game.quantumUpgradeBought.includes('25') ? dNotation(calcPerResearchSpeedBaseBeforeMult().add(game.qubit.mul(10)), 4, 0) : dNotation(calcPerResearchSpeedBaseBeforeMult(), 4, 0) })
      "Coming Soon!"
    ],
    // 3: Quantum
    [
      "Qubit production speed x100",
      "Pow Quantum requirements based on Base (^${dNotation(D(0.999).pow(D.min(200, game.base)), 4, 5)})",
      "Each Qubit boosts itself Production Speed by x1.3 (x${dNotation(D(1.3).pow(game.qubit), 4, 2)})",
      "Boost Qubit production speed based on Number (x${dNotation(D.min(game.number.add(1).log(10).div(10).sqrt(2), 1).add(1).pow(game.number.add(1).log(10).pow(0.6)), 4, 2)})",
      "Coming Sooner!",
      "You can bulk buy Quantum Labs"
    ],
    // 4: QoL
    [
      "Start run with level 2 Multi Process<br><b style=\"opacity: 0.6\">You need to do 'Reset Quantum Run' to get effect!</b>",
      "Durability decrease speed /100",
      "Reboot cooldown /5",
      "Coming Soon!",
      "Coming Soon!",
      "Coming Soon!"
    ],
    // 5: Automate
    [
      "Automate Program buy<br><b style=\"opacity: 0.6\">You can click again Automates after buy to toggle!</b>",
      "Automate Reboot",
      "Automate research buy first row",
      "Automate research buy second row",
      "Automate research buy third row",
      "Automate Quantum Lab"
    ],
    // 6: Keep
    [
      "Keep bought Programs (~Lv 1)",
      "Keep all research for Level 3",
      "Keep RP",
      "Keep bought Programs (All)",
      "Data_Holder.exe will keep through Quantum",
      "Keep all research"
    ]
  ];
  quantumUpgradeNames = ["Base", "Research", "Quantum", "QoL", "Automate", "Keep"];
  quantumUpgradeRespecConfrim = 10;
  quantumUpgradeRestartConfrim = 10;

  (function(){
    // upgrade init
    for (var i = 0; i < 36; i++) {
      var upNode = document.createElement("span");
      upNode.classList.add('quantumUpgrade');
      upNode.style.setProperty("--col", hsvToRgb(Math.floor(i%6)/12, 0.5+i/150, 0.5+i/300));
      upNode.style.setProperty("--col2", hsvToRgb(Math.floor(i%6)/12, 0.5+i/150-0.3, 0.5+i/300-0.3));
      upNode.onmouseover = new Function(`displayQuantumUpgradeDesc.bind(this)(${i})`);
      upNode.onmouseout = new Function(`hideQuantumUpgradeDesc()`);
      upNode.onclick = new Function(`buyQuantumUpgrade.bind(this)(${i})`);
      $('#quantumUpgrades').append(upNode);
      //if (i%6 >= 4 || Math.floor(i/6) >= 4) upNode.style.opacity = 0.3;
    }
  })();

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
  $("#quantumLabCost").innerHTML = `Next Lab: ${dNotation(D(1e100).mul(D(10).pow(D(5).mul(game.quantumLab.mul(game.quantumLab.sub(1)).add(game.quantumLab)))).pow(getQuantumReqPow()), 2)}$, ${dNotation(D(1e11).mul(D(10).pow(D(1/2).mul(game.quantumLab.mul(game.quantumLab.sub(1)).add(game.quantumLab)))).pow(getQuantumReqPow()), 2)} RP`;
  $("#quantumDesc").innerHTML = `You have ${game.quantumLab} Quantum Lab which makes Qubit Prodution ${dNotation(calcQubitSpeed(), 4, 0)}x faster<br>Each Qubit makes your CPU 2x faster (x${dNotation(calcQubitEffect(), 4, 0)})`;
  $("#qubitDisplay").innerHTML = `You have ${game.qubit.sub(calcUsedQubit())}/${game.qubit} Qubit (next Qubit in ${timeNotation(D(3).pow(game.qubit.add(1)).sub(game.qubitProgress).div(calcQubitSpeed()))})`;
  for (var i = 0; i < 36; i++) document.getElementsByClassName("quantumUpgrade")[i].classList[(game.quantumUpgradeBought.includes((i%6+1) + '' + (Math.floor(i/6)+1)) ? 'add' : 'remove')]("bought");
  for (var i = 0; i < 6; i++) document.getElementsByClassName("quantumUpgrade")[4+i*6].classList[(game.quantumUpgradeBought.includes(((4+i*6)%6+1) + '' + Math.floor((4+i*6)/6+1)) && !game.quantumAutomateToggle[i] ? 'add' : 'remove')]("deactivated");
}
function calcQuantum() {
  game.qubitProgress = game.qubitProgress.add(calcQubitSpeed().mul(tGain));
  game.qubit = D.max(0, game.qubitProgress.add(1).log(3)).floor(0);
  calcQuantumAuto();
}
function calcQuantumAuto() {
  if (game.quantumUpgradeBought.includes('51') && game.quantumAutomateToggle[0]) for (var i = 0; i < 5; i++) shopBuy(i);
  if (game.quantumUpgradeBought.includes('52') && game.quantumAutomateToggle[1]) reboot();
  if (game.quantumUpgradeBought.includes('53') && game.quantumAutomateToggle[2]) for (var i = 0; i < 3; i++) researchBuy(i);
  if (game.quantumUpgradeBought.includes('54') && game.quantumAutomateToggle[3]) for (var i = 3; i < 6; i++) researchBuy(i);
  if (game.quantumUpgradeBought.includes('55') && game.quantumAutomateToggle[4]) for (var i = 6; i < 8; i++) researchBuy(i);
  if (game.quantumUpgradeBought.includes('56') && game.quantumAutomateToggle[5]) quantum();
}

function displayQuantumUpgradeDesc(idx) {
  var tempCols = [getComputedStyle(this).getPropertyValue("--col"), getComputedStyle(this).getPropertyValue("--col2")];
  var fixedIdx = [Math.floor(idx/6), idx%6]
  $("#quantumUpgradeDesc").innerHTML = `
    <p style="color: ${tempCols[1]}; text-shadow: 0 0 0.5vh ${tempCols[0]}, 0 0 0.5vh ${tempCols[0]}, 0 0 0.5vh ${tempCols[0]}, 0 0 0.5vh ${tempCols[0]}, 0 0 0.5vh ${tempCols[0]}, 0 0 0.5vh ${tempCols[0]}, 0 0 0.5vh ${tempCols[0]}, 0 0 0.5vh ${tempCols[0]}, 0 0 0.5vh ${tempCols[0]}; font-size: 2vh;">
      ${quantumUpgradeNames[fixedIdx[1]]} ${romanize(fixedIdx[0]+1).toUpperCase()}
    </p><br>
    ${new Function('return `' + quantumUpgradeDesc[fixedIdx[1]][fixedIdx[0]] + '`')()}<br>
    Cost: ${getQuantumUpgradeCost(idx)} Qubit
  `;
  $("#quantumUpgradeDesc").style.opacity = 1;
  $("#quantumUpgradeDesc").style.top = this.offsetTop + 'px';
  $("#quantumUpgradeDesc").style.transform = 'scaleX(1)';
  $("#quantumUpgradeDesc").style.left = this.offsetLeft + (fixedIdx[1] >= 3 ? -$("#quantumUpgradeDesc").offsetWidth : innerWidth/25 ) + 'px';
}
function hideQuantumUpgradeDesc() {
  $("#quantumUpgradeDesc").style.transform = 'scaleX(0)';
  $("#quantumUpgradeDesc").style.opacity = 0;
}
function buyQuantumUpgrade(idx) {
  var fixedIdx = [Math.floor(idx/6), idx%6];
  ifStat: if (game.qubit.sub(calcUsedQubit()).gte(getQuantumUpgradeCost(idx)) && !game.quantumUpgradeBought.includes((fixedIdx[1]+1) + '' + (fixedIdx[0]+1)) ) {
    // buy
    game.quantumUpgradeBought.push((fixedIdx[1]+1) + '' + (fixedIdx[0]+1));
    calcQuantum();
    renderQunatum();
  } else if (fixedIdx[1] == 4) {
    // auto toggle
    if (!game.quantumUpgradeBought.includes((fixedIdx[1]+1) + '' + (fixedIdx[0]+1))) break ifStat;
    game.quantumAutomateToggle[fixedIdx[0]] ^= 1;
  }
}
function getQuantumUpgradeCost(idx) {
  var fixedIdx = [Math.floor(idx/6), idx%6];
  return Math.floor((Math.floor((fixedIdx[0]*2)**1.7+2)*Math.floor(fixedIdx[1]==5?fixedIdx[1]**1.2+5:1)+fixedIdx[0]*3)**(fixedIdx[0]==5&&fixedIdx[1]!=5?1.3:1)/(fixedIdx[1]==3||fixedIdx[1]==4?fixedIdx[1]/5+1:1));
}
function quantumUpgradeRespec() {
  if (typeof qRespecTimeout != "undefined") clearTimeout(qRespecTimeout);
  quantumUpgradeRespecConfrim--;
  $("#quantumRespec").innerHTML = `${quantumUpgradeRespecConfrim} more clicks!`;
  if (quantumUpgradeRespecConfrim == 0) {
    quantumUpgradeRespecConfrim = 10;
    $("#quantumRespec").innerHTML = `Respec <span style="opacity: var(--tempOp); display: var(--tempDis)">& Quantum Reset<span>`;
    clearTimeout(qRespecTimeout);
    commandAppend("respec quantumUpgrades", 161);
    game.quantumUpgradeBought = [];
    quantumReset();
  }
  qRespecTimeout = setTimeout( function () {
    $("#quantumRespec").innerHTML = `Respec <span style="opacity: var(--tempOp); display: var(--tempDis)">& Quantum Reset<span>`;
    quantumUpgradeRespecConfrim = 10;
  }, 3000);
}
function quantumRestart() {
  if (typeof qRestartTimeout != "undefined") clearTimeout(qRestartTimeout);
  quantumUpgradeRestartConfrim--;
  $("#quantumRestart").innerHTML = `${quantumUpgradeRestartConfrim} more clicks!`;
  if (quantumUpgradeRestartConfrim == 0) {
    quantumUpgradeRestartConfrim = 10;
    $("#quantumRestart").innerHTML = `Restart <span style="opacity: var(--tempOp); display: var(--tempDis)">Quantum Run<span>`;
    clearTimeout(qRestartTimeout);
    commandAppend("reset quantumLevel", 161);
    quantumReset();
  }
  qRestartTimeout = setTimeout( function () {
    $("#quantumRestart").innerHTML = `Restart <span style="opacity: var(--tempOp); display: var(--tempDis)">Quantum Run<span>`;
    quantumUpgradeRestartConfrim = 10;
  }, 3000);
}

function getMaxQuantumLabGain() {
  return game.quantumUpgradeBought.includes('36') ? D(Infinity) : D(1);
}
function getQuantumReqPow() {
  return game.quantumUpgradeBought.includes('32') ? D(0.999).pow(D.min(200, game.base)) : 1;
}
function calcQuantumLabGain() {
  // Money: start from e100, +e5, +e15, +e25, +e35  ... -> (n*(n-1)+n)*5
  var fromMoneyGain = game.money.pow(D(1).div(getQuantumReqPow())).div(1e100).log(10).div(5).sqrt(2).add(1);
  if (fromMoneyGain.isNaN()) fromMoneyGain = D(0);
  // RP   : start from e11, +10^0.5, +10^1.5, +10^2.5 ... -> (n*(n-1)+n)/2
  var fromRpGain = game.researchPoint.pow(D(1).div(getQuantumReqPow())).div(1e11).log(10).mul(2).sqrt(2).add(1.000004); // <- .000004 is for floting point fix
  if (fromRpGain.isNaN()) fromRpGain = D(0);

  var labGain = D.min(
    D.min(
    fromMoneyGain,
    fromRpGain,
    ).sub(game.quantumLab),
    getMaxQuantumLabGain()
  );

  return labGain;
}

function calcQubitSpeed() {
  var tempSpd = game.quantumLab.pow(game.quantumLab.sqrt(2)).mul(D(10).add(game.quantumLab.pow(2)).pow(game.quantumLab.sub(1))).sub(0.1);
  if (game.quantumUpgradeBought.includes('31')) tempSpd = tempSpd.mul(100);
  if (game.quantumUpgradeBought.includes('33')) tempSpd = tempSpd.mul(D(1.3).pow(game.qubit));
  if (game.quantumUpgradeBought.includes('34')) tempSpd = tempSpd.mul(D.min(game.number.add(1).log(10).div(10).sqrt(2), 1).add(1).pow(game.number.add(1).log(10).pow(0.6)));
  return tempSpd;
}
function calcUsedQubit() {
  var tempUsed = D(0);
  for (var i = 0; i < 36; i++) {
    var fixedIdx = [Math.floor(i/6), i%6];
    if (game.quantumUpgradeBought.includes((fixedIdx[1]+1) + '' + (fixedIdx[0]+1))) {
      tempUsed = tempUsed.add(getQuantumUpgradeCost(i));
    }
  }
  return tempUsed;
}
function calcQubitEffect() {
  return D(2).pow(game.qubit);
}
