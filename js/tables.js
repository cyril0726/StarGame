const Game = {
    state: "menu",
    mode: "normal",
    tables: [],
    score: 0,
    errors: 0,
    time: 60,
    interval: null,
    current: null,
    // progression
    maxQuestions: 20,
    questionsAsked: 0,
    // streak
    streak: 0,
    bestStreak: 0
};

// Désactiver les boutons au départ, tant qu'aucune table n'est sélectionnée
document.getElementById("mode-chrono").disabled = true;
document.getElementById("mode-zen").disabled = true;

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
		document.getElementById("mode-chrono").disabled =
			Game.tables.length === 0;

		document.getElementById("mode-zen").disabled =
			Game.tables.length === 0;
    });
});


function resetGame(){
    Game.score = 0;
    Game.errors = 0;
    Game.time = 60;

    Game.questionsAsked = 0;
    Game.streak = 0;
    Game.bestStreak = 0;

    clearInterval(Game.interval);
}

document.getElementById("mode-chrono").onclick = ()=> startGame("chrono");
document.getElementById("mode-zen").onclick = ()=> startGame("zen");

function startGame(mode){
    if(Game.tables.length === 0){
        toast("Choisis au moins une table");
        return;
    }

    Game.mode = mode;
    Game.state = "game";
	
	document.getElementById("progress").style.display =
    mode === "chrono" ? "none" : "block";

	const bar = document.getElementById("progress-fill");
	if(bar){
		bar.style.display =
			mode === "chrono" ? "none" : "block";
	}

    resetGame();
    showScreen("game-screen");
    updateTablesChosen();
    nextQuestion();

    if(mode === "chrono"){
        document.getElementById("timer").style.display="block";
        Game.time = 60;
        Game.interval = setInterval(()=>{
            Game.time--;
            document.getElementById("timer").textContent = "⏱ " + Game.time;
            if(Game.time <= 0) endGame();
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

    if(Game.mode === "zen" && Game.questionsAsked >= Game.maxQuestions){
        endGame();
        return;
    }

    Game.questionsAsked++;

    const t = Game.tables[Math.floor(Math.random()*Game.tables.length)];
    const m = Math.floor(Math.random()*10)+1;

    Game.current = {t,m};

    document.getElementById("question").textContent = `${t} × ${m}`;
    document.getElementById("answer").value="";
    document.getElementById("answer").focus();

    updateProgress();
}

function updateProgress(){

    // ❌ pas de progression en chrono
    if(Game.mode === "chrono") return;

    const percent = (Game.questionsAsked / Game.maxQuestions) * 100;

    const progressText = document.getElementById("progress");
    if(progressText){
        progressText.textContent =
            `${Game.questionsAsked}/${Game.maxQuestions}`;
    }

    const bar = document.getElementById("progress-fill");
    if(bar){
        bar.style.width = percent + "%";
    }
}

document.getElementById("validate").onclick = check;
document.getElementById("answer").addEventListener("keypress", e=>{if(e.key==="Enter") check();});

function check(){
    const input = document.getElementById("answer");
    const val = input.value.trim();

    // ❌ saisie vide → on ignore totalement
    if(val === ""){
        toast("Entre une réponse !");
        return;
    }

    const num = Number(val);

    if(Number.isNaN(num)){
        toast("Réponse invalide !");
        return;
    }

    if(num === Game.current.t * Game.current.m){
        Game.score++;
        Game.streak++;

        if(Game.streak > Game.bestStreak){
            Game.bestStreak = Game.streak;
        }
    } else {
        Game.errors++;
        Game.streak = 0;
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
    Game.interval = null;

    const accuracy = Game.mode === "zen"
        ? Math.round((Game.score / Game.questionsAsked) * 100)
        : null; // pas de pourcentage en chrono si tu veux

    let rank;
    if(Game.mode === "zen"){
        if (accuracy >= 95) rank = "🧠 Génie des multiplications";
        else if (accuracy >= 80) rank = "🚀 Calculateur expert";
        else if (accuracy >= 60) rank = "📚 Bon niveau";
        else rank = "🌱 En progression";
    } else {
        rank = "⏱ Mode Challenge terminé";
    }

    document.getElementById("final-score").innerHTML = 
        Game.mode === "zen"
            ? `⭐ Score : ${Game.score} / ${Game.questionsAsked}<br>
               ❌ Erreurs : ${Game.errors}<br>
               🎯 Précision : ${accuracy}%<br>
               🔥 Meilleure série : ${Game.bestStreak}<br><br>
               <strong>${rank}</strong>`
            : `⭐ Score : ${Game.score}<br>
               🔥 Meilleure série : ${Game.bestStreak}<br><br>
               <strong>${rank}</strong>`;

    showScreen("end-screen");
}

document.getElementById("restart").onclick = ()=>{
    location.reload();
};