(function(){
  // upgrade
  quantumUpgradeDesc = [
    // 1: Base
    [
      "CPU upgrade effect x${dNotation(1.1, 0, 1)} (x${!game.quantumUpgradeBought.includes('11') ? dNotation(calcCpuUpgradeEffect(), 0, 1) : dNotation(calcCpuUpgradeEffect().div(1.1), 0, 1)} -> x${!game.quantumUpgradeBought.includes('11') ? dNotation(calcCpuUpgradeEffect().mul(1.1), 0, 1) : dNotation(calcCpuUpgradeEffect(), 0, 1)})",
      "Increase digit cap based on base (+${dNotation(game.base.pow(0.6).floor(), 4, 0)})",
      "'Bonus CPU Level' research's effect x2",
      "Each Quantum Lab Boosts CPU by x27 (x${dNotation(D(27).pow(game.quantumLab), 4, 0)})",
      "Each Grey digit boosts CPU by x30 (x${dNotation(D.max(1, D(30).pow(D.max(0, calcMaxDigit().sub(calcMaxDigit().lt(2000)?game.digits:0)))), 4, 0)})<br><b style=\"opacity: 0.6\">If max base is bigger than 2000, this bonus will based on max Digit</b>",
      "RP boosts CPU (x${dNotation(game.researchPoint.add(1).pow(0.25), 4, 1)})<br>And sqrt Quantum Lab RP req",
      "SP boosts CPU (x${dNotation(D(10).pow(game.singularityPower.pow(0.5)), 2, 1)})"
    ],
    // 2: Research
    [
      "RP gain x10",
      "Boost RP gain based on Qubit and RP (x${dNotation(D(1.2).pow(game.qubit).pow(D.min(game.researchPoint.add(1).log(10).div(25), 1)), 4, 2)})",
      "Multiply research upgrade effect by x10 (x${!game.quantumUpgradeBought.includes('23') ? dNotation(calcPerResearchSpeedBase(), 4, 0) : dNotation(calcPerResearchSpeedBase().div(10), 4, 0)} -> x${!game.quantumUpgradeBought.includes('23') ? dNotation(calcPerResearchSpeedBase().mul(10), 4, 0) : dNotation(calcPerResearchSpeedBase(), 4, 0)})",
      "Boost Research speed based on Time spent on this quantum and RP (x${dNotation(D(2).pow(D(game.tLast-game.quantumTime).pow(0.2)).pow(D.min(10, D.max(1, game.researchPoint.log(10).div(20)))), 4, 2)})",
      "Remove money requirement from research",
      "Research levels boosts RP gain (x${dNotation(game.researchLevel.reduce((a, b) => a.mul(b**2+1), D(1)).pow(3), 4, 1)})<br>And sqrt Quantum Lab Money req",
      "Multiply research upgrade effect by x4 (x${!game.quantumUpgradeBought.includes('27') ? dNotation(calcPerResearchSpeedBase(), 4, 0) : dNotation(calcPerResearchSpeedBase().div(4), 4, 0)} -> x${!game.quantumUpgradeBought.includes('27') ? dNotation(calcPerResearchSpeedBase().mul(4), 4, 0) : dNotation(calcPerResearchSpeedBase(), 4, 0)})"
    ],
    // 3: Quantum
    [
      "Qubit production speed x100",
      "The Quantum requirements based on Base (^${dNotation(D(0.999).pow(D.min(calcQuantum2Cap(), game.base)), 4, 5)})",
      "Each Qubit boosts itself Production Speed by x1.3 (x${dNotation(D(1.3).pow(game.qubit), 4, 2)})",
      "Boost Qubit production speed based on Number (x${dNotation(D.min(game.number.add(1).log(10).div(10).sqrt(2), 1).add(1).pow(game.number.add(1).log(10).pow(0.6)), 4, 2)})",
      "Each bought Quantum Upgrade boosts Qubit gain by x10 (x${dNotation(D(10).pow([...new Set(game.quantumUpgradeBought)].length), 0)})",
      "You can bulk buy Quantum Labs<br>And extend the cap of Quantum II (${!game.quantumUpgradeBought.includes('36') ? dNotation(calcQuantum2Cap(), 4, 0) : dNotation(calcQuantum2Cap().div(5), 0, 1)} -> ${!game.quantumUpgradeBought.includes('36') ? dNotation(calcQuantum2Cap().mul(5), 0, 1) : dNotation(calcQuantum2Cap(), 0, 1)})",
      "Extend the cap of Quantum II (${!game.quantumUpgradeBought.includes('37') ? dNotation(calcQuantum2Cap(), 4, 0) : dNotation(calcQuantum2Cap().div(2), 0, 1)} -> ${!game.quantumUpgradeBought.includes('37') ? dNotation(calcQuantum2Cap().mul(2), 0, 1) : dNotation(calcQuantum2Cap(), 0, 1)})"
    ],
    // 4: QoL
    [
      "Start run with level 2 Multi Process",
      "You can bulk buy Research upgrades and Shop upgrades",
      "Generate RP per second based on Reboot cooldown (${dNotation(Math.floor(30*(1/calcRebootCooldown())*1000), 2, 0)}%)",
      "Reboot cooldown /10",
      "<b>\"Base_Increaser.exe\"</b> will land you to <b>\"Maximum Base\"</b><br>${calcMaxDigit().lte(2000)?'<b style=\"opacity: 0.6\">':''}<b>\"Memory.exe\"</b> will land you to <b>\"Digits based on Number/s\"</b>${calcMaxDigit().lte(2000)?'</b>':''}<br><b style=\"opacity: 0.6\">Memory.exe boost works if maximum digit is greater than 2000</b>",
      "Instant finish Qubit make if pending time is less than 7 mins",
      "Process exceed won't block anything"
    ],
    // 5: Automate
    [
      "Automate Program buy<br><b style=\"opacity: 0.6\">You can click Automate upgrades again to toggle them!</b>",
      "Automate Reboot",
      "Automate research buy first row",
      "Automate research buy second row",
      "Automate research buy third row",
      "Automate Quantum Lab",
      "Automate Singularity"
    ],
    // 6: Keep
    [
      "Keep bought Programs (~Lv 1)",
      "Keep all research for Level 3",
      "Keep RP",
      "Keep bought Programs (All)",
      "Data_Holder.exe will keep through Quantum",
      "Keep all research and CPU Upgrade",
      "Above upgrades will keep through Singularity<br>Keep Quantum Lab & Qubits<br><b style=\"opacity: 0.6\">exclude challenge enter</b>"
    ],
    // 7: Singularity
    [
      "Multiply Grid Machine Power Based on QL (x${dNotation(D(1.01).pow(game.quantumLab).mul(game.quantumLab.pow(2)).add(1), 4, 2)})",
      "Multiply SP gain Based on Time spent on this Singularity (x${dNotation(D(10).mul(((new Date().getTime() - game.singularityTime)/1000)**0.6), 4, 2)})",
      "Multiply SP gain based on QL (x${dNotation(D(2).pow(D(game.quantumLab).pow(1/3)), 3, 1)})",
      "Multiply SP gain based on Challenge Recordes (x${dNotation(game.challengeRecord.reduce((a, b) => a.mul(b.add(1)), D(1)).pow(1/4), 4, 1)})",
      "Boost SP's grid machine Power boost based on SP (^${dNotation(D(1).add(game.singularityPower.log(10).pow(0.8)), 4, 3)})",
      "Boost SP gain based on Processes (x${dNotation(calcMultiProcess(), 4, 0)})",
      "Passive SP Gain speed affected by Speed Boost"
    ]
  ];
  quantumUpgradeNames = ["Base", "Research", "Quantum", "QoL", "Automate", "Keep", "Singularity"];
  quantumUpgradeRespecConfrim = 10;
  quantumUpgradeRestartConfrim = 10;
  qUpgradeData = {
    count: 49, col: 7, row: 7,
    row123cost: [2, 8, 18, 32, 48, 155, 1213],
    row4cost: [1, 5, 11, 20, 30, 97, 400],
    row5cost: [1, 4, 10, 17, 26, 86, 4000],
    row6cost: [22, 58, 138, 262, 408, 587, "Infinity"],
    row7cost: [160, 4500, 24e3, 90e3, 100e3, 170e3, "Infinity"]
  };
  qUpgradeRendered = {a30: true, bought: [], force: false};

  // upgrade node init
  for (var i = 0; i < qUpgradeData.count; i++) {
    var upNode = document.createElement("span");
    upNode.classList.add('quantumUpgrade');
    upNode.style.setProperty("--col", hsvToRgb(Math.floor(i%qUpgradeData.col)/12, 0.5+i/150, 0.5+i/300));
    upNode.style.setProperty("--col2", hsvToRgb(Math.floor(i%qUpgradeData.col)/12, 0.5+i/150-0.3, 0.5+i/300-0.3));

    upNode.onmouseover = new Function(`displayQuantumUpgradeDesc.bind(this)(${i})`);
    upNode.onmouseout = new Function(`hideQuantumUpgradeDesc()`);

    upNode.onmousedown = new Function(`buyQuantumUpgrade.bind(this)(${i})`);
    $('#quantumUpgrades').append(upNode);
  }
})();

