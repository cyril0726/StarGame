// =========================
// STATE
// =========================
let data = null;
let currentQuestions = [];
let currentQuestion = null;
let currentStep = "pays"; // "pays" -> "capitale"
let selectedContinents = [];
let score = 0;
let streak = 0;
let bestStreak = 0;
let startTime;
let timerInterval;
let totalAnswers = 0;
let roundsPlayed = 0;
const MAX_ROUNDS = 20;
let selectedDifficulty = "facile";
const difficultyLevels = {
    facile: ["facile"],
    moyen: ["facile", "moyen"],
    difficile: ["facile", "moyen", "difficile"]
};

// =========================
// LOAD DATA
// =========================
async function loadData() {
    try {
        const res = await fetch('../data/drapeaux.json');
        if (!res.ok) throw new Error(res.status);
        data = await res.json();
    } catch (e) {
        console.error("Erreur chargement data:", e);
    }
}

// =========================
// CONTINENT SELECTION
// =========================
function toggleContinent(continent, btn) {
    const i = selectedContinents.indexOf(continent);

    if (i === -1) {
        selectedContinents.push(continent);
        btn.classList.add("selected");
    } else {
        selectedContinents.splice(i, 1);
        btn.classList.remove("selected");
    }

    const startBtn = document.getElementById("start-quiz-btn");
    const difficultyBtns = document.querySelectorAll(".difficulty-btn");

    const hasSelection = selectedContinents.length > 0;

    // activer/désactiver le bouton "Lancer le quiz"
    startBtn.disabled = !hasSelection;

    // activer/désactiver les boutons de difficulté
    difficultyBtns.forEach(b => {
        b.disabled = !hasSelection;
        b.style.opacity = hasSelection ? 1 : 0.35; // optionnel: griser visuellement
        b.style.cursor = hasSelection ? "pointer" : "not-allowed";
    });
}

// =========================
// DIFFICULTY SELECTION
// =========================
function selectDifficulty(level, btn) {

    selectedDifficulty = level;

    document
        .querySelectorAll(".difficulty-btn")
        .forEach(b => b.classList.remove("selected"));

    btn.classList.add("selected");
}

function startQuizFromSelection() {
    if (!selectedDifficulty) {
        alert("Veuillez sélectionner un niveau de difficulté.");
        return;
    }

    // Récupérer tous les pays des continents sélectionnés
    let countries = selectedContinents.flatMap(
        c => data.continents[c] || []
    );

    // Filtrage par difficulté
	const allowed =
		difficultyLevels[selectedDifficulty] || ["facile"];

	countries = countries.filter(c =>
		allowed.includes(c.difficulte)
	);

    if (countries.length === 0) {
        alert("Aucun pays disponible pour cette difficulté et ces continents.");
        return;
    }

    // Initialiser le quiz avec les questions filtrées
    currentQuestions = countries;

    // Masquer la carte et afficher le quiz
    document.getElementById("map-container").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";
    document.getElementById("progress-bar").style.display = "block";
    document.getElementById("quiz-info").style.display = "flex";

    // Démarrer le quiz
    startQuiz();
}

// =========================
// QUIZ CORE
// =========================
function startQuiz() {
    currentStep = "pays";
    pickRandomQuestion();
    renderQuestion();
    // Initialiser score et chrono
    score = 0;
    streak = 0;
    bestStreak = 0;
    updateScoreDisplay();
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
	updateProgress();
}

function pickRandomQuestion() {
    currentQuestion =
        currentQuestions[Math.floor(Math.random() * currentQuestions.length)];
}

function updateScoreDisplay() {

    document.getElementById("score").textContent = score;
    document.getElementById("streak").textContent = streak;

    const accuracy =
        totalAnswers === 0
            ? 0
            : Math.round((score / totalAnswers) * 100);

    document.getElementById("accuracy").textContent =
        accuracy + "%";
}

function updateTimer() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const seconds = String(elapsed % 60).padStart(2, '0');
    document.getElementById("timer").textContent = `${minutes}:${seconds}`;
}	

function updateProgress() {
	    const percent =
        (roundsPlayed / MAX_ROUNDS) * 100;

    document.getElementById("progress-fill").style.width =
        `${percent}%`;
    document.getElementById("progress").textContent =
        `${roundsPlayed + 1}/${MAX_ROUNDS}`;
}

// =========================
// RENDER QUESTION
// =========================
function renderQuestion() {
    const flag = document.getElementById("flag");
    const question = document.getElementById("question-container");

    flag.src = currentQuestion.drapeau;

    if (currentStep === "pays") {
        question.textContent = "Quel est ce pays ?";
        renderOptions(
            currentQuestion.pays,
            "pays"
        );
    } else {
        question.textContent =
            `Quelle est la capitale de ${currentQuestion.pays} ?`;

        renderOptions(
            currentQuestion.capitale,
            "capitale"
        );
    }
}

// =========================
// OPTIONS
// =========================
function generateOptions(correct, key) {
    const options = [correct];

    while (options.length < 4) {
        const rand =
            currentQuestions[
                Math.floor(Math.random() * currentQuestions.length)
            ][key];

        if (!options.includes(rand)) options.push(rand);
    }

    return shuffleArray(options);
}

