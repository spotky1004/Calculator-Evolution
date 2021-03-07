(function(){
    ipUpgradeName = ["CPU", "RP", "Qubit", "SP", "IP"];
    ipPassiveDesc = [
        "Start Infinity with ${dNotation(game.t5resets, 4, 0)} SP (based on Infinity stat)",
        "Activate programs automatically<br>Durability won't decrease",
        "Keep Challenge Records",
        "Retain Singularity VII",
        "Keep Challenge Completions",
        "250 Extra Process",
        "Keep Grid placement"
    ];
    ipPassiveDisplay = 0;
    for (var i = 0; i < 5; i++) {
        var contentNode = document.createElement("div");
        contentNode.classList.add("ipPassiveContent");
        document.getElementById("ipPassiveContentWarp").append(contentNode);
    }
}())

function calcInfinity() {
    if (game.t4toggle && !game.money.isFinite()) infinity();
    ipPassiveAuto();
}

function infinity() {
    game.t5resets = game.t5resets.add(1);
    game.infinityPoint = D.max(game.infinityPoint, calcIpGain(new Date().getTime() - game.t5resetTime));
    game.t5record = Math.min(game.t5record, new Date().getTime() - game.t5resetTime);
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
    document.getElementById("ipPassiveCost").innerHTML = dNotation(calcIpPassiveCost(), 4, 0);
    [...document.getElementsByClassName("ipPassiveContent")].forEach((ele, idx) => {
        var tempStr = ipPassiveDesc[idx+ipPassiveDisplay];
        ele.innerHTML = (game.ipPassiveBought == idx+ipPassiveDisplay ? "<span style=\"opacity: 0.2\">" : "") + (typeof tempStr != "undefined" && game.ipPassiveBought >= idx+ipPassiveDisplay ? new Function("return `" + tempStr + "`")() : "") + (game.ipPassiveBought == idx+ipPassiveDisplay ? "</span>" : "");
    });
    document.getElementById("buyIpPassive").classList[game.infinityPoint.gte(calcIpPassiveCost())?"add":"remove"]('activated');
}
function renderInfinityInfo() {
    $("#inifnityInfo").style.display = game.t5toggle ? "block" : "none";
    if (game.t5toggle) $("#inifnityInfo").innerHTML = `${timeNotation((new Date().getTime()-game.t5resetTime)/1000)} / ${dNotation(calcIpGain(new Date().getTime() - game.t5resetTime), 4, 0)} IP`;  
}

function buyIpUpgrade(idx) {
    var spentIP = D.max(0, game.infinityPoint.div(10).ceil(0));
    game.infinityPoint = game.infinityPoint.sub(spentIP);
    game.infinityUpgradeSpent[idx] = game.infinityUpgradeSpent[idx].add(spentIP);
}
function ipPassiveMove(shift=0) {
    ipPassiveDisplay = Math.max(Math.min(ipPassiveDisplay+shift, game.ipPassiveBought-4), 0);
}
function buyIpPassive() {
    if (game.infinityPoint.lt(calcIpPassiveCost())) return;
    game.infinityPoint = game.infinityPoint.sub(calcIpPassiveCost());
    game.ipPassiveBought++;
    
    // fix
    switch (game.ipPassiveBought) {
        case 1:
            game.singularityPower = D.max(game.singularityPower, game.t5resets);
            break;
        case 4:
            game.quantumUpgradeBought.push('77');
            break;
    }
}
function ipPassiveAuto() {
    if (game.ipPassiveBought >= 2) for (var i = 0; i < 7; i++) if (calcProcessLeft() > 0 && !game.programActive[i]) activeProgram(i);
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
            tempMult = baseRes.pow(1.1).div(5).add(1).pow(1/2).add(baseRes.div(10));
            break;
        case 4:
            tempMult = baseRes.div(10).pow(0.5).add(1);
            break;
    }
    return tempMult;
}
function calcIpPassiveCost(lv=game.ipPassiveBought) {
    return lv < ipPassiveDesc.length ? D(2).mul(4**lv) : D(Infinity);
}