function quantum() {
  // can quantum check
  if (calcQuantumLabGain().lt(1)) return;

  // give quantum lab
  game.quantumLab = game.quantumLab.add(calcQuantumLabGain());
  game.maxQuantumLab = D.max(game.maxQuantumLab, game.quantumLab);
  commandAppend(`Built your ${ordNum(game.quantumLab)} Quantum Lab!`, 161, 1);

  game.t3resets = game.t3resets.add(1);

  // reset func
  quantumReset();
}
function renderQunatum() {
  $("#quantumButton").className = calcQuantumLabGain().gte(1) ? "" : "disabled";
  
  if (qUpgradeRendered.a30 != game.achievements.includes(30)) {
    qUpgradeRendered.a30 = game.achievements.includes(30);

    var qUpgradeNodes = document.getElementsByClassName("quantumUpgrade");
    
    $("#quantumUpgrades").style.setProperty("--n", game.achievements.includes(30) ? 7 : 6);

    // hide '7x' and 'x7' upgrades if locked
    if (game.achievements.includes(30)) {
      for (var i = 0; i < qUpgradeData.row; i++) qUpgradeNodes[6+i*qUpgradeData.col].style.display = "inline-block";
      for (var i = 0; i < qUpgradeData.col-1; i++) qUpgradeNodes[qUpgradeData.count-qUpgradeData.row+i].style.display = "inline-block";
    } else {
      for (var i = 0; i < qUpgradeData.row; i++) qUpgradeNodes[6+i*qUpgradeData.col].style.display = "none";
      for (var i = 0; i < qUpgradeData.col-1; i++) qUpgradeNodes[qUpgradeData.count-qUpgradeData.row+i].style.display = "none";
    }
  }

  if (qUpgradeRendered.bought.toString() != game.quantumUpgradeBought.toString() || qUpgradeRendered.force) {
    qUpgradeRendered.force = 0;
    qUpgradeRendered.bought = [...game.quantumUpgradeBought];

    var qUpgradeNodes = document.getElementsByClassName("quantumUpgrade");
    // fill bought upgrades
    for (var i = 0; i < qUpgradeData.count; i++) qUpgradeNodes[i].classList[(game.quantumUpgradeBought.includes((i%qUpgradeData.col+1) + '' + (Math.floor(i/qUpgradeData.row)+1)) ? 'add' : 'remove')]("bought");
    // automate toggle opacity
    for (var i = 0; i < qUpgradeData.row; i++) qUpgradeNodes[4+i*qUpgradeData.col].classList[(game.quantumUpgradeBought.includes(((4+i*qUpgradeData.col)%qUpgradeData.col+1) + '' + Math.floor((4+i*qUpgradeData.col)/qUpgradeData.row+1)) && !game.quantumAutomateToggle[i] ? 'add' : 'remove')]("deactivated");
  }
  
  var qLabGain = calcQuantumLabGain();
  var afterQuantumLab = (game.quantumUpgradeBought.includes('36') ? D.max(game.quantumLab, game.quantumLab.add(qLabGain.floor(0))) : game.quantumLab);
  $("#quantumLabCost").innerHTML = `Next Lab: ${dNotation(D(1e100).mul(D(10).pow(D(5).mul(afterQuantumLab.mul(afterQuantumLab.sub(1)).add(afterQuantumLab)))).pow(getQuantumReqPow()[0]), 2)}$, ${dNotation(D(1e11).mul(D(10).pow(D(1/2).mul(afterQuantumLab.mul(afterQuantumLab.sub(1)).add(afterQuantumLab)))).pow(getQuantumReqPow()[1]), 2)} RP`;
  $("#quantumLabQuantity").innerHTML = (qLabGain.floor(0).lte(1)?'a':dNotation(qLabGain.floor(0)));
  $("#quantumDesc").innerHTML = `You have ${game.quantumLab} Quantum Lab which makes Qubit Prodution ${dNotation(calcQubitSpeed(), 4, 0)}x faster<br>Each Qubit makes your CPU 2x faster (x${dNotation(calcQubitEffect(), 4, 0)})`;
  $("#qubitDisplay").innerHTML = `You have ${game.qubit.sub(calcUsedQubit())}/${game.qubit} Qubit (next Qubit in ${timeNotation(D(3).pow(game.qubit.sub(calcChallengeDone()).add(1)).sub(game.qubitProgress).div(calcQubitSpeed()))})`;
}
function calcQuantum(dt=0) {
  if (game.quantumUpgradeBought.includes('46') && D(3).pow(game.qubit.sub(calcChallengeDone()).add(1)).sub(game.qubitProgress).div(calcQubitSpeed()).lte(60*7)) game.qubitProgress = D(3).pow(game.qubitProgress.add(1).log(3).ceil(0));
  game.qubitProgress = game.qubitProgress.add(calcQubitSpeed().mul(calcRealDt(dt)));
  game.qubit = D.max(0, game.qubitProgress.add(1).log(3)).floor(0).add(calcChallengeDone());
  calcQuantumAuto();
}
function calcQuantumAuto() {
  if (game.quantumUpgradeBought.includes('51') && game.quantumAutomateToggle[0]) for (var i = 0; i < 5; i++) shopBuy(i);
  if (game.quantumUpgradeBought.includes('52') && game.quantumAutomateToggle[1]) reboot();
  if (game.quantumUpgradeBought.includes('53') && game.quantumAutomateToggle[2] && tickDone%10 == 0) for (var i = 0; i < 3; i++) researchBuy(i);
  if (game.quantumUpgradeBought.includes('54') && game.quantumAutomateToggle[3] && (tickDone+1)%10 == 0) for (var i = 3; i < 6; i++) researchBuy(i);
  if (game.quantumUpgradeBought.includes('55') && game.quantumAutomateToggle[4] && (tickDone+2)%10 == 0) for (var i = 6; i < 8; i++) researchBuy(i);
  if (game.quantumUpgradeBought.includes('56') && game.quantumAutomateToggle[5]) quantum();
  if (game.quantumUpgradeBought.includes('57') && game.quantumAutomateToggle[6]) singularity();
}

