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
	document.getElementById(
  "lettres-utilisees"
).textContent =
this.lettresTrouvees.join(" • ");
  },

afficherPendu: function() {
  document.getElementById("erreurs").textContent =
    `Erreurs : ${this.erreurs}/6`;
  const parts = [
    "head",
    "body",
    "arm1",
    "arm2",
    "leg1",
    "leg2"
  ];
  parts.forEach((part, index) => {
    const el = document.getElementById(part);
    if(el){
      el.style.opacity = index < this.erreurs ? "1" : "0";
    }
  });
  const erreursEl = document.getElementById("erreurs");

erreursEl.style.color =
  this.erreurs >= 4 ? "#ff6565" : "#b9b9b9";
},

  verifierLettre: function(lettre) {
    if (!lettre || lettre.length !== 1 || !/[A-Z]/.test(lettre.toUpperCase())) {
      showToast("Lettre invalide");
      return;
    }

    lettre = lettre.toUpperCase();

    if (this.lettresTrouvees.includes(lettre)) {
      showToast("Lettre déjà utilisée");
      return;
    }

    this.lettresTrouvees.push(lettre);

    if (!this.motATrouver.includes(lettre)) {
      this.erreurs++;
const art = document.querySelector(".hangman");
art.classList.add("shake");
setTimeout(()=>{
  art.classList.remove("shake");
},300);
		setTimeout(()=>{
		  art.classList.remove("shake");
		},300);
      document.getElementById("erreurs").textContent = `Erreurs : ${this.erreurs}/6`;
      this.afficherPendu();
    }

    this.afficherMotCache();

    if (this.erreurs >= this.maxErreurs) {
      alert(`Perdu ! Le mot était : ${this.motATrouver}`);
      this.initialiserJeu();
    } else if ([...this.motATrouver].every(l => this.lettresTrouvees.includes(l))) {
      showToast("Victoire !");
      this.initialiserJeu();
    }
	// Vider la case de saisie
    document.getElementById('lettre').value = '';
  }
};

// Initialisation du jeu au chargement de la page
window.onload = function() {
  document.getElementById("lettre").focus();
  JeuPendu.initialiserJeu();
};
const input =
  document.getElementById("lettre");
const button =
  document.getElementById("valider-btn");
button.addEventListener("click",()=>{
  JeuPendu.verifierLettre(
    input.value
  );
});

input.addEventListener("keypress",(e)=>{
  if(e.key === "Enter"){
    JeuPendu.verifierLettre(
      input.value
    );
  }
});

function showToast(message){
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(()=>{
    toast.classList.remove("show");
  },2000);
}