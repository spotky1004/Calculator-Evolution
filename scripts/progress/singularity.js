(function() {
  singularityMachineTypes = { // singularityMachine enums
    Incrementer: 0,
    Booster: 1,
    Marger: 2,
    BaseBoost: 3,
    MoneyBoost: 4,
    RpBoost: 5
  }
  for (var i = 0; i < 25; i++) {

  }
})();

function singularity() {
  if (game.quantumLab.lt(80)) return;
  if (game.t4resets.lt(1) && !confirm("If you go singularity you'll lose everything that you have!<br>Are you sure to reset all progress?")) return;

  game.t4resets = game.t4resets.add(1);
  game.singularityPower = game.singularityPower.add(calcSingularityPowerGain());
  singularityReset();

  commandAppend(`Go singularity (${ordNum(game.t4resets)})`, (30+game.t4resets.toNumber()*3)%360, 1)
}
function renderSingularity() {
  $("#singularityButton").className = game.quantumLab.gte(80) ? "" : "disabled";
  for (var i in game.singularityGrid) game.singularityGrid[i].update();
  $("#singularityDesc").innerHTML = game.quantumLab.gte(80) ? `If you go singularity now, you'll get <b>${dNotation(calcSingularityPowerGain())} SP</b> ${game.quantumLab.lt(500) ? `(next SP at ${calcSingularityPowerGain(1)} QL)`: ''}` : 'Need 80 Quantum Labs to go Singularity';
  $("#singularityDesc").innerHTML += `<br>You have ${dNotation(game.singularityPower, 4, 0)} Singularity Power`;
  $("#singularityDesc").innerHTML += `<br>Each SP increases Multi Process by 2 (tot ${Math.floor(Math.min(12.5, game.singularityPower.valueOf())*2)}, cap at 25)`
}

function calcSingularityPowerGain(calcNext=0, baseRes=game.quantumLab) {
  var tempSpGain = baseRes.sub(60).div(20); // div
  var tempSpGain2 = tempSpGain.floor(0).add(1).mul(tempSpGain.floor(0)).div(2).floor(0); // sum
  var tempSpGain3 = tempSpGain2.add(tempSpGain.mod(1).mul(tempSpGain.add(1)).floor(0)); // offset
  return (!calcNext ? D.max(0, tempSpGain3) : D.max(80, baseRes.div(20).floor(0).mul(20).add(D(20).div(tempSpGain.floor(0).add(1)).mul(tempSpGain3.sub(tempSpGain2).add(1)).ceil(0))));
}

class SingularityMachine {
  constructor(attrs={}) {
    this.position = attrs.position; // form: {x: 0, y: 0}
    this.rotate = attrs.rotate%4; // 0 = top, 1 = right, 2 = down, 3 = left
    this.tier = attrs.tier;
    this.type = attrs.type; // refer singularityMachineTypes
    this.value = attrs.value;
  }

  update () {
    var realValue = this.getValue();
    if (typeof this.getPointedMachine() == "undefined") return 0;
    switch (this.type) {
      case "Incremtner":
      this.getPointedMachine().value = this.getPointedMachine().value.add(realValue);
        break;
      default:
        return 0;
    }
    return 1;
  }

  getInteracts () {
    var interactMachines = [];
    for (var i = -1; i < 2; i++) {
      for (var j = -1; j < 2; j++) {
        if (i == 0 && j == 0) continue;
        var tempIMachine = game.singularityGrid[(this.position.x+i) + '' + (this.position.y+j)];
        if (typeof tempIMachine == "undefined") continue;
        interactMachines.push(tempIMachine);
      }
    }
    return interactMachines;
  }

  getPointed = () => {return this.rotate%2 ? (this.position.x-(this.rotate-2)) + '' + this.position.y : this.position.x + '' + (this.position.y-(this.rotate-2))};
  getPointedMachine = () => {return game.singularityGrid[this.getPointed()]};

  getValue () {
    var value = this.value.mul(D(10).pow(this.tier));
    var iMachines = this.getInteracts();
    if (this.type != "Booster") for (var i = 0, l = iMachines.length; i < l; i++) if (iMachines[i].type == "Booster") realValue = value.mul(iMachines[i].getValue());
    return value;
  }
}