function displayQuantumUpgradeDesc(idx) {
  if (documentHold) buyQuantumUpgrade(idx);
  var tempCols = [getComputedStyle(this).getPropertyValue("--col"), getComputedStyle(this).getPropertyValue("--col2")];
  var fixedIdx = [Math.floor(idx/qUpgradeData.row), idx%qUpgradeData.col]
  $("#quantumUpgradeDesc").innerHTML = `
    <p style="color: ${tempCols[1]}; text-shadow: 0 0 0.5vh ${tempCols[0]}, 0 0 0.5vh ${tempCols[0]}, 0 0 0.5vh ${tempCols[0]}, 0 0 0.5vh ${tempCols[0]}, 0 0 0.5vh ${tempCols[0]}, 0 0 0.5vh ${tempCols[0]}, 0 0 0.5vh ${tempCols[0]}, 0 0 0.5vh ${tempCols[0]}, 0 0 0.5vh ${tempCols[0]}; font-size: 2vh;">
      ${quantumUpgradeNames[fixedIdx[1]]} ${romanize(fixedIdx[0]+1).toUpperCase()}
    </p><br>
    ${new Function('return `' + quantumUpgradeDesc[fixedIdx[1]][fixedIdx[0]] + '`')()}<br>
    Cost: ${getQuantumUpgradeCost(idx)} Qubit
  `;
  $("#quantumUpgradeDesc").style.opacity = 1;
  $("#quantumUpgradeDesc").style.top = Math.min(innerHeight - $("#quantumUpgradeDesc").offsetHeight, this.offsetTop) + 'px';
  $("#quantumUpgradeDesc").style.transform = 'scaleX(1)';
  $("#quantumUpgradeDesc").style.left = this.offsetLeft + (fixedIdx[1] >= 3 ? -$("#quantumUpgradeDesc").offsetWidth : innerWidth/25 ) + 'px';
}
function hideQuantumUpgradeDesc() {
  $("#quantumUpgradeDesc").style.transform = 'scaleX(0)';
  $("#quantumUpgradeDesc").style.opacity = 0;
}
function buyQuantumUpgrade(idx) {
  var fixedIdx = [Math.floor(idx/qUpgradeData.row), idx%qUpgradeData.col];
  ifStat: if (game.qubit.sub(calcUsedQubit()).gte(getQuantumUpgradeCost(idx)) && !game.quantumUpgradeBought.includes((fixedIdx[1]+1) + '' + (fixedIdx[0]+1))) {
    // buy
    game.quantumUpgradeBought.push((fixedIdx[1]+1) + '' + (fixedIdx[0]+1));
    if (idx == 3) game.researchLevel[1] = Math.max(2, game.researchLevel[1]);
    calcQuantum();
    renderQunatum();
  } else if (fixedIdx[1] == 4) {
    // auto toggle
    if (!game.quantumUpgradeBought.includes((fixedIdx[1]+1) + '' + (fixedIdx[0]+1))) break ifStat;
    game.quantumAutomateToggle[fixedIdx[0]] ^= 1;
    qUpgradeRendered.force = true;
  }
}
function getQuantumUpgradeCost(idx) {
  var fixedIdx = [Math.floor(idx/qUpgradeData.row), idx%qUpgradeData.col];
  switch (fixedIdx[1]) {
    case 0: case 1: case 2:
      tempCost = qUpgradeData.row123cost[fixedIdx[0]];
      break; 
    case 3:
      tempCost = qUpgradeData.row4cost[fixedIdx[0]];
      break;
    case 4:
      tempCost = qUpgradeData.row5cost[fixedIdx[0]];
      break;
    case 5:
      tempCost = qUpgradeData.row6cost[fixedIdx[0]];
      break;
    case 6:
      tempCost = qUpgradeData.row7cost[fixedIdx[0]];
      break;
  }
  if (game.challengeEntered == 3 || game.challengeEntered == 7) tempCost *= 2;
  if (fixedIdx[1] == 5 && fixedIdx[0] < calcMilestoneDone()) tempCost = 0;
  return tempCost;
}
function quantumUpgradeRespec() {
  if (typeof qRespecTimeout != "undefined") clearTimeout(qRespecTimeout);
  if (quantumUpgradeRespecConfrim > calcQuantumResetClicks()) quantumUpgradeRespecConfrim = calcQuantumResetClicks();
  quantumUpgradeRespecConfrim--;
  $("#quantumRespec").innerHTML = `${quantumUpgradeRespecConfrim} more clicks!`;
  if (quantumUpgradeRespecConfrim <= 0) {
    quantumUpgradeRespecConfrim = calcQuantumResetClicks();
    $("#quantumRespec").innerHTML = `Respec <span style="opacity: var(--tempOp); display: var(--tempDis)">& Quantum Reset<span>`;
    clearTimeout(qRespecTimeout);
    commandAppend("respec quantumUpgrades", 161);
    game.quantumUpgradeBought = [];
    dokeepMilestone();
    quantumReset();
  }
  qRespecTimeout = setTimeout( function () {
    $("#quantumRespec").innerHTML = `Respec <span style="opacity: var(--tempOp); display: var(--tempDis)">& Quantum Reset<span>`;
    quantumUpgradeRespecConfrim = calcQuantumResetClicks();
  }, 3000);
}
function quantumRestart() {
  if (typeof qRestartTimeout != "undefined") clearTimeout(qRestartTimeout);
  if (quantumUpgradeRestartConfrim > calcQuantumResetClicks()) quantumUpgradeRestartConfrim = calcQuantumResetClicks();
  quantumUpgradeRestartConfrim--;
  $("#quantumRestart").innerHTML = `${quantumUpgradeRestartConfrim} more clicks!`;
  if (quantumUpgradeRestartConfrim <= 0) {
    quantumUpgradeRestartConfrim = calcQuantumResetClicks();
    $("#quantumRestart").innerHTML = `Restart <span style="opacity: var(--tempOp); display: var(--tempDis)">Quantum Run<span>`;
    clearTimeout(qRestartTimeout);
    commandAppend("reset quantumLevel", 161);
    quantumReset();
  }
  qRestartTimeout = setTimeout( function () {
    $("#quantumRestart").innerHTML = `Restart <span style="opacity: var(--tempOp); display: var(--tempDis)">Quantum Run<span>`;
    quantumUpgradeRestartConfrim = calcQuantumResetClicks();
  }, 3000);
}
function calcQuantumResetClicks() {
  return Math.max(2, 10-game.t4resets.toNumber());
}

