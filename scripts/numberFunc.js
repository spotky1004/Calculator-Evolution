function dNum(infNum) {
  return infNum.toNumber();
}
function dNotation(infNum, dim=0, preDim=dim, notation=game.notation) {
  infNum = D(infNum);
  if (infNum.lte(1e5)) return infNum.toFixed(Math.max(0, preDim-infNum.toFixed(0).length+1));
  switch (notation) {
    case 0:
      return infNum.toExponential(Math.min(4, dim)).replace('+', '');
    case 1:
      return 'e' + dNotation(infNum.log(10), 6, 4, 0);
  }
}
function formatWithBase(infNum, base=2, len=D(1e300), padStart=0, maxLength=Infinity, hy=game.hyperMode&&game.optionToggle[0]) {
  // ty Yahtzee Master#0168 to make this function for me :D
  var base = D(base);
  var infNum = D(infNum);
  if (infNum.eq(0)) return ("0").repeat(padStart?Number(len.valueOf()):1);
  let outputString = "";
  const logThing = Math.floor(infNum.log(base));
  if (infNum.gte(base.pow(len).sub(1))) return String.fromCharCode(getModifiedCharcode(base.sub(1).valueOf())).repeat(Math.min(maxLength, len.valueOf()));
  for (let index = 0; index <= Math.min(maxLength, logThing); index++) {
    var tempCharcode = infNum.div(base.pow(logThing-index)).mod(base).floor();
    var strIdx = +tempCharcode;
    infNum = infNum.sub(base.pow(logThing-index).mul(strIdx));
    outputString += (hy?`<span style="opacity: ${0.3+(tempCharcode.toNumber()+1)/base.toNumber()*0.7};">`:"") + String.fromCharCode(getModifiedCharcode(strIdx)) + (hy?"</span>":"");
  }
  if (padStart && hy) {
    var needToPush = maxLength - outputString.replace(/(<([^<>]+)>)/g, '$1').length;
    outputString = `<span style="opacity: 0.3">${'0'.repeat(Math.max(0, needToPush))}</span>` + outputString;
  } else if (padStart && outputString.length <= maxLength) {
    outputString = outputString.padStart(+(len.valueOf()), '0');
  }
  if (outputString.replace(/(<[^<>]+>)/g, '').length > maxLength) {
    outputString += "...";
  }
  return outputString;
}
function getModifiedCharcode(charCode) {
  charCode = Number(charCode);
  var p = 0;
  if (charCode >= 10) p = p+7;
  if (charCode >= 36) p = p+6;
  if (charCode >= 66) p = p+34;
  if (charCode >= 78) p = p+1;
  charCode = charCode+48+p;
  return charCode%0xFFFF;
}
function notationSI(num, dim=0) {
  if (num.eq(0)) return '0k';
  if (!(num instanceof Decimal)) {
    num = D(num);
  }
  if (num.gt(1024**8)) {
    return dNotation(num.div(1024**8), dim) + 'Y';
  } else {
    numLv = Math.floor(num.log(1024));
    return num.div(1024**numLv).toFixed(dim) + siSymbol[numLv];
  }
}
function factorial(num) {
  num = Math.floor(num);
  if (num >= 30) {
    return D(2).mul(Math.PI).mul(num).sqrt(2).mul(D(num/Math.E).pow(num)).valueOf();
  } else {
    var tempNum = D(1);
    for (var i = 0; i < num; i++) tempNum = tempNum.mul(i+1);
    return tempNum;
  }
}
function ordNum(num){
  let numMod100 = num % 100
  let ord = ""
  if (Math.floor(numMod100 / 10) == 1) ord = "th"
  else {
    switch(numMod100 % 10) {
    case 1:
      ord = "st"
      break;
    case 2:
      ord = "nd"
      break;
    case 3:
      ord = "rd"
      break;
    default:
      ord = "th"
    }
  }
  return num + ord
}
function romanize (num) {
  if (num == 0) {
    return '0';
  }
  if (isNaN(num))
    return NaN;
  var digits = String(+num).split(""),
    key = [
      "","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
      "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
      "","I","II","III","IV","V","VI","VII","VIII","IX"
    ],
    roman = "",
    i = 3;
  while (i--)
    roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return (Array(+digits.join("") + 1).join("M") + roman).toLowerCase();
}
function timeNotation(sec) {
  if (sec > 3600*24*365*100) return "way too long";
  if (sec > 3600*24*365) return `${(sec/3600/24/365).toFixed(3)}y`;
  if (sec > 3600*24) return `${(sec/3600/24).toFixed(2)}d`;
  if (sec > 3600) return `${(sec/3600).toFixed(2)}h`;
  if (sec > 60) return `${(sec/60).toFixed(2)}m`;
  if (sec > 1) return `${(sec).toFixed(1)}s`;
  return `${(sec*1000).toFixed(0)}ms`;
}
