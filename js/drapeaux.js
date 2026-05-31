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

    document.getElementById("start-quiz-btn").disabled =
        selectedContinents.length === 0;
}

function startQuizFromSelection() {

    currentQuestions = selectedContinents.flatMap(
        c => data.continents[c] || []
    );

    document.getElementById("map-container").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";

    document.getElementById("quiz-info").style.display = "flex";

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
	
	if (isCorrect) {
		score++;
		streak++;
	} else {
		streak = 0;
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

    document.getElementById("final-score").textContent =
        `${score}/${totalAnswers}`;

    document.getElementById("final-streak").textContent =
        bestStreak;

    document.getElementById("final-accuracy").textContent =
        accuracy + "%";

    document.getElementById("final-time").textContent =
        `${minutes}:${seconds}`;

    document.getElementById("quiz-container").style.display =
        "none";

    document.getElementById("quiz-info").style.display =
        "none";

    document.getElementById("end-screen").style.display =
        "block";
		
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
	
function restartQuiz() {

    score = 0;
    streak = 0;
    bestStreak = 0;

    totalAnswers = 0;

    roundsPlayed = 0;

    clearInterval(timerInterval);

    document.getElementById("end-screen").style.display =
        "none";

    document.getElementById("quiz-container").style.display =
        "block";

    document.getElementById("quiz-info").style.display =
        "flex";

    updateScoreDisplay();

    startQuiz();
}