function getMaxQuantumLabGain() {
  return game.quantumUpgradeBought.includes('36') ? D(Infinity) : D(1);
}
function calcQuantum2Cap() {
  var baseCap = D(200);
  if (game.quantumUpgradeBought.includes('36')) baseCap = baseCap.mul(5);
  if (game.quantumUpgradeBought.includes('37')) baseCap = baseCap.mul(2);
  return baseCap;
}
function getQuantumReqPow() {
  var totPow = game.quantumUpgradeBought.includes('32') ? D(0.999).pow(D.min(calcQuantum2Cap(), game.base)) : D(1);
  if (game.achievements.includes(28)) totPow = totPow.mul(0.9);

  var moneyPow = D(totPow);
  if (game.quantumUpgradeBought.includes('26')) moneyPow = moneyPow.div(2);

  var researchPow = D(totPow);
  if (game.quantumUpgradeBought.includes('16')) researchPow = researchPow.div(2);

  return ((game.challengeEntered != 6 && game.challengeEntered != 7) ? [moneyPow, researchPow] : [D(1), D(1)]);
}
function calcQuantumLabGain() {
  // Money: start from e100, +e5, +e15, +e25, +e35  ... -> (n*(n-1)+n)*5
  var fromMoneyGain = game.money.pow(D(1).div(getQuantumReqPow()[0])).div(1e100).log(10).div(5).sqrt(2).add(1);
  if (fromMoneyGain.isNaN()) fromMoneyGain = D(0);
  // RP   : start from e11, +10^0.5, +10^1.5, +10^2.5 ... -> (n*(n-1)+n)/2
  var fromRpGain = game.researchPoint.pow(D(1).div(getQuantumReqPow()[1])).div(1e11).log(10).mul(2).sqrt(2).add(1.000004); // <- .000004 is for floting point fix
  if (fromRpGain.isNaN()) fromRpGain = D(0);

  var labGain = D.min(
    D.min(
    fromMoneyGain,
    fromRpGain,
    ).sub(game.quantumLab),
    getMaxQuantumLabGain()
  );

  return labGain.floor(0);
}
function dokeepMilestone() {
  for (let i = 0, l = calcMilestoneDone(); i < l; i++) if (!game.quantumUpgradeBought.includes('6' + (i+1))) game.quantumUpgradeBought.push('6' + (i+1));
}

