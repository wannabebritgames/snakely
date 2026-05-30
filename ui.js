document.addEventListener("DOMContentLoaded",()=>{

    const playBtn = document.getElementById("playBtn");
    const bestText = document.getElementById("bestText");

    // show best score on menu
    let best = localStorage.best || 0;
    if(bestText) bestText.innerText = "BEST: " + best;

    /* =========================
       PLAY BUTTON
    ========================= */
    playBtn?.addEventListener("click",()=>{

        console.log("PLAY CLICKED");

        if(window.startGame){
            window.startGame();
        } else {
            console.error("startGame missing");
        }
    });

    /* =========================
       SETTINGS SYSTEM
    ========================= */

    let settings = {
        crt: true,
        shake: true
    };

    window.settings = settings;

    const settingsBtn = document.getElementById("settingsBtn");
    const settingsPanel = document.getElementById("settingsPanel");

    settingsBtn?.addEventListener("click",()=>{

        if(settingsPanel){
            settingsPanel.style.display =
                settingsPanel.style.display === "block"
                ? "none"
                : "block";
        }

    });

});

/* =========================
   LEADERBOARD (GLOBAL)
   Call this from game.js
========================= */
function updateLeaderboard(snakes){

    if(!snakes) return;

    let sorted = [...snakes].sort((a,b)=>b.length - a.length);

    let html = "<h3>LEADERBOARD</h3>";

    sorted.slice(0,8).forEach((s,i)=>{
        html += `
        <div>
            ${i+1}. ${s.isPlayer ? "YOU" : (s.name || "BOT")}
            - ${s.length}
        </div>`;
    });

    let lb = document.getElementById("leaderboard");
    if(lb) lb.innerHTML = html;
}

/* =========================
   SETTINGS TOGGLE HELPERS
========================= */

function toggleCRT(){
    if(window.settings){
        window.settings.crt = !window.settings.crt;

        let crt = document.getElementById("crt");
        if(crt){
            crt.style.display = window.settings.crt ? "block" : "none";
        }
    }
}

function toggleShake(){
    if(window.settings){
        window.settings.shake = !window.settings.shake;
    }
}
