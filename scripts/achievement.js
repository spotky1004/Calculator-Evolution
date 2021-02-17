(function(){
  achievementName = [
    'Memory exceed', 'A Dollar<br>*', 'Upgrade!', 'Let\'s count to ten', 'A to Z<br>*',
    'Tech lab?', 'Boost!', 'Multi Process<br>*', 'Larger Memory', 'Power of Science<br>*',
    'Sacrifice<br>*', 'A to z', 'Sacrifice II<br>*', 'Rich<br>*', 'Ultimate Science',
    'New Age<br>*', '2^10', 'Skilled', 'Lab Town<br>*', '2^50<br>*',
    'Richer<br>*', 'A to Œ<br>*', 'Infinity Research<br>*', 'Infinity Boost', '2 more?<br>*',
    'Singularity<br>*', 'Second Singularity<br>*', 'Challenge', 'Bulk QL Challenge<br>*', 'More Challenges<br>*',
    'Singularit<br>ies<br>*', 'Broken Machine', 'Bugged Reality<br>*', 'Inf..', 'GG'
  ];
  achievementGoal = [
    'Reach ${formatWithBase(63, game.base)}(${dNotation(game.base, 4, 0)})', 'Have a ${dNotation(1, 0, 0)} $<br>Reward: Multiply mine power by x1.25', 'Buy ${dNotation(3, 0, 0)} CPU upgrade', 'Reach base ${dNotation(10, 0, 0)}', 'Reach base ${dNotation(36, 0, 0)}<br>Reward: Shop cost x${dNotation(0.95, 0, 2)}',
    'Perform Reboot', 'Reach Bonus CPU Level ${dNotation(3, 0, 0)}', 'Reach Multi Process Level ${dNotation(2, 0, 0)}<br>Reward: 1 extra process', 'Reach Extra Digit Level ${dNotation(5, 0, 0)}', 'Have ${dNotation(1e3, 4, 0)} RP<br>Reward: Multiply RP gain based on itself x${dNotation(D.max(D.max(game.researchPoint, 2).log(3).log(10),1), 4, 2)}',
    'Perform Overclock<br>Reward: Research speed x1.15', 'Reach base ${dNotation(62, 4, 0)}', 'Perform Overclock with Power ${dNotation(1e10, 4, 0)}<br>Reward: Research Speed x2', 'Have ${dNotation(1e100)} $<br>Reward: Multiply mine power by x5', 'Have ${dNotation(1.11e11, 4, 0)} RP',
    'Perform Quantum<br>Reward: Multiply Mine power by x10', 'Have ${dNotation(10, 4, 0)} Qubits', 'Have ${dNotation(8, 4, 0)} Quantum Upgrades', "Have ${dNotation(7, 0, 0)} Quantum Labs<br>Reward: Qubit production speed x3", 'Have ${dNotation(50, 4, 0)} Qubits<br>Reward: Qubit production speed x1.5',
    'Have ${dNotation("1e1000", 4, 0)} $<br>Reward: Multiply mine power by x10', 'Reach base ${dNotation(250, 4, 0)}<br>Reward: Shop cost /10', 'Have ${dNotation(D(2).pow(1024), 6, 0)} RP<br>Reward: Start Quantum run with 100 RP', 'Have ${dNotation(1024, 4, 0)} Qubits', 'Have ${dNotation(82, 0, 0)} Labs<br>Reward: Shift Qubit production by +2QL',
    'Go singularity<br>Reward: CPU speed x25', 'Go singularity one more time<br>Reward: RP gain x10', 'Complete a challenge', 'Reach bulk ${dNotation(20, 0, 0)} Quantum Labs<br>Reward: Pow Quantum requirements by ^0.9', 'Complete ${dNotation(10, 0, 0)} Challenges<br>Reward: All Challenge requirement -2',
    'Go singularity ${dNotation(100, 0, 0)} times<br>Reward: SP gain x4, 10 extra process', 'Complete Boost Challenge once', 'Reach Infinity$<br>Reward: Game speed x2', 'Go Infinity in 5 hours', 'Go Infinity in 10 seconds'
  ];
  achievementGoalFunc = [
    'game.number.gte(63)', 'game.money.gte(1)', 'game.shopBought[5] >= 3', 'game.base.gte(10)', 'game.base.gte(36)',
    'rebooting', 'game.researchLevel[0]>=3', 'game.researchLevel[1]>=2', 'game.researchLevel[2]>=5', 'game.researchPoint.gte(1e3)',
    'getOverclockPower().gt(1)', 'game.base.gte(62)', 'getOverclockPower().gte(1e10)', 'game.money.gte(1e100)', 'game.researchPoint.gte(1.11e11)',
    'game.quantumLab.gte(1)', 'game.qubit.gte(10)', 'game.quantumUpgradeBought.length>=8', 'game.quantumLab.gte(7)', 'game.qubit.gte(50)',
    'game.money.gte(\'1e1000\')', 'game.base.gte(250)', 'game.researchPoint.gte(D(2).pow(1024))', 'game.qubit.gte(1024)', 'game.quantumLab.gte(82)',
    'game.t4resets.gte(1)', 'game.t4resets.gte(2)', 'calcChallengeDone() >= 1', 'calcQuantumLabGain().gte(20)', 'calcChallengeDone() >= 10',
    'game.t4resets.gte(100)', 'game.wormholeChallengeProgress[7]>=1', 'game.money.gte("1e9000000000000")', '0', '0'
  ];
})();