function calcQubitSpeed() {
  var tempLab = game.quantumLab.add(game.achievements.includes(24)?2:0);
  var tempSpd = tempLab.pow(tempLab.pow(0.5)).mul(D(10).add(tempLab.pow(2)).pow(tempLab.sub(1))).sub(0.1);
  if (game.achievements.includes(18)) tempSpd = tempSpd.mul(3);
  if (game.achievements.includes(19)) tempSpd = tempSpd.mul(1.5);
  if (game.quantumUpgradeBought.includes('31')) tempSpd = tempSpd.mul(100);
  if (game.quantumUpgradeBought.includes('33')) tempSpd = tempSpd.mul(D(1.3).pow(game.qubit));
  if (game.quantumUpgradeBought.includes('34')) tempSpd = tempSpd.mul(D.min(D.max(game.number, 0).add(1).log(10).div(10).pow(0.5), 1).add(1).pow(D.max(game.number, 0).add(1).log(10).pow(0.6)));
  if (game.quantumUpgradeBought.includes('35')) tempSpd = tempSpd.mul(D(10).pow([...new Set(game.quantumUpgradeBought)].length));
  tempSpd = tempSpd.mul(8); // boost
  tempSpd = tempSpd.mul(singularityBoosts.QubitBoost);
  if (game.achievements.includes(31)) tempSpd = tempSpd.pow(1+calcChallengeDone()/200);
  return tempSpd;
}
function calcUsedQubit() {
  var tempUsed = D(0);
  for (var i = 0; i < qUpgradeData.count; i++) {
    var fixedIdx = [Math.floor(i/qUpgradeData.row), i%qUpgradeData.col];
    if (game.quantumUpgradeBought.includes((fixedIdx[1]+1) + '' + (fixedIdx[0]+1))) {
      tempUsed = tempUsed.add(getQuantumUpgradeCost(i));
    }
  }
  return tempUsed;
}
function calcQubitEffect() {
  return D(2).pow(game.qubit);
}
