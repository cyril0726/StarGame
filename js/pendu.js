const JeuPendu = {
  motATrouver: "",
  lettresTrouvees: [],
  erreurs: 0,
  maxErreurs: 6,
  mots: [
    "MAISON", "VOITURE", "ORDINATEUR", "TELEPHONE", "CHAT", "CHIEN", "OISEAU", "ARBRE", "FLEUR", "SOLEIL",
    "LUNETTES", "LIVRE", "STYLO", "CAHIER", "TABLE", "CHAISE", "FENETRE", "PORTE", "MUR", "PLANCHER",
    "JARDIN", "PARC", "RUE", "VILLE", "PAYS", "MONTAGNE", "RIVIERE", "MER", "OCEAN", "ILE",
    "AVION", "TRAIN", "BATEAU", "VELO", "MOTO", "BUS", "CAMION", "TRAMWAY"
  ],

  hangmanStages: [
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
  ],

  initialiserJeu: function() {
    this.motATrouver = this.choisirMotAleatoire();
    this.lettresTrouvees = [];
    this.erreurs = 0;
    this.afficherMotCache();
    this.afficherPendu();
  },

  choisirMotAleatoire: function() {
    const index = Math.floor(Math.random() * this.mots.length);
    return this.mots[index];
  },

  afficherMotCache: function() {
    let motCache = "";
    for (const lettre of this.motATrouver) {
      motCache += this.lettresTrouvees.includes(lettre) ? lettre + " " : "_ ";
    }
    document.getElementById("mot").textContent = motCache.trim();
  },

  afficherPendu: function() {
	document.getElementById("erreurs").textContent = `Erreurs : ${this.erreurs}/6`;
    document.getElementById("hangman-art").textContent = this.hangmanStages[this.erreurs];
  },

  verifierLettre: function(lettre) {
    if (!lettre || lettre.length !== 1 || !/[A-Z]/.test(lettre.toUpperCase())) {
      alert("Veuillez entrer une lettre valide.");
      return;
    }

    lettre = lettre.toUpperCase();

    if (this.lettresTrouvees.includes(lettre)) {
      alert("Vous avez déjà deviné cette lettre.");
      return;
    }

    this.lettresTrouvees.push(lettre);

    if (!this.motATrouver.includes(lettre)) {
      this.erreurs++;
      document.getElementById("erreurs").textContent = `Erreurs : ${this.erreurs}/6`;
      this.afficherPendu();
    }

    this.afficherMotCache();

    if (this.erreurs >= this.maxErreurs) {
      alert(`Perdu ! Le mot était : ${this.motATrouver}`);
      this.initialiserJeu();
    } else if ([...this.motATrouver].every(l => this.lettresTrouvees.includes(l))) {
      alert("Félicitations, vous avez gagné !");
      this.initialiserJeu();
    }
	// Vider la case de saisie
    document.getElementById('lettre').value = '';
  }
};

// Initialisation du jeu au chargement de la page
window.onload = function() {
  JeuPendu.initialiserJeu();
};