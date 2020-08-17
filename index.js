const $ = _ => document.querySelector(_);
const D = num => new Decimal(num);

number = 0;
base = 2;
digits = 1;
tNow = new Date().getTime();
programActive = [0, 0, 0];

function renderAll() {
  $("#basedNumber").innerHTML = Math.floor(number).toString(base).padStart(digits, 0);
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
    number = Math.min(number+tGain, base**digits-1);
  }
  if (programActive[1]) {
    if (number >= base**digits-1) {
      number -= base**digits-1;
      digits++;
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
