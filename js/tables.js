// Objet pour gérer le jeu des tables de multiplication
const JeuTables = {
    // Variables du jeu
    tablesSelectionnees: [],
    score: 0,
    erreurs: 0,
    maxErreurs: 5,
    chronoActive: false,
    timeLeft: 60,
    allTables: [1, 2, 3, 4, 5, 6, 7, 8, 9],

    // Sélectionne une table
    selectionnerTable: function(table) {
        const button = document.querySelector(`.table-button[data-table="${table}"]`);
        if (this.tablesSelectionnees.includes(table)) {
            this.tablesSelectionnees = this.tablesSelectionnees.filter(t => t !== table);
            button.classList.remove('selected');
        } else {
            this.tablesSelectionnees.push(table);
            button.classList.add('selected');
        }
        document.getElementById("start-game").disabled = this.tablesSelectionnees.length === 0;
    },

    // Commence le jeu
    commencerJeu: function() {
        document.getElementById("selection-tables").style.display = "none";
        document.getElementById("game-section").style.display = "flex";
        this.initialiserJeu();
    },

    // Initialise le jeu
    initialiserJeu: function() {
        this.score = 0;
        this.erreurs = 0;
        this.afficherScore();
        this.genererQuestion();
    },

    // Génère une question aléatoire
    genererQuestion: function() {
        const tables = this.chronoActive ? this.allTables : this.tablesSelectionnees;
        if (tables.length === 0 && !this.chronoActive) {
            alert("Veuillez sélectionner au moins une table.");
            return;
        }
        const table = tables[Math.floor(Math.random() * tables.length)];
        const multiplicateur = Math.floor(Math.random() * 10) + 1;
        const question = `${table} × ${multiplicateur}`;
        const reponse = table * multiplicateur;

        document.getElementById("question").textContent = question;
        document.getElementById("answer").value = "";
        document.getElementById("answer").focus();
        document.getElementById("answer").dataset.correctAnswer = reponse;
    },

    // Vérifie la réponse de l'utilisateur
    verifierReponse: function() {
        const reponseUtilisateur = parseInt(document.getElementById("answer").value);
        const reponseCorrecte = parseInt(document.getElementById("answer").dataset.correctAnswer);

        if (reponseUtilisateur === reponseCorrecte) {
            this.score++;
            this.afficherScore();
            this.genererQuestion();
        } else {
            this.erreurs++;
            this.afficherErreurs();
            if (this.erreurs >= this.maxErreurs) {
                alert("Désolé, tu as atteint le nombre maximum d'erreurs !");
                this.recommencerJeu();
            } else {
                this.genererQuestion();
            }
        }
    },

    // Recommence le jeu
    recommencerJeu: function() {
        document.getElementById("game-section").style.display = "none";
        document.getElementById("selection-tables").style.display = "block";
        this.tablesSelectionnees = [];
        document.getElementById("start-game").disabled = true;
    },

    // Affiche le score
    afficherScore: function() {
        document.getElementById("score").textContent = this.score;
    },

    // Affiche le nombre d'erreurs
    afficherErreurs: function() {
        document.getElementById("errors").textContent = this.erreurs;
    },

    // Active ou désactive le mode chrono
    basculerModeChrono: function() {
        this.chronoActive = !this.chronoActive;
        if (this.chronoActive) {
            this.commencerJeu();
            document.getElementById("time-display").style.display = "block";
            this.lancerChrono();
        } else {
            clearInterval(this.chronoInterval);
            document.getElementById("time-display").style.display = "none";
        }
    },

    // Lance le chrono
    lancerChrono: function() {
        clearInterval(this.chronoInterval);
        this.timeLeft = 60;
        this.afficherTemps();
        this.chronoInterval = setInterval(() => {
            this.timeLeft--;
            this.afficherTemps();
            if (this.timeLeft <= 0) {
                clearInterval(this.chronoInterval);
                alert(`Temps écoulé ! Ton score est de ${this.score}.`);
                this.recommencerJeu();
            }
        }, 1000);
    },

    // Affiche le temps restant
    afficherTemps: function() {
        document.getElementById("time-left").textContent = this.timeLeft;
    }
};

// Initialisation du jeu au chargement de la page
window.onload = function() {
    document.getElementById("start-game").disabled = true;
    document.getElementById("game-section").style.display = "none";
    document.getElementById("time-display").style.display = "none";

    // Écouteur pour la touche Entrée
    document.getElementById("answer").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            JeuTables.verifierReponse();
        }
    });
};