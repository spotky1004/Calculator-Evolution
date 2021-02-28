(function(){
  achievementName = [
    'Memory exceed', 'A Dollar<br>*', 'Upgrade!', 'Let\'s count to ten', 'A to Z<br>*',
    'Tech lab?', 'Boost!', 'Multi Process<br>*', 'Larger Memory', 'Power of Science<br>*',
    'Sacrifice<br>*', 'A to z', 'Sacrifice II<br>*', 'Rich<br>*', 'Ultimate Science',
    'New Age<br>*', '2^10', 'Skilled', 'Lab Town<br>*', '2^50<br>*',
    'Richer<br>*', 'A to Œ<br>*', 'Infinity Research<br>*', 'Infinity Boost', '2 more?<br>*',
    'Singularity<br>*', 'Second Singularity<br>*', 'Challenge', 'Bulk QL Challenge<br>*', 'More Challenges<br>*',
    'Mastered<br>*', 'Give me more QUBIT!<br>*', 'Grid Lab<br>*', 'Singularity at light speed<br>*', 'Singularit<br>ies<br>*',
    'Broken Machine', 'Tricky', 'Bugged Reality<br>*', 'Inf..', 'GG'
  ];
  achievementGoal = [
    'Reach ${formatWithBase(63, game.base)}(${dNotation(game.base, 4, 0)})',
    'Have a ${dNotation(1, 0, 0)} $<br>Reward: Multiply mine power by x1.25',
    'Buy ${game.shopBought[5]}/${dNotation(3, 0, 0)} CPU upgrade',
    'Reach base ${dNotation(game.base, 4, 0)}/${dNotation(10, 0, 0)}',
    'Reach base ${dNotation(game.base, 4, 0)}/${dNotation(36, 0, 0)}<br>Reward: Shop cost x${dNotation(0.95, 0, 2)}',

    'Perform Reboot',
    'Reach Bonus CPU Level ${game.researchLevel[0]}/${dNotation(3, 0, 0)}',
    'Reach Multi Process Level ${game.researchLevel[1]}/${dNotation(2, 0, 0)}<br>Reward: 1 extra process',
    'Reach Extra Digit Level ${game.researchLevel[2]}/${dNotation(5, 0, 0)}',
    'Have ${dNotation(game.researchPoint, 4, 0)}/${dNotation(1e3, 4, 0)} RP<br>Reward: Multiply RP gain based on itself x${dNotation(D.max(D.max(game.researchPoint, 2).log(3).log(10),1), 4, 2)}',

    'Perform Overclock<br>Reward: Research speed x1.15',
    'Reach base ${dNotation(game.base, 4, 0)}/${dNotation(62, 4, 0)}',
    'Perform Overclock with Power ${dNotation(getOverclockPower(), 4, 0)}/${dNotation(1e10, 4, 0)}<br>Reward: Research Speed x2',
    'Have ${dNotation(game.money)}/${dNotation(1e100)} $<br>Reward: Multiply mine power by x5',
    'Have ${dNotation(game.researchPoint, 4, 0)}/${dNotation(1.11e11, 4, 0)} RP',

    'Perform Quantum<br>Reward: Multiply Mine power by x10',
    'Have ${dNotation(game.qubit, 4, 0)}/${dNotation(10, 4, 0)} Qubits',
    'Have ${game.quantumUpgradeBought.length}/${dNotation(8, 4, 0)} Quantum Upgrades',
    "Have ${dNotation(game.quantumLab, 0, 0)}/${dNotation(7, 0, 0)} Quantum Labs<br>Reward: Qubit production speed x3",
    'Have ${dNotation(game.qubit, 4, 0)}/${dNotation(50, 4, 0)} Qubits<br>Reward: Qubit production speed x1.5',

    'Have ${dNotation(game.money)}/${dNotation("1e1000", 0, 0)} $<br>Reward: Multiply mine power by x10',
    'Reach base ${dNotation(game.base, 4, 0)}/${dNotation(250, 4, 0)}<br>Reward: Shop cost /10',
    'Have ${dNotation(game.researchPoint, 4, 0)}/${dNotation(D(2).pow(1024), 6, 0)} RP<br>Reward: Start Quantum run with 100 RP',
    'Have ${dNotation(game.qubit, 4, 0)}/${dNotation(1024, 4, 0)} Qubits',
    'Have ${dNotation(game.quantumLab, 0, 0)}/${dNotation(82, 0, 0)} Labs<br>Reward: Shift Qubit production by +2QL',

    'Go singularity<br>Reward: CPU speed x25',
    'Go singularity one more time<br>Reward: RP gain x10',
    'Complete a challenge',
    'Reach bulk ${dNotation(calcQuantumLabGain(), 0, 0)}/${dNotation(20, 0, 0)} Quantum Labs<br>Reward: ^0.9 Quantum requirements ',
    'Complete ${dNotation(calcChallengeDone(), 0, 0)}/${dNotation(10, 0, 0)} Challenges<br>Reward: All Challenge requirement -2<br>Can bulk complete Challenge',

    'Buy all Quantum Upgrades<br>Reward: More Quantum Upgrades',
    'Have ${dNotation(game.quantumLab, 0, 0)}/${dNotation(600, 0, 0)} Quantum Labs<br>Reward: Boost Qubit gain speed based on Challenge Completions (^${1+calcChallengeDone()/200})',
    'Complete Qubit Challenge once<br>Reward: Start challenge with half of goal QL (max. ${dNotation(game.maxQuantumLab, 4, 0)})',
    'Go Singularity in ${game.t4resetTime}/500 milliseconds<br>Reward: 2 Merger Grid Machine<br>2 Grid Space<br>Generate 10% of SP gain per second',
    'Go singularity ${dNotation(game.t4resets, 0, 0)}/${dNotation(100, 0, 0)} times<br>Reward: SP gain x4<br>10 extra process',

    'Complete Boost Challenge once',
    'Complete Boost Challenge x10',
    'Reach Infinity$ (cap of Decimal.js, ~1ee16)<br>Reward: Game speed x2',
    'Go Infinity in 5 hours',
    'Go Infinity in 10 seconds'
  ];
  achievementGoalFunc = [
    'game.number.gte(63)', 'game.money.gte(1)', 'game.shopBought[5] >= 3', 'game.base.gte(10)', 'game.base.gte(36)',
    'rebooting', 'game.researchLevel[0]>=3', 'game.researchLevel[1]>=2', 'game.researchLevel[2]>=5', 'game.researchPoint.gte(1e3)',
    'getOverclockPower().gt(1)', 'game.base.gte(62)', 'getOverclockPower().gte(1e10)', 'game.money.gte(1e100)', 'game.researchPoint.gte(1.11e11)',
    'game.quantumLab.gte(1)', 'game.qubit.gte(10)', 'game.quantumUpgradeBought.length>=8', 'game.quantumLab.gte(7)', 'game.qubit.gte(50)',
    'game.money.gte(\'1e1000\')', 'game.base.gte(250)', 'game.researchPoint.gte(D(2).pow(1024))', 'game.qubit.gte(1024)', 'game.quantumLab.gte(82)',
    'game.t4resets.gte(1)', 'game.t4resets.gte(2)', 'calcChallengeDone() >= 1', 'calcQuantumLabGain().gte(20)', 'calcChallengeDone() >= 10',
    'game.quantumUpgradeBought.length>=36', 'game.quantumLab.gte(600)', 'game.wormholeChallengeProgress[6]>=1', 'game.t4resetTime <= 500', 'game.t4resets.gte(100)',
    'game.wormholeChallengeProgress[7]>=1', 'game.wormholeChallengeProgress[7]>=10', '!game.money.isFinite()', 'game.t5record <= 1000*3600*5', 'game.t5record <= 1000*10'
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
    commandAppend(`Got an Achievement: ${achTxt.replace(/<br>\*/, '')}`, -40);
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