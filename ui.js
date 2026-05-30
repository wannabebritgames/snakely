const names = ["Neo", "Byte", "Vex", "Pixel", "Orbit", "Nova"];

function randomName(){
    return names[Math.floor(Math.random()*names.length)] +
    Math.floor(Math.random()*999);
}

document.getElementById("randomName").onclick = ()=>{
    document.getElementById("nameInput").value = randomName();
};

let skins = [
    {name:"Neon", color:"#39ff14", unlock:0},
    {name:"Fire", color:"orange", unlock:10},
    {name:"Ice", color:"cyan", unlock:25}
];

function loadSkins(){
    let sel = document.getElementById("skinSelect");
    sel.innerHTML = "";

    let score = localStorage.best || 0;

    skins.forEach(s=>{
        if(score >= s.unlock){
            let opt = document.createElement("option");
            opt.value = s.color;
            opt.innerText = s.name;
            sel.appendChild(opt);
        }
    });
}

loadSkins();
