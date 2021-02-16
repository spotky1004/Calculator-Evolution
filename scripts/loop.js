var tickDone = 0, tSpeed = 0.033;
setInterval( function () {
  tGain = (new Date().getTime()-game.tLast)/1000*game.gameSpeed;
  if (tGain >= 60) {
    commandAppend(`${timeNotation(tGain)} of progress done!`, 0, 1);
  }
  game.tLast = new Date().getTime();
  calcAll();
  calcExtraHotkeys();
  renderAll();
  renderCalcDebugInfo();
  bugFixer();
  tickDone++;
}, 33);
setInterval( function () {
  save();
}, 20000);

load();
initAchievements();
