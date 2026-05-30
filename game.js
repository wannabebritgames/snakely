const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let state = "menu";

let player;
let snakes = [];
let foods = [];
let powerups = [];

let world = 4000;

let mouseX = 0;
let mouseY = 0;

let score = 0;
let coins = Number(localStorage.coins || 0);
let best = Number(localStorage.best || 0);

let shake = 0;

/* resize */
function resize(){
    canvas.width = innerWidth;
    canvas.height = innerHeight;
}
window.addEventListener("resize", resize);
resize();

/* mouse */
document.addEventListener("mousemove",(e)=>{
    mouseX = e.clientX;
    mouseY = e.clientY;
});

/* START */
window.startGame = function(){

    state = "play";
    document.getElementById("menu").style.display = "none";

    player = new Snake(world/2, world/2, "#00ffcc", true);

    snakes = [player];

    /* bots */
    for(let i=0;i<10;i++){
        snakes.push(new Snake(
            Math.random()*world,
            Math.random()*world,
            "#ff3df2"
        ));
    }

    /* food */
    foods = [];
    for(let i=0;i<200;i++){
        foods.push({x:Math.random()*world,y:Math.random()*world});
    }

    /* powerups */
    powerups = [];

    loop();
};

/* SLITHER MOVEMENT (FIXED) */
function updatePlayer(){

    let targetAngle = Math.atan2(
        mouseY - canvas.height/2,
        mouseX - canvas.width/2
    );

    /* smooth turning */
    player.angle += (targetAngle - player.angle) * 0.08;

    player.speed = 3;

    player.x += Math.cos(player.angle) * player.speed;
    player.y += Math.sin(player.angle) * player.speed;

    player.body.push({x:player.x,y:player.y});

    if(player.body.length > player.length){
        player.body.shift();
    }
}

/* BOT AI */
function updateBots(){

    snakes.forEach(s=>{
        if(s.isPlayer) return;

        let randomTurn = (Math.random()-0.5)*0.2;
        s.angle += randomTurn;

        s.x += Math.cos(s.angle)*2;
        s.y += Math.sin(s.angle)*2;

        s.body.push({x:s.x,y:s.y});
        if(s.body.length > s.length){
            s.body.shift();
        }
    });
}

/* FOOD */
function checkFood(){

    foods.forEach((f,i)=>{
        let d = Math.hypot(player.x-f.x, player.y-f.y);

        if(d < 20){
            player.length += 3;
            score++;
            coins++;

            localStorage.coins = coins;

            foods.splice(i,1);
            foods.push({x:Math.random()*world,y:Math.random()*world});
        }
    });
}

/* COLLISIONS (bots) */
function checkCollisions(){

    snakes.forEach(s=>{
        if(s === player) return;

        let d = Math.hypot(player.x - s.x, player.y - s.y);

        if(d < 15){
            gameOver();
        }
    });
}

/* POWERUPS */
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
            if(p.type==="speed"){
                player.speed = 6;
                setTimeout(()=>player.speed=3,3000);
            }
            powerups.splice(i,1);
        }
    });
}

/* DRAW */
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
    });

    ctx.restore();

    /* HUD */
    ctx.fillStyle="white";
    ctx.fillText("Score: " + score, 20, 20);
    ctx.fillText("Coins: " + coins, 20, 40);
}

/* GAME OVER */
function gameOver(){

    shake = 15;

    let interval = setInterval(()=>{
        canvas.style.transform =
        `translate(${Math.random()*10-5}px,${Math.random()*10-5}px)`;

        shake--;
        if(shake<=0){
            clearInterval(interval);
            canvas.style.transform="translate(0,0)";
        }
    },30);

    best = Math.max(best, score);
    localStorage.best = best;

    state = "menu";
    document.getElementById("menu").style.display = "flex";
}

/* LOOP */
function loop(){

    if(state !== "play") return;

    updatePlayer();
    updateBots();
    checkFood();
    checkCollisions();
    checkPowerups();
    spawnPowerups();

    draw();

    requestAnimationFrame(loop);
}
