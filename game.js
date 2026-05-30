const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let state = "menu";

let player = null;
let snakes = [];
let foods = [];
let powerups = [];

let world = 4000;

let mouseX = 0;
let mouseY = 0;

let score = 0;
let coins = Number(localStorage.coins || 0);
let best = Number(localStorage.best || 0);

/* =========================
   BOT NAMES
========================= */
const BOT_NAMES = [
    "Vex","Nova","Byte","Orbit","Neo","Glitch","Pixel",
    "Rex","Astra","Drift","Zyn","Ion","Zero","Nexus"
];

function getBotName(){
    return BOT_NAMES[Math.floor(Math.random()*BOT_NAMES.length)] +
    Math.floor(Math.random()*99);
}

/* =========================
   POWERUPS
========================= */
function applyPowerup(type){

    if(type === "speed"){
        player.speed = 5;
        setTimeout(()=>player.speed = 3, 2500);
    }

    if(type === "mass"){
        player.length += 10;
    }

    if(type === "shield"){
        player.shield = true;
        setTimeout(()=>player.shield = false, 4000);
    }
}

/* =========================
   RESIZE
========================= */
function resize(){
    canvas.width = innerWidth;
    canvas.height = innerHeight;
}
window.addEventListener("resize", resize);
resize();

/* =========================
   INPUT
========================= */
document.addEventListener("mousemove",(e)=>{
    mouseX = e.clientX;
    mouseY = e.clientY;
});

/* =========================
   START GAME
========================= */
window.startGame = function(){

    state = "play";
    document.getElementById("menu").style.display = "none";

    score = 0;

    player = new Snake(world/2, world/2, "#00ffcc", true);

    snakes = [player];

    /* bots */
    for(let i=0;i<12;i++){
        let bot = new Snake(
            Math.random()*world,
            Math.random()*world,
            "#ff3df2",
            false
        );

        bot.name = getBotName();
        bot.isBot = true;

        snakes.push(bot);
    }

    /* food */
    foods = [];
    for(let i=0;i<200;i++){
        foods.push({
            x:Math.random()*world,
            y:Math.random()*world
        });
    }

    powerups = [];

    requestAnimationFrame(loop);
};

/* =========================
   PLAYER MOVEMENT (SMOOTH)
========================= */
function updatePlayer(){

    if(!player) return;

    let targetAngle = Math.atan2(
        mouseY - canvas.height/2,
        mouseX - canvas.width/2
    );

    player.angle += (targetAngle - player.angle) * 0.06;

    player.speed = player.speed || 3;

    player.x += Math.cos(player.angle) * player.speed;
    player.y += Math.sin(player.angle) * player.speed;

    player.body.push({x:player.x,y:player.y});

    if(player.body.length > player.length){
        player.body.shift();
    }
}

/* =========================
   BOT AI (FOOD SEEKING)
========================= */
function updateBots(){

    snakes.forEach(s=>{
        if(s === player) return;

        let closest = null;
        let dist = Infinity;

        foods.forEach(f=>{
            let d = Math.hypot(s.x-f.x, s.y-f.y);
            if(d < dist){
                dist = d;
                closest = f;
            }
        });

        if(closest){
            let target = Math.atan2(
                closest.y - s.y,
                closest.x - s.x
            );

            s.angle += (target - s.angle) * 0.03;
        } else {
            s.angle += (Math.random()-0.5)*0.2;
        }

        s.x += Math.cos(s.angle)*2;
        s.y += Math.sin(s.angle)*2;

        s.body.push({x:s.x,y:s.y});
        if(s.body.length > s.length){
            s.body.shift();
        }
    });
}

/* =========================
   FOOD
========================= */
function checkFood(){

    foods.forEach((f,i)=>{
        let d = Math.hypot(player.x-f.x, player.y-f.y);

        if(d < 20){
            player.length += 3;
            score++;
            coins++;

            localStorage.coins = coins;

            foods.splice(i,1);
            foods.push({
                x:Math.random()*world,
                y:Math.random()*world
            });
        }
    });
}

/* =========================
   COLLISIONS (ABSORB SYSTEM)
========================= */
function checkCollisions(){

    for(let s of snakes){

        if(s === player) continue;

        let d = Math.hypot(player.x - s.x, player.y - s.y);

        if(d < 12){

            if(player.length > s.length){

                player.length += Math.floor(s.length * 0.5);
                score += 5;

                s.x = Math.random()*world;
                s.y = Math.random()*world;
                s.length = 20;
                s.body = [];

            } else {
                gameOver();
                return;
            }
        }
    }
}

/* =========================
   POWERUPS
========================= */
function spawnPowerups(){
    if(Math.random() < 0.01){
        powerups.push({
            x:Math.random()*world,
            y:Math.random()*world,
            type:"speed"
        });
    }
}

function checkPowerups(){

    powerups.forEach((p,i)=>{
        let d = Math.hypot(player.x-p.x, player.y-p.y);

        if(d < 20){
            applyPowerup(p.type);
            powerups.splice(i,1);
        }
    });
}

/* =========================
   DRAW
========================= */
function draw(){

    ctx.fillStyle="#05070a";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    let camX = player.x - canvas.width/2;
    let camY = player.y - canvas.height/2;

    ctx.save();
    ctx.translate(-camX,-camY);

    /* food */
    ctx.fillStyle="yellow";
    foods.forEach(f=>{
        ctx.fillRect(f.x,f.y,5,5);
    });

    /* powerups */
    ctx.fillStyle="cyan";
    powerups.forEach(p=>{
        ctx.fillRect(p.x,p.y,10,10);
    });

    /* snakes */
    snakes.forEach(s=>{
        ctx.fillStyle=s.color;

        s.body.forEach(p=>{
            ctx.fillRect(p.x,p.y,6,6);
        });

        if(s !== player){
            ctx.fillStyle="white";
            ctx.fillText(s.name || "BOT", s.x, s.y - 10);
        }
    });

    ctx.restore();

    ctx.fillStyle="white";
    ctx.fillText("Score: " + score, 20, 20);
    ctx.fillText("Coins: " + coins, 20, 40);
}

/* =========================
   GAME OVER
========================= */
function gameOver(){

    best = Math.max(best, score);
    localStorage.best = best;

    state = "menu";
    document.getElementById("menu").style.display = "flex";
}

/* =========================
   LOOP
========================= */
function loop(){

    if(state !== "play") return;
    if(!player) return;

    updatePlayer();
    updateBots();
    checkFood();
    checkCollisions();
    checkPowerups();
    spawnPowerups();

    draw();

    requestAnimationFrame(loop);
}
