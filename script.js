const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const grid = 30;
const tiles = canvas.width / grid;

let snake;
let food;
let powerup;

let dx = 1;
let dy = 0;

let score = 0;
let highscore = localStorage.getItem("snakeHighscore") || 0;

document.getElementById("highscore").textContent = highscore;

let speed = 120;
let interval;

let shield = false;
let doublePoints = false;

function startGame() {

    clearInterval(interval);

    snake = [
        {x:10,y:10},
        {x:9,y:10},
        {x:8,y:10}
    ];

    score = 0;
    dx = 1;
    dy = 0;

    shield = false;
    doublePoints = false;

    food = randomPos();
    powerup = randomPowerup();

    speed = 120;

    interval = setInterval(gameLoop, speed);
}

function randomPos() {
    return {
        x: Math.floor(Math.random()*tiles),
        y: Math.floor(Math.random()*tiles)
    };
}

function randomPowerup() {

    const types = ["speed","shield","double"];

    return {
        ...randomPos(),
        type: types[Math.floor(Math.random()*types.length)]
    };
}

document.getElementById("startBtn").addEventListener("click", startGame);

document.addEventListener("keydown",(e)=>{

    if(e.key==="ArrowUp" && dy===0){
        dx=0;dy=-1;
    }

    if(e.key==="ArrowDown" && dy===0){
        dx=0;dy=1;
    }

    if(e.key==="ArrowLeft" && dx===0){
        dx=-1;dy=0;
    }

    if(e.key==="ArrowRight" && dx===0){
        dx=1;dy=0;
    }
});

function gameLoop() {

    const head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };

    if(
        head.x < 0 ||
        head.y < 0 ||
        head.x >= tiles ||
        head.y >= tiles
    ){

        if(shield){
            shield = false;
            document.getElementById("status").textContent =
                "Shield saved you!";
            return;
        }

        gameOver();
        return;
    }

    for(let part of snake){

        if(head.x===part.x && head.y===part.y){

            if(shield){
                shield=false;
                document.getElementById("status").textContent =
                    "Shield saved you!";
                return;
            }

            gameOver();
            return;
        }
    }

    snake.unshift(head);

    if(head.x===food.x && head.y===food.y){

        score += doublePoints ? 2 : 1;

        food = randomPos();

    } else {

        snake.pop();
    }

    if(head.x===powerup.x && head.y===powerup.y){

        activatePower(powerup.type);

        powerup = randomPowerup();
    }

    draw();

    document.getElementById("score").textContent = score;
}

function activatePower(type){

    const status = document.getElementById("status");

    if(type==="speed"){

        status.textContent = "⚡ Speed Boost";

        clearInterval(interval);

        interval = setInterval(gameLoop,70);

        setTimeout(()=>{
            clearInterval(interval);
            interval=setInterval(gameLoop,120);
        },5000);
    }

    if(type==="shield"){

        shield = true;

        status.textContent = "🛡 Shield Active";
    }

    if(type==="double"){

        doublePoints = true;

        status.textContent = "⭐ Double Points";

        setTimeout(()=>{
            doublePoints=false;
        },8000);
    }
}

function gameOver(){

    if(score > highscore){

        highscore = score;

        localStorage.setItem(
            "snakeHighscore",
            highscore
        );
    }

    document.getElementById("highscore").textContent =
        highscore;

    alert("Game Over! Score: " + score);

    clearInterval(interval);
}

function draw(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    const color =
        document.getElementById("snakeColor").value;

    const pattern =
        document.getElementById("snakePattern").value;

    snake.forEach((part,index)=>{

        ctx.fillStyle = color;

        ctx.fillRect(
            part.x*grid,
            part.y*grid,
            grid-2,
            grid-2
        );

        if(pattern==="striped"){

            ctx.fillStyle = "white";

            ctx.fillRect(
                part.x*grid+8,
                part.y*grid,
                4,
                grid-2
            );
        }
    });

    ctx.fillStyle="red";

    ctx.fillRect(
        food.x*grid,
        food.y*grid,
        grid-2,
        grid-2
    );

    if(powerup.type==="speed")
        ctx.fillStyle="yellow";

    if(powerup.type==="shield")
        ctx.fillStyle="cyan";

    if(powerup.type==="double")
        ctx.fillStyle="gold";

    ctx.beginPath();

    ctx.arc(
        powerup.x*grid+grid/2,
        powerup.y*grid+grid/2,
        10,
        0,
        Math.PI*2
    );

    ctx.fill();
}