function renderOptions(correct, key) {
    const container = document.getElementById("options-container");
    container.innerHTML = "";

    const options = generateOptions(correct, key);

    options.forEach(opt => {
        const btn = document.createElement("button");
        btn.textContent = opt;

        btn.onclick = () => handleAnswer(opt === correct, btn);

        container.appendChild(btn);
    });
}

// =========================
// ANSWER HANDLING
// =========================
function handleAnswer(isCorrect, btn) {
    const buttons = document.querySelectorAll("#options-container button");
    const flag = document.getElementById("flag");

    buttons.forEach(b => b.classList.add("option-locked"));

    const correctValue = currentStep === "pays" ? currentQuestion.pays : currentQuestion.capitale;

    buttons.forEach(b => {
        if (b.textContent === correctValue) {
            b.classList.add("option-correct");
        }
    });

    if (isCorrect) {
        score++;
        streak++;
        if (streak > bestStreak) bestStreak = streak;
        flag.classList.add("correct-anim");
    } else {
        streak = 0;
        btn.classList.add("option-wrong");
        flag.classList.add("wrong-anim");
    }

totalAnswers++;

    updateScoreDisplay();

    setTimeout(next, 700);
}

// =========================
// FLOW CONTROL
// =========================
function next() {
    const flag = document.getElementById("flag");

    flag.classList.remove("correct-anim");
    flag.classList.remove("wrong-anim");

	if (currentStep === "pays") {

		currentStep = "capitale";

	} else {

		roundsPlayed++;
		updateProgress();

		if (roundsPlayed >= MAX_ROUNDS) {
			endQuiz();
			return;
		}

		currentStep = "pays";
		pickRandomQuestion();
	}

    renderQuestion();
}

function endQuiz() {
    clearInterval(timerInterval);

    const elapsed =
        Math.floor((Date.now() - startTime) / 1000);
    const minutes =
        String(Math.floor(elapsed / 60)).padStart(2, "0");
    const seconds =
        String(elapsed % 60).padStart(2, "0");
    const accuracy =
        totalAnswers === 0
            ? 0
            : Math.round(
                (score / totalAnswers) * 100
            );
			
	let rank;

	if (accuracy >= 95) {
		rank = "🌍 Maître des drapeaux";
	} else if (accuracy >= 80) {
		rank = "🧭 Explorateur expert";
	} else if (accuracy >= 60) {
		rank = "✈️ Voyageur confirmé";
	} else {
		rank = "🚀 Apprenti géographe";
	}

    document.getElementById("final-score").textContent =`${score}/${totalAnswers}`;
    document.getElementById("final-streak").textContent =bestStreak;
    document.getElementById("final-accuracy").textContent =accuracy + "%";
    document.getElementById("final-time").textContent =`${minutes}:${seconds}`;
    document.getElementById("quiz-container").style.display ="none";
    document.getElementById("quiz-info").style.display ="none";
    document.getElementById("end-screen").style.display ="block";
	document.getElementById("final-rank").textContent =rank;
	document.getElementById("progress-bar").style.display = "none";
}

function backToContinentSelection() {

    clearInterval(timerInterval);

    // Masquer les écrans du quiz
    document.getElementById("end-screen").style.display = "none";
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("quiz-info").style.display = "none";

    const progressBar = document.getElementById("progress-bar");
    if (progressBar) {
        progressBar.style.display = "none";
    }

    // Réafficher la carte
    document.getElementById("map-container").style.display = "flex";

    // Réinitialiser les stats
    score = 0;
    streak = 0;
    bestStreak = 0;
    totalAnswers = 0;
    roundsPlayed = 0;

    // Vider les continents sélectionnés
    selectedContinents = [];

    // Retirer les classes visuelles
    document
        .querySelectorAll(".continent.selected")
        .forEach(btn => btn.classList.remove("selected"));

    // Désactiver le bouton de lancement
    document.getElementById("start-quiz-btn").disabled = true;
	
	selectedDifficulty = "facile";

	document
		.querySelectorAll(".difficulty-btn")
		.forEach(btn => btn.classList.remove("selected"));

	document
		.querySelector(".difficulty-btn")
		.classList.add("selected");
}

// =========================
// UTILS
// =========================
function shuffleArray(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

// =========================
// INIT
// =========================
loadData();

document.getElementById("restart-btn")
    .addEventListener("click", restartQuiz);
document.getElementById("change-continents-btn")
    .addEventListener("click", backToContinentSelection);
	
function restartQuiz() {

    score = 0;
    streak = 0;
    bestStreak = 0;
    totalAnswers = 0;
    roundsPlayed = 0;
    clearInterval(timerInterval);
	
    document.getElementById("end-screen").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";
    document.getElementById("quiz-info").style.display = "flex";

    updateScoreDisplay();
	updateProgress();
    startQuiz();
}

// -------------------------
// Désactiver les boutons de difficulté au chargement
// -------------------------
window.addEventListener("DOMContentLoaded", () => {
    const difficultyBtns = document.querySelectorAll(".difficulty-btn");
    difficultyBtns.forEach(b => {
        b.disabled = true;
        b.style.opacity = 0.35;
        b.style.cursor = "not-allowed";
    });
});