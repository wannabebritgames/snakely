const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let grid = 20;
let snake, food, powerup;
let dx, dy;
let score = 0;
let high = localStorage.getItem("high") || 0;

let interval;
let speed = 100;

const music = document.getElementById("music");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resize);
resize();

/* STOP PAGE SCROLL */
window.addEventListener("keydown", (e) => {
    if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key)) {
        e.preventDefault();
    }
});

/* CONTROLS */
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -1; }
    if (e.key === "ArrowDown" && dy === 0) { dx = 0; dy = 1; }
    if (e.key === "ArrowLeft" && dx === 0) { dx = -1; dy = 0; }
    if (e.key === "ArrowRight" && dx === 0) { dx = 1; dy = 0; }
});

/* GAME SETUP */
function startGame() {
    snake = [{x:10,y:10}];
    dx = 1;
    dy = 0;
    score = 0;

    food = spawn();
    powerup = spawnPower();

    music.play();

    clearInterval(interval);
    interval = setInterval(loop, speed);
}

document.getElementById("start").onclick = startGame;

function spawn() {
    return {
        x: Math.floor(Math.random() * (canvas.width / grid)),
        y: Math.floor(Math.random() * (canvas.height / grid))
    };
}

function spawnPower() {
    const types = ["speed", "double"];
    return {
        ...spawn(),
        type: types[Math.floor(Math.random() * types.length)]
    };
}

/* GAME LOOP */
function loop() {
    const head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };

    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= canvas.width / grid ||
        head.y >= canvas.height / grid
    ) {
        gameOver();
        return;
    }

    for (let s of snake) {
        if (head.x === s.x && head.y === s.y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        food = spawn();
    } else {
        snake.pop();
    }

    if (head.x === powerup.x && head.y === powerup.y) {
        if (powerup.type === "speed") {
            speed = 50;
            clearInterval(interval);
            interval = setInterval(loop, speed);
            setTimeout(() => {
                speed = 100;
                clearInterval(interval);
                interval = setInterval(loop, speed);
            }, 4000);
        }

        if (powerup.type === "double") {
            score += 5;
        }

        powerup = spawnPower();
    }

    draw();
    updateUI();
}

/* DRAW RETRO STYLE */
function draw() {
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    const color = document.getElementById("color").value;

    // FOOD GLOW
    ctx.shadowBlur = 20;
    ctx.shadowColor = "red";
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * grid, food.y * grid, grid-2, grid-2);

    // POWERUP
    ctx.shadowColor = "yellow";
    ctx.fillStyle = "yellow";
    ctx.fillRect(powerup.x * grid, powerup.y * grid, grid-2, grid-2);

    // SNAKE
    ctx.shadowColor = color;

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = color;
        ctx.fillRect(snake[i].x * grid, snake[i].y * grid, grid-2, grid-2);
    }

    ctx.shadowBlur = 0;
}

/* UI */
function updateUI() {
    document.getElementById("scoreText").innerText = "Score: " + score;

    if (score > high) {
        high = score;
        localStorage.setItem("high", high);
    }

    document.getElementById("highText").innerText = "High Score: " + high;
}

/* GAME OVER */
function gameOver() {
    clearInterval(interval);
    music.pause();
    alert("GAME OVER - Score: " + score);
}
