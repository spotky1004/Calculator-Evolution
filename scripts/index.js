//dev QoL?
const $ = _ => document.querySelector(_);
const D = Decimal;

String.prototype.replaceAt=function(index, char) {
    var a = this.split("");
    a[index] = char;
    return a.join("");
}
function copyText(str) {
  var tempElem = document.createElement('textarea');
  tempElem.value = str;  
  document.body.appendChild(tempElem);

  tempElem.select();
  document.execCommand("copy");
  document.body.removeChild(tempElem);
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
    case 3:
    renderAchievements()
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
    case 8:
      renderInfinity();
      break;
  }
}
function renderInfo() {
  $('#infoArea').style.display = (game.t2toggle ? 'block' : 'none')
  renderBasicInfo();
  renderOverclockInfo();
  renderSingularityInfo();
  renderInfinityInfo();
}
function calcAll(dt=0) {
  calcToggleTabs();

  game.mDigits = calcMaxDigit();

  calcAchievements();
  calcInfinity();
  calcSingularity(dt);
  calcQuantum(dt);
  calcProgram(dt);
  calcResearch(dt);
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
  commandFloat(14);
  commandTxt = document.createElement('span');
  commandTxt.className += 'commandTxt';
  commandTxt.innerHTML = ((!out) ? '> ' : '') + `_<span style="opacity:0">${str}</span>`;
  commandTxt.ticks = 0;
  commandTxt.style.bottom = '0vh';
  commandTxt.style.opacity = 1;
  commandTxt.style.filter = 'hue-rotate(' + hue + 'deg)';
  $('#commandArea').appendChild(commandTxt);
}
function commandFloat(speed=0.8) {
  eleArr = document.getElementsByClassName("commandTxt");
  for (var i = 0; i < eleArr.length; i++) {
    if (speed != 0.8) {
      eleArr[i].style.bottom = (Number(eleArr[i].style.bottom.replace('vh', ''))+tSpeed*5*speed) + 'vh';
      eleArr[i].ticks += speed;
    }
    eleArr[i].style.opacity = (eleArr[i].style.opacity-tSpeed/8*speed)*0.995;
    eleArr[i].innerHTML = eleArr[i].innerHTML.replace(/(_<span style="opacity:0">([^<\/>]+)<\/span>)/, function(match, p1, p2){return `${p2[0]}_<span style="opacity:0">${p2.substring(1, 9999)}</span>`});
    if (eleArr[i].style.opacity < 0 || commandTxt.ticks > 100) {
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

var pauseFixes = ["t5resetTime", "tLast", "startTime", "rebootTime", "quantumTime", "singularityTime"];
function gamePauseFix(dt) {
  for (var i = 0, l = pauseFixes.length; i < l; i++) game[pauseFixes[i]] += dt;
}

// idk how to call these lol
window.onblur = () => blurSettings();
function blurSettings() {
  keyDowns = {};
  documentHold = 0;
}

//hotkey
(function(){
  keyDowns = {};
  document.addEventListener('keydown', function(e){
    const keyCode = e.keyCode;
    keyDowns[keyCode] = true;
    if (!keyDowns[16]) {
      if (keyCode == 49 || keyCode == 35) activeProgram(0); // 1
      if (keyCode == 50 || keyCode == 40) activeProgram(1); // 2
      if (keyCode == 51 || keyCode == 34) activeProgram(2); // 3
      if (keyCode == 52 || keyCode == 37) activeProgram(3); // 4
      if (keyCode == 53 || keyCode == 12) activeProgram(4); // 5
      if (keyCode == 54 || keyCode == 39) activeProgram(5); // 6
      if (keyCode == 55 || keyCode == 36) activeProgram(6); // 7
      if (keyCode == 56 || keyCode == 38) for (var i = 0; i < 7; i++) if (calcProcessLeft() > 0) activeProgram(i); // 8
    } else {
      if (keyCode == 80) gamePaused ^= 1;
    }

    if (keyCode == 82) reboot(); // r
    if (keyCode == 81) quantum(); // q

    if (keyCode == 65) goTab(0); // a
    if (keyCode == 83) goTab(1); // s
    if (keyCode == 68) goTab(3); // d
    if (keyCode == 70) goTab(2); // f
    if (keyCode == 71) goTab(5); // g
    if (keyCode == 74) goTab(8); // j
    if (keyCode == 72) !keyDowns[16] ? goTab(7) : game.hyperMode ^= 1; // h
  })
  document.addEventListener('keyup', function(e){
    const keyCode = e.keyCode;
    keyDowns[keyCode] = false;
  })
})();
function calcExtraHotkeys() {
  if (keyDowns[16]) {
    // shift + 1 ~ 8
    if (keyDowns[49] || keyDowns[35]) researchBuy(0);
    if (keyDowns[50] || keyDowns[40]) researchBuy(1);
    if (keyDowns[51] || keyDowns[34]) researchBuy(2);
    if (keyDowns[52] || keyDowns[37]) researchBuy(3);
    if (keyDowns[53] || keyDowns[12]) researchBuy(4);
    if (keyDowns[54] || keyDowns[39]) researchBuy(5);
    if (keyDowns[55] || keyDowns[36]) researchBuy(6);
    if (keyDowns[56] || keyDowns[38]) researchBuy(7);
  }
}

// override
Element.prototype.remove = function() {
  this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
  for(var i = this.length - 1; i >= 0; i--) {
      if(this[i] && this[i].parentElement) {
          this[i].parentElement.removeChild(this[i]);
      }
  }
}