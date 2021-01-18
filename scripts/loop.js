setInterval( function () {
  tGain = (new Date().getTime()-game.tLast)/1000*game.gameSpeed;
  tSpeed = 0.033;
  game.tLast = new Date().getTime();
  calcAll();
  renderAll();
}, 33);
setInterval( function () {
  save();
}, 20000);

load();
initAchievements();
