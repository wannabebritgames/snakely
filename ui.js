document.addEventListener("DOMContentLoaded",()=>{

    const playBtn = document.getElementById("playBtn");

    playBtn.addEventListener("click",()=>{

        console.log("PLAY CLICKED");

        if(window.startGame){
            window.startGame();
        } else {
            console.error("startGame missing");
        }
        function updateLeaderboard(snakes){

    let sorted = [...snakes].sort((a,b)=>b.length - a.length);

    let html = "<h3>LEADERBOARD</h3>";

    sorted.slice(0,8).forEach((s,i)=>{
        html += `<div>
            ${i+1}. ${s.isPlayer ? "YOU" : s.name || "BOT"}
            - ${s.length}
        </div>`;
    });

    let lb = document.getElementById("leaderboard");
    if(lb) lb.innerHTML = html;
}
        let settings = {
    crt: true,
    shake: true
};

document.getElementById("settingsBtn")?.addEventListener("click",()=>{

    let panel = document.getElementById("settingsPanel");

    if(panel){
        panel.style.display =
        panel.style.display === "block" ? "none" : "block";
    }

});

    });

});
