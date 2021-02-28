(function(){

}())

function calcInfinity() {
    if (game.t4toggle && !game.money.isFinite()) infinity();
}

function infinity() {
    game.t5resets = game.t5resets.add(1);
    game.infinityPoint = D.max(game.infinityPoint, calcIpGain());
    game.t5resetTime = new Date().getTime();
    infinityReset();

    commandAppend(`Go Infinity (${ordNum(game.t5resets)})`, (30+game.t5resets.toNumber()*1)%360, 1);
}

function renderInfinity() {
    document.getElementById("ipDisplay").innerHTML = `You have ${dNotation(game.infinityPoint, 4, 0)} Infinity Point`;
    document.getElementById("ipDesc").innerHTML = `If you go Infinity now, you'll get ${dNotation(calcIpGain(), 4, 0)} IP<br>Your IP amount will overwrited when you go Infinity<br>You cannot get back spent IP, use wisely`
}

function calcIpGain() {
    return D(5).add((6*3600*1000)**2 / (new Date().getTime() - game.t5resetTime)**2).floor(0);
}