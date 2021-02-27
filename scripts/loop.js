var tickDone = 0, tSpeed = 0.033;
setInterval( function () {
  var dt = (new Date().getTime()-game.tLast)/1000*game.gameSpeed;
  if (dt >= 60*game.gameSpeed) {
    commandAppend(`${timeNotation(dt/game.gameSpeed)} of progress done!`, 0, 1);
  }
  game.tLast = new Date().getTime();
  calcAll(dt);
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
basicInits();
