// Variables du jeu
let tablesSelectionnees = [];
let score = 0;
let erreurs = 0;
const maxErreurs = 5;

// Variables pour le mode chrono
let chronoActive = false;
let timeLeft = 60;
let chronoInterval;
let scoreChrono = 0;
let allTables = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // Toutes les tables pour le mode chrono

// Génère une question aléatoire
function genererQuestion() {
    const tables = chronoActive ? allTables : tablesSelectionnees;
    if (tables.length === 0 && !chronoActive) {
        document.getElementById('question').textContent = "Sélectionne des tables !";
        return;
    }

    const table = tables[Math.floor(Math.random() * tables.length)];
    const multiplicateur = Math.floor(Math.random() * 10) + 1;
    const question = `${table} × ${multiplicateur}`;
    document.getElementById('question').textContent = question;
    document.getElementById('answer').value = '';
    document.getElementById('answer').focus();
    document.getElementById('feedback-message').textContent = '';
}

// Vérifie la réponse de l'utilisateur
function verifierReponse() {
    const questionText = document.getElementById('question').textContent;
    const [table, multiplicateur] = questionText.split(' × ');
    const reponseCorrecte = parseInt(table) * parseInt(multiplicateur);
    const reponseUtilisateur = parseInt(document.getElementById('answer').value);
    const feedbackMessage = document.getElementById('feedback-message');

    if (isNaN(reponseUtilisateur)) {
        feedbackMessage.textContent = "Saisis un nombre !";
        feedbackMessage.style.color = "#e74c3c";
        return;
    }

    if (reponseUtilisateur === reponseCorrecte) {
        feedbackMessage.textContent = "Bonne réponse !";
        feedbackMessage.style.color = "#2ecc71";
        score++;
        document.getElementById('score').textContent = score;
    } else {
        feedbackMessage.textContent = `Mauvaise réponse.`;
        feedbackMessage.style.color = "#e74c3c";
        erreurs++;
        document.getElementById('errors').textContent = erreurs;

        if (erreurs >= maxErreurs) {
            setTimeout(() => {
                alert(`Game Over ! Tu as fait ${maxErreurs} erreurs. Ton score final est : ${score}.`);
                reinitialiserJeu();
            }, 100);
            return;
        }
    }

    setTimeout(genererQuestion, 1000);
}

// Fonction pour démarrer le mode chrono
function startChronoMode() {
    chronoActive = true;
    timeLeft = 60;
    scoreChrono = 0;
    document.getElementById("score").textContent = scoreChrono;
    document.getElementById("time-left").textContent = timeLeft;

    document.getElementById("selection-tables").style.display = "none";
    document.getElementById("game-section").style.display = "block";
    document.getElementById("time-display").style.display = "block"; // Afficher le chrono en mode chrono

    document.getElementById("feedback-message").textContent = "";
    chronoInterval = setInterval(updateChrono, 1000);
    genererQuestion();
}

// Fonction pour mettre à jour le chrono
function updateChrono() {
    timeLeft--;
    document.getElementById("time-left").textContent = timeLeft;

    if (timeLeft <= 0) {
        clearInterval(chronoInterval);
        endChronoMode();
    }
}

// Fonction pour terminer le mode chrono
function endChronoMode() {
    chronoActive = false;
    alert(`Temps écoulé ! Votre score est de ${scoreChrono}.`);
    document.getElementById("game-section").style.display = "none";
    document.getElementById("selection-tables").style.display = "block";
    document.getElementById("time-display").style.display = "none";
}

// Réinitialise le jeu
function reinitialiserJeu() {
    score = 0;
    erreurs = 0;
    document.getElementById('score').textContent = score;
    document.getElementById('errors').textContent = erreurs;
    document.getElementById('selection-tables').style.display = 'block';
    document.getElementById('game-section').style.display = 'none';
    document.getElementById('time-display').style.display = 'none';
}

// Initialise le jeu
document.addEventListener('DOMContentLoaded', () => {
    // Gestion des boutons de sélection des tables
    const tableButtons = document.querySelectorAll('.table-button');
    tableButtons.forEach(button => {
        button.addEventListener('click', () => {
            const table = parseInt(button.dataset.table);
            button.classList.toggle('selected');

            // Met à jour la liste des tables sélectionnées
            if (button.classList.contains('selected')) {
                if (!tablesSelectionnees.includes(table)) {
                    tablesSelectionnees.push(table);
                }
            } else {
                tablesSelectionnees = tablesSelectionnees.filter(t => t !== table);
            }

            // Met à jour le bouton "Commencer"
            const boutonCommencer = document.getElementById('start-game');
            if (tablesSelectionnees.length === 0) {
                boutonCommencer.disabled = true;
                boutonCommencer.style.opacity = 0.5;
                boutonCommencer.style.cursor = 'not-allowed';
            } else {
                boutonCommencer.disabled = false;
                boutonCommencer.style.opacity = 1;
                boutonCommencer.style.cursor = 'pointer';
            }
        });
    });

    // Bouton pour commencer le jeu
    document.getElementById('start-game').addEventListener('click', () => {
        chronoActive = false;
        document.getElementById('selection-tables').style.display = 'none';
        document.getElementById('game-section').style.display = 'block';
        document.getElementById('time-display').style.display = 'none'; // Masquer le chrono en mode normal
        genererQuestion();
    });

    // Désactive le bouton "Commencer" au départ
    const boutonCommencer = document.getElementById('start-game');
    boutonCommencer.disabled = true;
    boutonCommencer.style.opacity = 0.5;
    boutonCommencer.style.cursor = 'not-allowed';

    // Bouton pour commencer le mode chrono
    document.getElementById('start-chrono').addEventListener('click', startChronoMode);

    // Validation de la réponse (bouton ou touche Entrée)
    document.getElementById('validate-answer').addEventListener('click', () => {
        if (chronoActive) {
            validateAnswer();
        } else {
            verifierReponse();
        }
    });

    document.getElementById('answer').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            if (chronoActive) {
                validateAnswer();
            } else {
                verifierReponse();
            }
        }
    });
});

// Fonction pour valider la réponse en mode chrono
function validateAnswer() {
    const userAnswer = parseInt(document.getElementById("answer").value);
    const questionText = document.getElementById('question').textContent;
    const [table, multiplicateur] = questionText.split(' × ');
    const correctAnswer = parseInt(table) * parseInt(multiplicateur);

    if (isNaN(userAnswer)) {
        document.getElementById("feedback-message").textContent = "Saisis un nombre !";
        document.getElementById("feedback-message").style.color = "#e74c3c";
        return;
    }

    if (userAnswer === correctAnswer) {
        document.getElementById("feedback-message").textContent = "Bonne réponse !";
        document.getElementById("feedback-message").style.color = "#2ecc71";
        scoreChrono++;
        document.getElementById("score").textContent = scoreChrono;
    } else {
        document.getElementById("feedback-message").textContent = `Mauvaise réponse ! La bonne réponse était ${correctAnswer}.`;
        document.getElementById("feedback-message").style.color = "#e74c3c";
    }

    setTimeout(genererQuestion, 1000);
}