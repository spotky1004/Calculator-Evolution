//dev QoL?
const $ = _ => document.querySelector(_);
const D = Decimal;

String.prototype.replaceAt=function(index, char) {
    var a = this.split("");
    a[index] = char;
    return a.join("");
}

// all
function renderAll() {
  renderBasic();
  renderInfo();

  switch (tabNow) {
    case 0:
    renderModule();
      break;
    case 1:
    renderShop();
      break;
    case 2:
    renderResearch();
      break;
    case 4:
    renderOption();
      break;
    case 5:
    renderQunatum();
      break;
    case 6:
    renderStat();
      break;
    case 7:
    renderSingularity();
      break;
  }
}
function renderInfo() {
  $('#infoArea').style.display = (game.t2toggle ? 'block' : 'none')
  renderBasicInfo();
  renderOverclockInfo();
}
function calcAll() {
  calcToggleTabs();

  game.mDigits = calcMaxDigit();

  calcQuantum();
  calcProgram();
  calcResearch();
  calcAchievements();
}

//visual effect
function rainbowEffect(sel, pow=1) {
  if (!game.optionToggle[0]) {
    delRainbowEffect(sel);
    return;
  }
  if ($(sel).style.filter != "") {
    thisHue = Number($(sel).style.filter.replace('hue-rotate(', '').replace('deg)', ''));
  } else {
    thisHue = 0;
  }
  $(sel).style.filter = 'hue-rotate(' + (thisHue+1) + 'deg)';
}
function delRainbowEffect(sel) {
  $(sel).style.filter = 'hue-rotate(0deg)';
}
function commandAppend(str, hue=0, out=0) {
  if (!game.optionToggle[0]) {
    return;
  }
  commandFloat(10);
  commandTxt = document.createElement('span');
  commandTxt.className += 'commandTxt';
  commandTxt.innerHTML = ((!out) ? '> ' : '') + str;
  commandTxt.style.bottom = '0vh';
  commandTxt.style.opacity = 1;
  commandTxt.style.filter = 'hue-rotate(' + hue + 'deg)';
  $('#commandArea').appendChild(commandTxt);
}
function commandFloat(speed=0.8) {
  eleArr = document.getElementsByClassName("commandTxt");
  for (var i = 0; i < eleArr.length; i++) {
    eleArr[i].style.bottom = (Number(eleArr[i].style.bottom.replace('vh', ''))+tSpeed*5*speed) + 'vh';
    eleArr[i].style.opacity = eleArr[i].style.opacity-tSpeed/3*speed;
    if (eleArr[i].style.opacity < 0) {
      eleArr[i].remove();
    }
  }
}

// etc
function hsvToRgb(h, s, v) {
  var r, g, b;

  var i = Math.floor(h * 6);
  var f = h * 6 - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }
  return '#' + Math.floor(r*255).toString(16).padStart(2, Math.floor(r*255).toString(16)) + Math.floor(g*255).toString(16).padStart(2, Math.floor(g*255).toString(16)) + Math.floor(b*255).toString(16).padStart(2, Math.floor(b*255).toString(16));
}

//hotkey
(function(){
  document.addEventListener('keydown', function(e){
    const keyCode = e.keyCode;
    if (keyCode == 49) {
      activeProgram(0);
    }
    if (keyCode == 50) {
      activeProgram(1);
    }
    if (keyCode == 51) {
      activeProgram(2);
    }
    if (keyCode == 52) {
      activeProgram(3);
    }
    if (keyCode == 53) {
      activeProgram(4);
    }
    if (keyCode == 54) {
      activeProgram(5);
    }
    if (keyCode == 55) {
      activeProgram(6);
    }
    if (keyCode == 82) {
      reboot();
    }
  })
})();
