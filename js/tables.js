// Variables du jeu
let tablesSelectionnees = [];
let score = 0;
let erreurs = 0; // Variable pour suivre le nombre d'erreurs
const maxErreurs = 5; // Nombre maximum d'erreurs autorisées

// Génère une question aléatoire
function genererQuestion() {
    if (tablesSelectionnees.length === 0) {
        document.getElementById('question').textContent = "Sélectionne des tables !";
        return;
    }

    const table = tablesSelectionnees[Math.floor(Math.random() * tablesSelectionnees.length)];
    const multiplicateur = Math.floor(Math.random() * 10) + 1; // Entre 1 et 10
    const question = `${table} × ${multiplicateur}`;
    document.getElementById('question').textContent = question;
    document.getElementById('answer').value = '';
    document.getElementById('answer').focus();
    document.getElementById('feedback-message').textContent = ''; // Réinitialise le message de feedback
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

// Réinitialise le jeu
function reinitialiserJeu() {
    score = 0;
    erreurs = 0; // Réinitialise le compteur d'erreurs
    document.getElementById('score').textContent = score;
    document.getElementById('errors').textContent = erreurs;
    document.getElementById('selection-tables').style.display = 'block';
    document.getElementById('game-section').style.display = 'none';
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
        document.getElementById('selection-tables').style.display = 'none';
        document.getElementById('game-section').style.display = 'block';
        genererQuestion();
    });

    // Désactive le bouton "Commencer" au départ
    const boutonCommencer = document.getElementById('start-game');
    boutonCommencer.disabled = true;
    boutonCommencer.style.opacity = 0.5;
    boutonCommencer.style.cursor = 'not-allowed';

    // Validation de la réponse (bouton ou touche Entrée)
    document.getElementById('validate-answer').addEventListener('click', verifierReponse);
    document.getElementById('answer').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') verifierReponse();
    });
});