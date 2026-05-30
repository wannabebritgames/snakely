const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let grid = 20;

let snake, food;
let dx, dy;

let running = false;
let coins = Number(localStorage.coins || 0);
let best = Number(localStorage.best || 0);

let score = 0;

let ghostRun = [];
let ghostEnabled = true;

let achievements = JSON.parse(localStorage.achievements || "{}");

let screenShake = 0;

/* resize */
function resize(){
    canvas.width = innerWidth;
    canvas.height = innerHeight;
}
window.addEventListener("resize", resize);
resize();

/* UI */
document.getElementById("coins").innerText = "COINS: " + coins;
document.getElementById("best").innerText = "BEST: " + best;

/* COIN SYSTEM */
document.getElementById("insertCoin").onclick = () => {
    coins++;
    localStorage.coins = coins;
    document.getElementById("coins").innerText = "COINS: " + coins;
};

/* START */
document.getElementById("startBtn").onclick = () => {
    if (coins <= 0) return;

    coins--;
    localStorage.coins = coins;

    startGame();
};

function startGame(){
    running = true;

    document.getElementById("menu").style.display = "none";

    snake = [{x:10,y:10}];
    dx = 1;
    dy = 0;

    score = 0;
    food = spawn();

    ghostRun = [];

    loop();
}

/* spawn */
function spawn(){
    return {
        x: Math.floor(Math.random()*canvas.width/grid),
        y: Math.floor(Math.random()*canvas.height/grid)
    };
}

/* input */
document.addEventListener("keydown",(e)=>{
    if(!running) return;

    if(e.key==="ArrowUp"&&dy===0){dx=0;dy=-1}
    if(e.key==="ArrowDown"&&dy===0){dx=0;dy=1}
    if(e.key==="ArrowLeft"&&dx===0){dx=-1;dy=0}
    if(e.key==="ArrowRight"&&dx===0){dx=1;dy=0}
});

/* LOOP */
function loop(){
    if(!running) return;

    let head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };

    /* GHOST RECORD */
    ghostRun.push([...snake]);

    if(head.x<0||head.y<0||
       head.x>canvas.width/grid||
       head.y>canvas.height/grid){
        return gameOver();
    }

    for(let s of snake){
        if(head.x===s.x&&head.y===s.y){
            return gameOver();
        }
    }

    snake.unshift(head);

    if(head.x===food.x&&head.y===food.y){
        score++;
        food = spawn();
        checkAchievements();
    } else snake.pop();

    draw();

    setTimeout(loop, 80);
}

/* DRAW */
function draw(){

    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    /* FOOD */
    ctx.fillStyle = "red";
    ctx.shadowBlur = 20;
    ctx.shadowColor = "red";
    ctx.fillRect(food.x*grid,food.y*grid,grid,grid);

    /* SNAKE */
    ctx.shadowColor = "#39ff14";

    snake.forEach(p=>{
        ctx.fillStyle = "#39ff14";
        ctx.fillRect(p.x*grid,p.y*grid,grid,grid);
    });

    ctx.shadowBlur = 0;

    /* GHOST */
    if(ghostEnabled && localStorage.lastGhost){
        let g = JSON.parse(localStorage.lastGhost);

        ctx.fillStyle = "rgba(255,255,255,0.2)";
        g.forEach(frame=>{
            frame.forEach(p=>{
                ctx.fillRect(p.x*grid,p.y*grid,grid,grid);
            });
        });
    }
}

/* GAME OVER */
function gameOver(){

    running = false;

    screenShake = 20;
    let shake = setInterval(()=>{
        canvas.style.transform =
        `translate(${Math.random()*10-5}px,${Math.random()*10-5}px)`;

        screenShake--;
        if(screenShake<=0){
            clearInterval(shake);
            canvas.style.transform="translate(0,0)";
        }
    },30);

    if(score > best){
        best = score;
        localStorage.best = best;
    }

    localStorage.lastGhost = JSON.stringify(ghostRun);

    unlockAchievement("FIRST_DEATH");

    document.getElementById("menu").style.display = "flex";
}

/* ACHIEVEMENTS */
function unlockAchievement(id){
    if(achievements[id]) return;

    achievements[id] = true;
    localStorage.achievements = JSON.stringify(achievements);

    document.getElementById("achievements").innerText =
        "ACHIEVEMENT: " + id;
}

function checkAchievements(){
    if(score === 1) unlockAchievement("FIRST_FOOD");
    if(score === 10) unlockAchievement("HUNGRY");
    if(score === 25) unlockAchievement("OBSESSED");
}
