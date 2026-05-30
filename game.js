const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let state = "menu";

let player;
let foods = [];
let snakes = [];

let world = 3000;

let keys = {};

let score = 0;

/* resize */
function resize(){
    canvas.width = innerWidth;
    canvas.height = innerHeight;
}
window.addEventListener("resize", resize);
resize();

/* INPUT */
document.addEventListener("keydown",(e)=>{
    keys[e.key] = true;
});

document.addEventListener("keyup",(e)=>{
    keys[e.key] = false;
});

/* RANDOM NAME */
function randomName(){
    const names = ["Nova","Byte","Vex","Orbit","Neo","Pixel"];
    return names[Math.floor(Math.random()*names.length)] +
    Math.floor(Math.random()*999);
}

/* UI */
document.getElementById("randomBtn").onclick = ()=>{
    document.getElementById("nameInput").value = randomName();
};

document.getElementById("shopBtn").onclick = ()=>{
    document.getElementById("shop").classList.toggle("hidden");
};

document.getElementById("settingsBtn").onclick = ()=>{
    document.getElementById("settings").classList.toggle("hidden");
};

/* START GAME */
document.getElementById("playBtn").onclick = startGame;

function startGame(){

    state = "play";

    document.getElementById("menu").style.display = "none";

    player = {
        x: world/2,
        y: world/2,
        angle: 0,
        speed: 3,
        body: [],
        length: 20
    };

    foods = [];

    for(let i=0;i<200;i++){
        foods.push({
            x: Math.random()*world,
            y: Math.random()*world
        });
    }

    loop();
}

/* MOVE */
function updatePlayer(){

    if(keys["ArrowUp"]) player.speed = 4;
    else player.speed = 3;

    let mx = canvas.width/2;
    let my = canvas.height/2;

    let dx = (mx - canvas.width/2);
    let dy = (my - canvas.height/2);

    player.angle = Math.atan2(dy+1, dx+1);

    player.x += Math.cos(player.angle)*player.speed;
    player.y += Math.sin(player.angle)*player.speed;

    player.body.push({x:player.x,y:player.y});

    if(player.body.length > player.length){
        player.body.shift();
    }
}

/* FOOD */
function checkFood(){
    foods.forEach((f,i)=>{
        let d = Math.hypot(player.x-f.x, player.y-f.y);

        if(d < 20){
            player.length += 3;
            score++;
            foods.splice(i,1);
            foods.push({x:Math.random()*world,y:Math.random()*world});
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
        ctx.fillRect(f.x,f.y,6,6);
    });

    /* player */
    ctx.fillStyle="#00ffcc";

    player.body.forEach(p=>{
        ctx.fillRect(p.x,p.y,8,8);
    });

    ctx.restore();

    ctx.fillStyle="white";
    ctx.fillText("Score: " + score, 20, 20);
}

/* LOOP */
function loop(){

    if(state !== "play") return;

    updatePlayer();
    checkFood();
    draw();

    requestAnimationFrame(loop);
}
