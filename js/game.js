const area = document.getElementsByClassName('canvas')[0];
const canvas = document.getElementById('canvas');
canvas.width = area.clientWidth;
canvas.height = area.clientHeight;
const ctx = canvas.getContext("2d");
ctx.font = "50px Arial";
ctx.lineWidth = 5;
ctx.strokeRect(0, 0, canvas.width, canvas.height);

onselectstart = (e) => {
    e.preventDefault()
}

let ratio, ratio_w = canvas.width / 1280, ratio_h = canvas.height / 720;
if (ratio_w < 1 && ratio_h < 1) {
    ratio = (ratio_w + ratio_h) / 2;

    relayRadius *= ratio;
    relayRange *= ratio;
    relayAttackRange *= ratio;
    baseRadius *= ratio;
    shotSpeed *= ratio;
    shotWidth *= ratio;
    energyRadius *= ratio;
    maxEnergySpeed *= ratio;
    energySpeed *= ratio;
    enemyRadius *= ratio;
    enemySpeed *= ratio;
}

let gameTick = 0;
let base = new Base(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2));
let relays = [];
let enemies = [];
let shots = [];

canvas.addEventListener('mousedown', function (e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let new_relay = new Relay(x, y);

    if (base.collideWith(new_relay)) return;
    for (let relay of relays) {
        if (relay.collideWith(new_relay)) return;
    }

    if (Math.sqrt((base.x - new_relay.x) ** 2 + (base.y - new_relay.y) ** 2) < relayRange) {
        new_relay.neighbors.push(base);
        base.neighbors.push(new_relay);
    }
    for (let relay of relays) {
        if (Math.sqrt((relay.x - new_relay.x) ** 2 + (relay.y - new_relay.y) ** 2) < relayRange) {
            new_relay.neighbors.push(relay);
            relay.neighbors.push(new_relay);
        }
    }
    relays.push(new_relay);
})

function shuffle(a) {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function tick() {
    ++gameTick;

    enemySpawnRate -= (.00007 * (enemySpawnRate - minEnemySpawnRate));
    if (Math.floor(Math.random() * enemySpawnRate) === 0) enemies.push(new Enemy());

    shuffle(relays);
    shuffle(enemies);

    base.update();
    for (let relay of relays) relay.update();
    for (let enemy of enemies) enemy.update();
    for (let shot of shots) shot.update();

    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    base.draw();
    for (let relay of relays) relay.draw();
    for (let enemy of enemies) enemy.draw();
    for (let shot of shots) shot.draw();

    if (base.health <= 0) {
        clearInterval(interval);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#000000';
        ctx.fillText('Game Over :(', canvas.width / 2, 60);
    }
}

let FPS = 60;
let interval = setInterval(tick, Math.floor(1000 / FPS));
let paused = false;

function pause() {
    if (paused) {
        interval = setInterval(tick, Math.floor(1000 / FPS));
        paused = false;
    } else {
        clearInterval(interval);
        paused = true;
    }
}

function changeFPS(value) {
    FPS = value;
    clearInterval(interval);
    interval = setInterval(tick, Math.floor(1000 / FPS))
}

document.addEventListener('keydown', function (e) {
    if (e.code === 'Space') pause();
})

const credits = document.getElementById('credits');

const costProduction = document.getElementById('costProduction');
const prodLvl = document.getElementById('prodLvl');

function upgradeProduction() {
    if (Number(credits.innerText) >= Number(costProduction.innerText)) {
        credits.innerText -= costProduction.innerText;
        ++prodLvl.innerText;
        produceEvery -= (.2 * (produceEvery - minProduceEvery));
        costProduction.innerText = ((Math.sqrt(Number(costProduction.innerText)) + 1) ** 2).toString();
    }
}

const costEfficiency = document.getElementById('costEfficiency');
const effLvl = document.getElementById('effLvl');

function upgradeEfficiency() {
    if (Number(credits.innerText) >= Number(costEfficiency.innerText)) {
        credits.innerText -= costEfficiency.innerText;
        ++effLvl.innerText;
        ++shotsPerEnergy;
        energySpeed += (.1 * (maxEnergySpeed - energySpeed));
        costEfficiency.innerText = ((Math.sqrt(Number(costEfficiency.innerText)) + 2) ** 2).toString();
    }
}

const costRange = document.getElementById('costRange');
const rangeLvl = document.getElementById('rangeLvl');

function upgradeRange() {
    if (Number(credits.innerText) >= Number(costRange.innerText)) {
        credits.innerText -= costRange.innerText;
        ++rangeLvl.innerText;
        relayAttackRange += (.05 * ((Math.min(canvas.width, canvas.height) / 2) - relayAttackRange));
        costRange.innerText = ((Math.sqrt(Number(costRange.innerText)) + 1) ** 2).toString();
    }
}
