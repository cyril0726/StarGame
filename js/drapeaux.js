// =========================
// STATE
// =========================
let data = null;

let currentQuestions = [];
let currentQuestion = null;

let currentStep = "pays"; // "pays" -> "capitale"

let selectedContinents = [];

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

    if (!currentQuestions.length) {
        console.error("Aucune question dispo");
        return;
    }

    document.getElementById("map-container").style.display = "none";
    document.getElementById("start-quiz-btn").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";

    startQuiz();
}

// =========================
// QUIZ CORE
// =========================
function startQuiz() {
    currentStep = "pays";
    pickRandomQuestion();
    renderQuestion();
}

function pickRandomQuestion() {
    currentQuestion =
        currentQuestions[Math.floor(Math.random() * currentQuestions.length)];
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

    // lock UI
    buttons.forEach(b => b.classList.add("option-locked"));

    const correctValue =
        currentStep === "pays"
            ? currentQuestion.pays
            : currentQuestion.capitale;

    buttons.forEach(b => {
        if (b.textContent === correctValue) {
            b.classList.add("option-correct");
        }
    });

    if (!isCorrect) {
        btn.classList.add("option-wrong");
        flag.classList.add("wrong-anim");
    } else {
        flag.classList.add("correct-anim");
    }

    setTimeout(() => {
        next();
    }, 700);
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
		currentStep = "pays";
		pickRandomQuestion();
	}

	renderQuestion();
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