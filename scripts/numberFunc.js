function dNum(infNum) {
  return Number(infNum.valueOf());
}
function dNotation(infNum, dim=0) {
  infNum = D(infNum);
  if (infNum.gte(1e5)) {
    return infNum.toExponential(Math.min(4, dim)).replace('+', '');
  } else {
    return infNum.toFixed(Math.max(0, dim-infNum.toFixed(0).length+1));
  }
}
function formatWithBase(infNum, base=2, len=D(1e300), padStart=0) {
  // ty Yahtzee Master#0168 to make this function for me :D
  base = D(base);
  infNum = D(infNum);
  if (infNum.eq(0)) return ("0").repeat(padStart?Number(len.valueOf()):1);
  let outputString = "";
  const logThing = Math.floor(infNum.log(base));
  if (infNum.gte(base.pow(len).pow(0.9999))) {
    return String.fromCharCode(getModifiedCharcode(base.sub(1).valueOf())).repeat(len.valueOf());
  }
  for (let index = 0; index <= logThing; index++) {
    var strIdx = Number(infNum.div(base.pow(logThing-index)).mod(base).floor());
    infNum = infNum.sub(base.pow(logThing-index).mul(strIdx));
    outputString += String.fromCharCode(getModifiedCharcode(strIdx));
  }
  if (padStart) {
    outputString = outputString.padStart(Number(len.valueOf()), '0');
  }
  return outputString;
}
function getModifiedCharcode(charCode) {
  charCode = Number(charCode);
  var p = 0;
  if (charCode >= 10) {
    p = p+7;
  }
  if (charCode >= 36) {
    p = p+6;
  }
  if (charCode >= 66) {
    p = p+27;
  }
  charCode = charCode+48+p;
  return charCode;
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
  var tempNum = D(1);
  for (var i = 0; i < num; i++) {
    tempNum = tempNum.mul(i+1);
  }
  return tempNum;
}
