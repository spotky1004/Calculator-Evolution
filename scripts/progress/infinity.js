(function(){
    ipUpgradeName = ["CPU", "RP", "Qubit", "SP", "IP"];
}())

function calcInfinity() {
    if (game.t4toggle && !game.money.isFinite()) infinity();
}

function infinity() {
    game.t5resets = game.t5resets.add(1);
    game.infinityPoint = D.max(game.infinityPoint, calcIpGain(new Date().getTime() - game.t5resetTime));
    game.t5fastTime = new Date().getTime() - game.t5resetTime;
    game.t5resetTime = new Date().getTime();
    game.bestIp = D.max(game.bestIp, game.infinityPoint);
    infinityReset();

    commandAppend(`Go Infinity (${ordNum(game.t5resets)})`, (30+game.t5resets.toNumber()*1)%360, 1);
}

function renderInfinity() {
    document.getElementById("ipDisplay").innerHTML = `You have ${dNotation(game.infinityPoint, 4, 0)} Infinity Point`;
    document.getElementById("ipDesc").innerHTML = `
    If you go Infinity now, you'll get ${dNotation(calcIpGain(new Date().getTime() - game.t5resetTime), 4, 0)} IP<br>
    Your IP amount will be overwritten when you go Infinity<br>
    You cannot get back spent IP, use wisely`;
    [...document.getElementsByClassName("ipUpgrade")].forEach((ele, idx) => {
        ele.innerHTML = `${ipUpgradeName[idx]}<br>x${dNotation(calcIpUpgradeEffect(idx), 2, 4)}`;
        ele.classList[game.infinityPoint.gte(1)?"add":"remove"]('activated');
    });
}

function buyIpUpgrade(idx) {
    var spentIP = D.max(0, game.infinityPoint.div(10).ceil(0));
    game.infinityPoint = game.infinityPoint.sub(spentIP);
    game.infinityUpgradeSpent[idx] = game.infinityUpgradeSpent[idx].add(spentIP);
}

function calcIpGain(time) {
    var tempGain = D(5).add((6*3600*1000)**2 / time**2);
    tempGain = tempGain.mul(calcIpUpgradeEffect(4));
    return tempGain.floor(0);
}
function calcIpUpgradeEffect(idx, baseRes=game.infinityUpgradeSpent[idx]) {
    var tempMult = D(1);
    switch (idx) {
        case 0:
            tempMult = baseRes.add(1).pow(10);
            break;
        case 1:
            tempMult = baseRes.add(1).pow(3);
            break;
        case 2:
            tempMult = D.max(1, D(3).pow(baseRes.mul(6).pow(0.6)));
            break;
        case 3:
            tempMult = baseRes.pow(1.1).div(5).add(1);
            break;
        case 4:
            tempMult = baseRes.div(10).pow(0.5).add(1);
            break;
    }
    return tempMult;
}