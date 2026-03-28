// Variables du jeu
let tablesSelectionnees = [];
let score = 0;

// Génère un code de session (optionnel, si tu veux le réutiliser)
function genererCodeSession() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'STAR-';
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

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
    document.getElementById('feedback-message').textContent = '';
}

// Vérifie la réponse de l'utilisateur
function verifierReponse() {
    const questionText = document.getElementById('question').textContent;
    const [table, multiplicateur] = questionText.split(' × ');
    const reponseCorrecte = parseInt(table) * parseInt(multiplicateur);
    const reponseUtilisateur = parseInt(document.getElementById('answer').value);

    if (isNaN(reponseUtilisateur)) {
        document.getElementById('feedback-message').textContent = "Saisis un nombre !";
        return;
    }

    if (reponseUtilisateur === reponseCorrecte) {
        document.getElementById('feedback-message').textContent = "Bonne réponse !";
        document.getElementById('feedback-message').style.color = "#2ecc71";
        score++;
        document.getElementById('score').textContent = score;
    } else {
        document.getElementById('feedback-message').textContent = `Mauvaise réponse. La bonne réponse était ${reponseCorrecte}.`;
        document.getElementById('feedback-message').style.color = "#e74c3c";
    }

    setTimeout(genererQuestion, 1500);
}

// Met à jour l'état du bouton "Commencer"
function mettreAJourBoutonCommencer() {
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
            mettreAJourBoutonCommencer();
        });
    });

    // Bouton pour commencer le jeu
    document.getElementById('start-game').addEventListener('click', () => {
        document.getElementById('selection-tables').style.display = 'none';
        document.getElementById('game-section').style.display = 'block';
        genererQuestion();
    });

    // Désactive le bouton "Commencer" au départ
    mettreAJourBoutonCommencer();

    // Validation de la réponse (bouton ou touche Entrée)
    document.getElementById('validate-answer').addEventListener('click', verifierReponse);
    document.getElementById('answer').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') verifierReponse();
    });
});