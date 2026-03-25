// Liste de mots pour le jeu
const mots = ["javascript", "portail", "mini-jeu", "maquette"];
let motATrouver = mots[Math.floor(Math.random() * mots.length)];
let lettresTrouvees = [];
let erreurs = 0;

// Affiche le mot avec les lettres trouvées
function afficherMot() {
    let motAffiche = "";
    for (let lettre of motATrouver) {
        motAffiche += lettresTrouvees.includes(lettre) ? lettre : "_ ";
    }
    document.getElementById("mot").textContent = motAffiche.trim();
}

// Gère la saisie d'une lettre
function devinerLettre() {
    const lettre = document.getElementById("lettre").value.toLowerCase();
    document.getElementById("lettre").value = "";

    if (lettre.length !== 1 || !lettre.match(/[a-z]/)) {
        alert("Veuillez entrer une lettre valide.");
        return;
    }

    if (motATrouver.includes(lettre) && !lettresTrouvees.includes(lettre)) {
        lettresTrouvees.push(lettre);
    } else {
        erreurs++;
        document.getElementById("erreurs").textContent = `Erreurs : ${erreurs}/6`;
    }

    afficherMot();
    verifierFin();
}

// Vérifie si la partie est terminée
function verifierFin() {
    if (erreurs >= 6) {
        alert(`Perdu ! Le mot était : ${motATrouver}`);
        reinitialiser();
    } else if ([...motATrouver].every(l => lettresTrouvees.includes(l))) {
        alert("Gagné !");
        reinitialiser();
    }
}

// Réinitialise le jeu
function reinitialiser() {
    motATrouver = mots[Math.floor(Math.random() * mots.length)];
    lettresTrouvees = [];
    erreurs = 0;
    document.getElementById("erreurs").textContent = "Erreurs : 0/6";
    afficherMot();
}

// Initialisation
afficherMot();