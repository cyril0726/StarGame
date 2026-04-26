let data;
let currentContinent;
let currentQuestions;
let currentQuestion;
let currentStep = "pays"; // "pays" ou "capitale"

// Charger les données
fetch('../data/drapeaux.json')
    .then(response => response.json())
    .then(jsonData => {
        data = jsonData;
        console.log("Données chargées :", data);
    })
    .catch(error => {
        console.error("Erreur lors du chargement des données :", error);
    });

// Sélectionner un continent
function selectContinent(continent) {
    console.log("Continent sélectionné :", continent);
    currentContinent = continent;
    currentQuestions = data.continents[continent];
    if (currentQuestions && currentQuestions.length > 0) {
        document.getElementById('map-container').style.display = 'none';
        document.getElementById('quiz-container').style.display = 'block';
        currentStep = "pays";
        startQuiz();
    } else {
        console.error("Aucune question trouvée pour ce continent :", continent);
    }
}

// Démarrer le quiz
function startQuiz() {
    console.log("Début du quiz pour le continent :", currentContinent);

    // Sélectionner une nouvelle question uniquement si on commence une nouvelle série (pays)
    if (currentStep === "pays") {
        const randomIndex = Math.floor(Math.random() * currentQuestions.length);
        currentQuestion = currentQuestions[randomIndex];
        console.log("Question sélectionnée :", currentQuestion);
    }

    // Vérifier que currentQuestion est bien défini
    if (!currentQuestion) {
        console.error("currentQuestion n'est pas défini !");
        return;
    }

    document.getElementById('flag').src = currentQuestion.drapeau;

    if (currentStep === "pays") {
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';
        const questionContainer = document.getElementById('question-container');
        questionContainer.innerHTML = '';

        const options = [currentQuestion.pays];
        while (options.length < 4) {
            const randomOption = currentQuestions[Math.floor(Math.random() * currentQuestions.length)].pays;
            if (!options.includes(randomOption)) {
                options.push(randomOption);
            }
        }
        options.sort(() => Math.random() - 0.5);
        console.log("Options :", options);

        options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.onclick = () => checkAnswer(option, currentQuestion.pays);
            optionsContainer.appendChild(button);
        });
    }
    else if (currentStep === "capitale") {
        const questionContainer = document.getElementById('question-container');
        questionContainer.innerHTML = `<p>Quelle est la capitale de ${currentQuestion.pays} ?</p>`;

        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';

        const options = [currentQuestion.capitale];
        while (options.length < 4) {
            const randomOption = currentQuestions[Math.floor(Math.random() * currentQuestions.length)].capitale;
            if (!options.includes(randomOption)) {
                options.push(randomOption);
            }
        }
        options.sort(() => Math.random() - 0.5);
        console.log("Options de capitales :", options);

        options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.onclick = () => checkCapitalAnswer(option, currentQuestion.capitale);
            optionsContainer.appendChild(button);
        });
    }
}

// Vérifier la réponse pour le pays
function checkAnswer(selectedOption, correctAnswer) {
    const feedback = document.getElementById('feedback');
    if (selectedOption === correctAnswer) {
        feedback.textContent = "Correct !";
        feedback.style.color = "#4CAF50";
    } else {
        feedback.textContent = `Faux ! La bonne réponse est ${correctAnswer}.`;
        feedback.style.color = "#F44336";
    }
    setTimeout(() => {
        feedback.textContent = "";
        currentStep = "capitale";
        startQuiz();
    }, 2000);
}

// Vérifier la réponse pour la capitale
function checkCapitalAnswer(selectedOption, correctAnswer) {
    const feedback = document.getElementById('feedback');
    if (selectedOption === correctAnswer) {
        feedback.textContent = "Correct !";
        feedback.style.color = "#4CAF50";
    } else {
        feedback.textContent = `Faux ! La bonne réponse est ${correctAnswer}.`;
        feedback.style.color = "#F44336";
    }
    setTimeout(() => {
        feedback.textContent = "";
        currentStep = "pays";
        startQuiz();
    }, 2000);
}