function initAchievements() {
  var tableNode = document.getElementById('achWarp');
  var cNode = document.createElement('tbody');
  tableNode.appendChild(cNode);
  tableNode = document.querySelector('#achWarp > tbody');
  var trNode = document.querySelector('#achWarp > tbody > tr:last-child');
  for (var i = 0; i < achievementName.length; i++) {
    if (i%5 == 0) {
      var cNode = document.createElement('tr');
      tableNode.appendChild(cNode);
      trNode = document.querySelector('#achWarp > tbody > tr:last-child');
    }
    var cNode = document.createElement('td');
    cNode.innerHTML = achievementName[i].replace("*", "<span style=\"color: #ddff00;\">*</span>");
    cNode.onmouseover = new Function(`achivenementHover.bind(this)(${i})`);
    cNode.onmouseout = new Function(`achivenementUnhover()`);
    cNode.classList.add("achievementNode");
    trNode.appendChild(cNode);
  }
}
function calcAchievements() {
  var achTxt = '';
  for (var i = 0, l = achievementName.length; i < l; i++) {
    if (game.achievements.includes(i)) continue;
    if (new Function('return ' + achievementGoalFunc[i])()) {
      achTxt = achievementName[i];
      game.achievements.push(i);
      break;
    }
  }

  if (achTxt != '') {
    commandAppend(`Got an Achievement: ${achTxt}`, -40)
  }
}
function renderAchievements() {
  [...document.getElementsByClassName("achievementNode")].forEach((ele, idx) => ele.style.filter = `grayscale(${!game.achievements.includes(idx)*1})`)
}

function achivenementHover(idx) {
  $("#achDesc").style.opacity = 1;
  $("#achDesc").innerHTML = new Function("return `" + achievementGoal[idx] + "`")().replace(/(Reward: +)/, `<span style=\"color: ${game.achievements.includes(idx)?"#ddff00;":"#ccd1a3;"}">$1<span>`);
  $("#achDesc").style.top = (this.getBoundingClientRect().top - innerHeight/100 - $("#achDesc").offsetHeight) + 'px';
  $("#achDesc").style.left = (this.getBoundingClientRect().left - $("#achDesc").offsetWidth/4) + 'px';
}
function achivenementUnhover() {
  $("#achDesc").style.opacity = 0;
}