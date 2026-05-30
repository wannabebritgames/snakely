const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let grid = 20;
let snake, food;
let dx, dy;
let score = 0;
let interval;
let speed = 90;

let ghost = [];
let ghostReplayIndex = 0;

let screenShake = 0;

const music = document.getElementById("music");
const eatSfx = document.getElementById("eat");
const deathSfx = document.getElementById("death");

let state = "menu"; // menu | play

let skin = "neon";

let best = localStorage.getItem("best") || 0;
document.getElementById("best").innerText = "BEST: " + best;

/* FULLSCREEN */
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

/* INPUT */
document.addEventListener("keydown", (e) => {
    if (state !== "play") return;

    if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
        e.preventDefault();
    }

    if (e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -1; }
    if (e.key === "ArrowDown" && dy === 0) { dx = 0; dy = 1; }
    if (e.key === "ArrowLeft" && dx === 0) { dx = -1; dy = 0; }
    if (e.key === "ArrowRight" && dx === 0) { dx = 1; dy = 0; }
});

/* START */
document.getElementById("startBtn").onclick = () => {
    skin = document.getElementById("skin").value;
    startGame();
};

function startGame() {
    state = "play";

    document.getElementById("menu").style.display = "none";

    snake = [{x:10,y:10}];
    dx = 1;
    dy = 0;
    score = 0;

    ghost = [];
    ghostReplayIndex = 0;

    food = spawn();

    music.volume = 0.3;
    music.play().catch(()=>{});

    clearInterval(interval);
    interval = setInterval(loop, speed);
}

/* SPAWN */
function spawn() {
    return {
        x: Math.floor(Math.random() * (canvas.width / grid)),
        y: Math.floor(Math.random() * (canvas.height / grid))
    };
}

/* LOOP */
function loop() {
    let head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };

    ghost.push({...head});

    if (
        head.x < 0 || head.y < 0 ||
        head.x > canvas.width / grid ||
        head.y > canvas.height / grid
    ) return gameOver();

    for (let s of snake) {
        if (head.x === s.x && head.y === s.y) {
            return gameOver();
        }
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        food = spawn();
        eatSfx.play();
    } else {
        snake.pop();
    }

    draw();
}

/* GAME OVER */
function gameOver() {
    deathSfx.play();
    music.pause();

    state = "menu";
    document.getElementById("menu").style.display = "flex";

    if (score > best) {
        best = score;
        localStorage.setItem("best", best);
    }

    document.getElementById("best").innerText = "BEST: " + best;

    // SAVE GHOST RUN
    localStorage.setItem("ghost", JSON.stringify(ghost));

    clearInterval(interval);
}

/* DRAW */
function draw() {
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // FOOD
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * grid, food.y * grid, grid-2, grid-2);

    // SNAKE SKINS
    let color = getSkinColor();

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;

        ctx.fillRect(
            snake[i].x * grid,
            snake[i].y * grid,
            grid-2,
            grid-2
        );
    }

    ctx.shadowBlur = 0;

    drawGhost();
}

/* SKINS */
function getSkinColor() {
    if (skin === "neon") return "#39ff14";
    if (skin === "fire") return "orange";
    if (skin === "ice") return "cyan";
    if (skin === "glitch") return "magenta";
}

/* GHOST SNAKE */
function drawGhost() {
    let past = JSON.parse(localStorage.getItem("ghost") || "[]");

    ctx.fillStyle = "rgba(255,255,255,0.2)";

    for (let p of past) {
        ctx.fillRect(p.x * grid, p.y * grid, grid-2, grid-2);
    }
}
