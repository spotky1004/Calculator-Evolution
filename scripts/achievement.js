(function(){
  achievementName = [
    'Memory exceed', 'A Dollar', 'Upgrade!', 'Let\'s count to ten', 'A to Z',
    'Tech lab?', 'Boost!', 'Multi Process', 'Larger Memory', 'Power of Science',
    'Sacrifice', 'A to z', 'Sacrifice II', 'Rich', 'Ultimate Science',
    'New Age', 'Extreme speed', 'Qutrit', 'Richer', 'A to Œ'
  ];
  achievementGoal = [
    'Reach ${formatWithBase(63, game.base)}', 'Have a ${dNotation(1)} $', 'Buy ${dNotation(3)} CPU upgrade', 'Reach base ${dNotation(10)}', 'Reach base ${dNotation(36)}',
    'Perform Reboot', 'Reach Bonus CPU Level ${dNotation(3)}', 'Reach Multi Process Level ${dNotation(1)}', 'Reach Extra Digit Level ${dNotation(5)}', 'Have ${dNotation(1e3)} RP',
    'Perform Overclock', 'Reach base ${dNotation(62)}', 'Perform Overclock with Power ${dNotation(1e10)}', 'Have ${dNotation(1e100)} $', 'Have ${dNotation(1.11e11)} RP',
    'Perform Quantum', 'Have ${dNotation(100)} Qubits', 'Upgrade Qubits once', 'Have ${dNotation(1e1000)} $', 'Reach base ${dNotation(250)}'
  ];
  achievementGoalFunc = [
    'game.number.gte(63)', 'game.money.gte(1)', 'game.shopBought[5] >= 3', 'game.base.gte(10)', 'game.base.gte(36)',
    'rebooting', 'game.researchLevel[0]>=3', 'game.researchLevel[1]>=1', 'game.researchLevel[2]>=5', 'game.researchPoint.gte(1e3)',
    'getOverclockPower().gt(1)', 'game.base.gte(62)', 'getOverclockPower().gte(1e10)', 'game.money.gte(1e100)', 'game.researchPoint.gte(1.11e11)',
    'game.quantumLab.gte(1)', 'game.qubit.gte(100)', '0', 'game.money.gte(1e1000)', 'game.base.gte(250)'
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
    cNode.innerHTML = achievementName[i];
    trNode.appendChild(cNode);

    if (game.achievements.includes(i)) {
      document.querySelector(`#achWarp > tbody > tr:nth-child(${Math.floor(i/5+1)}) > td:nth-child(${1+i%5})`).style.filter = 'grayscale(0)';
    } else {
      cNode.style.filter = 'grayscale(1)';
    }
  }
}
function calcAchievements() {
  var achTxt = '';
  for (var i = 0, l = achievementName.length; i < l; i++) {
    if (game.achievements.includes(i)) continue;
    if (new Function('return ' + achievementGoalFunc[i])()) {
      achTxt = achievementName[i];
      game.achievements.push(i);
      document.querySelector(`#achWarp > tbody > tr:nth-child(${Math.floor(i/5+1)}) > td:nth-child(${1+i%5})`).style.filter = 'grayscale(0)';
      break;
    }
  }

  if (achTxt != '') {
    commandAppend(`Got an Achievement: ${achTxt}`, -40)
  }
}
