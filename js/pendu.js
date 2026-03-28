// Variables du jeu
let motATrouver = "";
let lettresTrouvees = [];
let erreurs = 0;
let mots = [
    "POMME", "BANANE", "ORANGE", "FRAISE", "RAISIN", "CITRON", "MANGUE", "KIWI", "PECHE", "ABRICOT",
    "VOITURE", "MAISON", "ORDINATEUR", "TELEPHONE", "CHAT", "CHIEN", "OISEAU", "ARBRE", "FLEUR", "SOLEIL",
    "LUNETTES", "LIVRE", "STYLO", "CAHIER", "TABLE", "CHAISE", "FENETRE", "PORTE", "MUR", "PLANCHER",
    "JARDIN", "PARC", "RUE", "VILLE", "PAYS", "MONTAGNE", "RIVIERE", "MER", "OCAN", "ILE",
    "AVION", "TRAIN", "BATEAU", "VELO", "MOTO", "BUS", "CAMION", "TRAMWAY", "METRO", "TAXI"
];

// Tableau des étapes du pendu (en Unicode art)
const hangmanStages = [
`
  +---+
  |   |
      |
      |
      |
      |
=========
`,
`
  +---+
  |   |
  O   |
      |
      |
      |
=========
`,
`
  +---+
  |   |
  O   |
  |   |
      |
      |
=========
`,
`
  +---+
  |   |
  O   |
 /|   |
      |
      |
=========
`,
`
  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========
`,
`
  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========
`,
`
  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========
`
];

// Initialise le jeu
function initialiserJeu() {
    motATrouver = mots[Math.floor(Math.random() * mots.length)];
    lettresTrouvees = [];
    erreurs = 0;
    document.getElementById("erreurs").textContent = "Erreurs : 0/6";
    afficherMot();
    afficherPendu();
}

// Affiche le mot avec les lettres trouvées
function afficherMot() {
    let motAffiche = "";
    for (let lettre of motATrouver) {
        if (lettresTrouvees.includes(lettre)) {
            motAffiche += lettre + " ";
        } else {
            motAffiche += "_ ";
        }
    }
    document.getElementById("mot").textContent = motAffiche.trim();
}

// Affiche le dessin du pendu
function afficherPendu() {
    document.getElementById("hangman-art").textContent = hangmanStages[erreurs];
}

// Devine une lettre
function devinerLettre() {
    const lettreInput = document.getElementById("lettre");
    const lettre = lettreInput.value.toUpperCase();
    lettreInput.value = "";

    if (!lettre || lettre.length !== 1 || !/^[A-Z]$/.test(lettre)) {
        alert("Saisis une lettre valide !");
        lettreInput.focus();
        return;
    }

    if (lettresTrouvees.includes(lettre)) {
        alert("Tu as déjà deviné cette lettre !");
        lettreInput.focus();
        return;
    }

    lettresTrouvees.push(lettre);

    if (!motATrouver.includes(lettre)) {
        erreurs++;
        document.getElementById("erreurs").textContent = `Erreurs : ${erreurs}/6`;
        afficherPendu();

        if (erreurs >= 6) {
            setTimeout(() => {
                alert(`Perdu ! Le mot était : ${motATrouver}`);
                initialiserJeu();
            }, 100);
        }
    }

    afficherMot();

    if ([...motATrouver].every(l => lettresTrouvees.includes(l))) {
        setTimeout(() => {
            alert("Gagné !");
            initialiserJeu();
        }, 100);
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    initialiserJeu();
    document.getElementById("lettre").focus();
});