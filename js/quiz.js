let questions = [];
let filteredQuestions = [];
let score = 0;
let questionActuelle = 0;
let nombreQuestions = 10;
let selectedCategory = "Toutes";
let selectedDifficulty = "Tous";

// Charger le fichier JSON
fetch('../data/questions.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur HTTP! statut: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        questions = data;
        console.log('Questions chargées :', questions);
        setupEventListeners();
    })
    .catch(error => {
        console.error('Erreur de chargement des questions:', error);
        alert("Erreur de chargement des questions. Vérifie la console pour plus de détails.");
    });

function setupEventListeners() {
    document.getElementById("start-quiz").addEventListener("click", function() {
        const category = document.getElementById("category").value;
        const difficulty = document.getElementById("difficulty").value;

        selectedCategory = category === "all" ? "Toutes" : category;
        selectedDifficulty = difficulty === "all" ? "Tous" : difficulty;

        // Filtrer les questions
        filteredQuestions = questions.filter(question => {
            const categoryMatch = category === "all" || question.categorie === category;
            const difficultyMatch = difficulty === "all" || question.niveau === difficulty;
            return categoryMatch && difficultyMatch;
        });

        // Vérifier si des questions ont été trouvées
        if (filteredQuestions.length === 0) {
            alert("Aucune question ne correspond aux critères sélectionnés. Veuillez choisir d'autres options.");
            return;
        }

        // Mélanger les questions
        filteredQuestions = shuffleArray(filteredQuestions);

        // Limiter le nombre de questions
        nombreQuestions = Math.min(parseInt(document.getElementById("question-count").value), filteredQuestions.length);
        document.getElementById("welcome").style.display = "none";
        document.getElementById("quiz").style.display = "block";
        document.getElementById("total-questions").textContent = nombreQuestions;
        document.getElementById("selected-category").textContent = selectedCategory;
        document.getElementById("selected-difficulty").textContent = selectedDifficulty;
        questionActuelle = 0;
        score = 0;
        document.getElementById("score").textContent = score;
        afficherQuestion();
    });

    document.getElementById("replay").addEventListener("click", function() {
        document.getElementById("end").style.display = "none";
        document.getElementById("welcome").style.display = "block";
    });
}

// Fonction pour mélanger les questions
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

function afficherQuestion() {
    if (questionActuelle < nombreQuestions && questionActuelle < filteredQuestions.length) {
        const q = filteredQuestions[questionActuelle];
        document.getElementById("question").textContent = q.question;
        document.getElementById("current-question").textContent = questionActuelle + 1;
        const reponsesDiv = document.getElementById("answers");
        reponsesDiv.innerHTML = "";
        q.reponses.forEach(reponse => {
            const bouton = document.createElement("button");
            bouton.textContent = reponse;
            bouton.className = "answer-button";
            bouton.onclick = () => verifierReponse(reponse, q.bonneReponse);
            reponsesDiv.appendChild(bouton);
        });
    } else {
        document.getElementById("quiz").style.display = "none";
        document.getElementById("end").style.display = "block";
        document.getElementById("final-score").textContent = `${score}/${nombreQuestions} (${Math.round(score / nombreQuestions * 100)}%)`;
    }
}

function verifierReponse(reponse, bonneReponse) {
    const boutons = document.querySelectorAll('.answer-button');
    boutons.forEach(bouton => {
        if (bouton.textContent === bonneReponse) {
            bouton.style.backgroundColor = "green";
        } else if (bouton.textContent === reponse) {
            bouton.style.backgroundColor = "red";
        }
        bouton.disabled = true;
    });

    if (reponse === bonneReponse) {
        score++;
        document.getElementById("score").textContent = score;
    }

    setTimeout(() => {
        questionActuelle++;
        afficherQuestion();
    }, 1000);
}