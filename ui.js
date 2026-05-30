document.addEventListener("DOMContentLoaded",()=>{

    const playBtn = document.getElementById("playBtn");

    playBtn.addEventListener("click",()=>{

        console.log("PLAY CLICKED");

        if(window.startGame){
            window.startGame();
        } else {
            console.error("startGame missing");
        }

    });

});
