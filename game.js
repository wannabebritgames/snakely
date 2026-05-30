const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let state = "menu";

let player;
let foods = [];
let bots = [];

let world = 3000;

let mouseX = 0;
let mouseY = 0;

let score = 0;
let best = Number(localStorage.best || 0);

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

/* START GAME */
window.startGame = function () {

    state = "play";

    document.getElementById("menu").style.display = "none";

    player = new Snake(
        world/2,
        world/2,
        "#00ffcc",
        true
    );

    foods = [];
    bots = [];

    for(let i=0;i<200;i++){
        foods.push(new Food(
            Math.random()*world,
            Math.random()*world
        ));
    }

    for(let i=0;i<8;i++){
        bots.push(new Snake(
            Math.random()*world,
            Math.random()*world,
            "#ff3df2"
        ));
    }

    loop();
};

/* BOT AI */
function updateBots(){
    bots.forEach(b=>{
        b.angle += (Math.random()-0.5)*0.2;
        b.move();
    });
}

/* PLAYER CONTROL (slither style) */
function updatePlayer(){

    let dx = mouseX - canvas.width/2;
    let dy = mouseY - canvas.height/2;

    player.angle = Math.atan2(dy,dx);

    player.move();
}

/* FOOD */
function checkFood(){
    foods.forEach((f,i)=>{
        let d = Math.hypot(player.x-f.x, player.y-f.y);

        if(d < 20){
            player.length += 3;
            score++;
            foods.splice(i,1);

            foods.push(new Food(
                Math.random()*world,
                Math.random()*world
            ));
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

    /* bots */
    bots.forEach(b=>{
        ctx.fillStyle=b.color;
        b.body.forEach(p=>{
            ctx.fillRect(p.x,p.y,6,6);
        });
    });

    /* player */
    ctx.fillStyle=player.color;
    player.body.forEach(p=>{
        ctx.fillRect(p.x,p.y,6,6);
    });

    ctx.restore();

    ctx.fillStyle="white";
    ctx.fillText("Score: " + score, 20, 20);
}

/* LOOP */
function loop(){

    if(state !== "play") return;

    updatePlayer();
    updateBots();
    checkFood();

    draw();

    requestAnimationFrame(loop);
}
