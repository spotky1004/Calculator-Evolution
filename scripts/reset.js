function rebootReset() {
  game.rebootNum = D(0);
  game.durability = D(1).mul(game.researchLevel[5]+1);
  if (!game.programActive[4]) {
    for (var i = 0; i < game.programActive.length; i++) {
      game.programActive[i] = 0;
    }
    game.base = D(2);
  }
  if (!game.programActive[4] || game.shopBought[2] < 2) game.digits = D(1);
  if (!game.programActive[4] || game.shopBought[2] < 2) game.number = D(0);
  if (!game.programActive[4] || game.shopBought[2] < 3) game.money = D(0);
  if (!game.programActive[4] || game.shopBought[2] < 3) game.shopBought[5] = 0;
}
function quantumReset() {

}
