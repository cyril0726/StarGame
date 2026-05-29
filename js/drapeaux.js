// Variables globales
let data;
let currentContinent;
let currentQuestions;
let currentQuestion;
let currentStep = "pays"; // "pays" ou "capitale"

// Charger les données
async function loadData() {
    try {
        const response = await fetch('../data/drapeaux.json');
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        data = await response.json();
    } catch (error) {
        console.error("Erreur de chargement des données:", error);
    }
}

// Sélectionner un continent
function selectContinent(continent) {
    currentContinent = continent;
    currentQuestions = data.continents[continent];
    if (currentQuestions && currentQuestions.length > 0) {
        document.getElementById('map-container').style.display = 'none';
        document.getElementById('quiz-container').style.display = 'block';
        currentStep = "pays";
        startQuiz();
    } else {
        console.error("Aucune question trouvée pour ce continent:", continent);
    }
}

let selectedContinents = []; // nouveaux continents sélectionnés
function toggleContinent(continent, buttonElement) {
    const index = selectedContinents.indexOf(continent);

    if (index === -1) {
        selectedContinents.push(continent); // ajouter
        buttonElement.classList.add('selected');
    } else {
        selectedContinents.splice(index, 1); // retirer
        buttonElement.classList.remove('selected');
    }

    // Activer ou désactiver le bouton "Démarrer"
    document.getElementById('start-quiz-btn').disabled = selectedContinents.length === 0;
}

function startQuizFromSelection() {
    currentQuestions = selectedContinents.flatMap(
        continent => data.continents[continent] || []
    );
    if (currentQuestions.length === 0) {
        console.error("Aucune question disponible");
        return;
    }
    // cacher la map
    document.getElementById('map-container').style.display = 'none';
    // cacher le bouton
    document.getElementById('start-quiz-btn').style.display = 'none';
    // afficher le quiz
    document.getElementById('quiz-container').style.display = 'block';
    currentStep = "pays";
    startQuiz();
}

// Démarrer le quiz
function startQuiz() {
    const randomIndex = Math.floor(Math.random() * currentQuestions.length);
    currentQuestion = currentQuestions[randomIndex];

    document.getElementById('flag').src = currentQuestion.drapeau;

    if (currentStep === "pays") {
        displayCountryQuestion();
    } else {
        displayCapitalQuestion();
    }
}

// Générer des options pour une question
function generateOptions(correctAnswer, getOptionFn) {
    const options = [correctAnswer];
    while (options.length < 4) {
        const randomOption = getOptionFn();
        if (!options.includes(randomOption)) {
            options.push(randomOption);
        }
    }
    return shuffleArray(options);
}

// Afficher la question pour le pays
function displayCountryQuestion() {
    const questionContainer = document.getElementById('question-container');
    questionContainer.textContent = "Quel est ce pays ?";

    const options = generateOptions(
        currentQuestion.pays,
        () => currentQuestions[Math.floor(Math.random() * currentQuestions.length)].pays
    );

    renderOptions(options, (option) => checkAnswer(option, currentQuestion.pays));
}

// Afficher la question pour la capitale
function displayCapitalQuestion() {
    const questionContainer = document.getElementById('question-container');
    questionContainer.textContent = `Quelle est la capitale de ${currentQuestion.pays} ?`;

    const options = generateOptions(
        currentQuestion.capitale,
        () => currentQuestions[Math.floor(Math.random() * currentQuestions.length)].capitale
    );

    renderOptions(options, (option) => checkAnswer(option, currentQuestion.capitale));
}

// Rendre les options dans le DOM
function renderOptions(options, onClickHandler) {
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.onclick = () => onClickHandler(option);
        optionsContainer.appendChild(button);
    });
}

// Vérifier la réponse (fonction unifiée)
function checkAnswer(selectedOption, correctAnswer) {
    const feedback = document.getElementById('feedback');
    const isCorrect = selectedOption === correctAnswer;

    feedback.textContent = isCorrect
        ? "Correct !"
        : `Faux ! La bonne réponse est ${correctAnswer}.`;
    feedback.style.color = isCorrect ? "#4CAF50" : "#F44336";

    setTimeout(() => {
        feedback.textContent = "";
        currentStep = currentStep === "pays" ? "capitale" : "pays";
        startQuiz();
    }, 2000);
}

// Mélanger un tableau
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Charger les données au démarrage
loadData();