function singularity() {
  if (game.quantumLab.lt(80)) return;
  alert('You beat the game :D\nWait for next update!');
}
function renderSingularity() {
  $("#singularityButton").className = game.quantumLab.gte(80) ? "" : "disabled";
}
