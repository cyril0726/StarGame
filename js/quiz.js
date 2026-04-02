let questions = [];
let filteredQuestions = [];
let score = 0;
let questionActuelle = 0;
let nombreQuestions = 10;
let selectedCategory = "Toutes";
let usedQuestions = []; // Liste pour stocker les questions déjà posées

// Fonction pour mélanger les éléments d'un tableau
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    // Charger le fichier JSON
    fetch('../data/questions_fr.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP! statut: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            questions = data;
            setupEventListeners();
        })
        .catch(error => {
            console.error('Erreur de chargement des questions:', error);
            alert("Erreur de chargement des questions. Vérifie la console pour plus de détails.");
        });

    function setupEventListeners() {
        const startButton = document.getElementById("start-quiz");
        if (startButton) {
            startButton.addEventListener("click", function() {
                const category = document.getElementById("category").value;

                selectedCategory = category === "all" ? "Toutes" : category;

                // Filtrer les questions
                filteredQuestions = questions.filter(question => {
                    const categoryMatch = category === "all" || question.categorie === category;
                    return categoryMatch;
                });

                // Vérifier si des questions ont été trouvées
                if (filteredQuestions.length === 0) {
                    alert("Aucune question ne correspond aux critères sélectionnés. Veuillez choisir une autre catégorie.");
                    return;
                }

                // Mélanger les questions
                filteredQuestions = shuffleArray(filteredQuestions);

                // Limiter le nombre de questions
                nombreQuestions = Math.min(parseInt(document.getElementById("question-count").value), filteredQuestions.length);

                const welcomeElement = document.getElementById("welcome");
                const quizElement = document.getElementById("quiz");
                const totalQuestionsElement = document.getElementById("total-questions");
                const selectedCategoryElement = document.getElementById("selected-category");

                if (welcomeElement && quizElement && totalQuestionsElement && selectedCategoryElement) {
                    welcomeElement.style.display = "none";
                    quizElement.style.display = "block";
                    totalQuestionsElement.textContent = nombreQuestions;
                    selectedCategoryElement.textContent = selectedCategory;
                    questionActuelle = 0;
                    score = 0;
                    usedQuestions = []; // Réinitialiser la liste des questions déjà posées

                    // Sélectionner les premières 'nombreQuestions' questions mélangées
                    usedQuestions = filteredQuestions.slice(0, nombreQuestions);

                    const scoreElement = document.getElementById("score");
                    if (scoreElement) {
                        scoreElement.textContent = score;
                    }
                    afficherQuestion();
                } else {
                    console.error("Un ou plusieurs éléments HTML requis sont introuvables.");
                }
            });
        }

        const replayButton = document.getElementById("replay");
        if (replayButton) {
            replayButton.addEventListener("click", function() {
                const endElement = document.getElementById("end");
                const welcomeElement = document.getElementById("welcome");
                if (endElement && welcomeElement) {
                    endElement.style.display = "none";
                    welcomeElement.style.display = "block";
                }
            });
        }
    }

    function afficherQuestion() {
        if (questionActuelle < nombreQuestions) {
            const q = usedQuestions[questionActuelle];
            const questionElement = document.getElementById("question");
            const currentQuestionElement = document.getElementById("current-question");
            const answersDiv = document.getElementById("answers");

            if (questionElement && currentQuestionElement && answersDiv) {
                questionElement.textContent = q.question;
                currentQuestionElement.textContent = questionActuelle + 1;

                // Mélanger les réponses
                const shuffledAnswers = shuffleArray([...q.reponses]);

                answersDiv.innerHTML = "";
                shuffledAnswers.forEach(reponse => {
                    const bouton = document.createElement("button");
                    bouton.textContent = reponse;
                    bouton.className = "answer-button";
                    bouton.onclick = () => verifierReponse(reponse, q.bonneReponse);
                    answersDiv.appendChild(bouton);
                });
            } else {
                console.error("Un ou plusieurs éléments HTML requis pour afficher la question sont introuvables.");
            }
        } else {
            const quizElement = document.getElementById("quiz");
            const endElement = document.getElementById("end");
            const finalScoreElement = document.getElementById("final-score");

            if (quizElement && endElement && finalScoreElement) {
                quizElement.style.display = "none";
                endElement.style.display = "block";
                finalScoreElement.textContent = `${score}/${nombreQuestions} (${Math.round(score / nombreQuestions * 100)}%)`;
            } else {
                console.error("Un ou plusieurs éléments HTML requis pour afficher la fin du quiz sont introuvables.");
            }
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
            const scoreElement = document.getElementById("score");
            if (scoreElement) {
                scoreElement.textContent = score;
            }
        }

        setTimeout(() => {
            questionActuelle++;
            afficherQuestion();
        }, 1000);
    }
});