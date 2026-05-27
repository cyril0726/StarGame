const Game = {
    state: "menu",
    mode: "normal",
    tables: [],
    score: 0,
    errors: 0,
    maxErrors: 5,
    time: 60,
    interval: null,
    current: null
};

// UI helpers
function showScreen(id){
    document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

function toast(msg){
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(()=>t.classList.remove("show"),2000);
}

// MENU logic
document.querySelectorAll(".table-button").forEach(btn=>{
    btn.addEventListener("click",()=>{
        const n = +btn.dataset.table;
        if(Game.tables.includes(n)){
            Game.tables = Game.tables.filter(x=>x!==n);
            btn.classList.remove("selected");
        } else {
            Game.tables.push(n);
            btn.classList.add("selected");
        }
        // Enable start buttons
        document.getElementById("start-normal").disabled = Game.tables.length===0;
        document.getElementById("start-chrono").disabled = Game.tables.length===0;
    });
});

document.getElementById("start-normal").onclick = ()=>startGame("normal");
document.getElementById("start-chrono").onclick = ()=>startGame("chrono");

// GAME logic
function startGame(mode){
    if(Game.tables.length===0){
        toast("Choisis au moins une table");
        return;
    }

    Game.mode = mode;
    Game.state = "game";
    Game.score = 0;
    Game.errors = 0;
    Game.time = 60;

    showScreen("game-screen");
    updateTablesChosen();
    nextQuestion();

    if(mode==="chrono"){
        document.getElementById("timer").style.display="block";
        Game.interval = setInterval(()=>{
            Game.time--;
            document.getElementById("timer").textContent = "⏱ "+Game.time;
            if(Game.time<=0) endGame();
        },1000);
    } else {
        document.getElementById("timer").style.display="none";
    }

    updateHUD();
}

function updateTablesChosen(){
    document.getElementById("tables-chosen").textContent = "Tables sélectionnées : "+Game.tables.join(", ");
}

function nextQuestion(){
    const t = Game.tables[Math.floor(Math.random()*Game.tables.length)];
    const m = Math.floor(Math.random()*10)+1;
    Game.current = {t,m};
    document.getElementById("question").textContent = `${t} × ${m}`;
    document.getElementById("answer").value="";
    document.getElementById("answer").focus();
}

document.getElementById("validate").onclick = check;
document.getElementById("answer").addEventListener("keypress", e=>{if(e.key==="Enter") check();});

function check(){
    const val = +document.getElementById("answer").value;
    if(val === Game.current.t * Game.current.m){
        Game.score++;
    } else {
        Game.errors++;
        if(Game.errors>=Game.maxErrors) return endGame();
    }
    updateHUD();
    nextQuestion();
}

function updateHUD(){
    document.getElementById("score").textContent = "Score : "+Game.score;
    document.getElementById("errors").textContent = "Erreurs : "+Game.errors;
}

// END game
function endGame(){
    clearInterval(Game.interval);
    showScreen("end-screen");
    document.getElementById("final-score").textContent = `Score : ${Game.score} | Erreurs : ${Game.errors}`;
}

document.getElementById("restart").onclick = ()=>{
    location.reload();
};