const $ = _ => document.querySelector(_);
const D = num => new Decimal(num);

number = D(0);
base = D(2);
digits = D(1);
tNow = new Date().getTime();
programActive = [0, 0, 0];

function dNum(infNum) {
  return Number(infNum.valueOf());
}

function renderAll() {
  $("#basedNumber").innerHTML = dNum(number.floor()).toString(dNum(base)).padStart(dNum(digits), 0);
  renderProgram();
};
function renderProgram() {
  for (var i = 0; i < 2; i++) {
    $(".program:nth-of-type(" + (i+1) + ")").className = ((programActive[i]) ? "program active" : "program");
  }
}

function calcAll() {
  calcProgram();
}
function calcProgram() {
  if (programActive[0]) {
    number = number.add(tGain).min(base.pow(digits).sub(1));
  }
  if (programActive[1]) {
    if (number.gte(base.pow(digits).sub(1))) {
      number = number.sub(base.pow(digits).sub(1));
      digits = digits.add(1);
    }
  }
}

function activeProgram(num) {
  for (var i = 0; i < programActive.length; i++) {
    if (i != num) {
      programActive[i] = 0;
    }
  }
  programActive[num] = !programActive[num];
  renderProgram();
}

document.addEventListener("DOMContentLoaded", function(){
  setInterval( function () {
    tGain =  (new Date().getTime()-tNow)/1000;
    calcAll();
    renderAll();
    tNow = new Date().getTime();
  }, 33);
});
