// =====================
// DOM CACHE
// =====================

const UI = {
	mot: document.getElementById("mot"),
	erreurs: document.getElementById("erreurs"),
	lettres: document.getElementById("lettres-utilisees"),
	input: document.getElementById("lettre"),
	button: document.getElementById("valider-btn"),
	toast: document.getElementById("toast") || null,
	hangman: document.querySelector(".hangman")
};

// =====================
// CONSTANTES
// =====================

const HANGMAN_PARTS = [
	document.getElementById("head"),
	document.getElementById("body"),
	document.getElementById("arm1"),
	document.getElementById("arm2"),
	document.getElementById("leg1"),
	document.getElementById("leg2")
];


// =====================
// GAME
// =====================

const JeuPendu = {

	// ===== STATE =====
	motATrouver: "",
	lettresUtilisees: [],
	lettresCorrectes: [],
	erreurs: 0,
	maxErreurs: 6,
	jeuTermine: false,

	// ===== DATA =====
	mots: [
		"MAISON", "VOITURE", "ORDINATEUR", "TELEPHONE", "CHAT", "CHIEN", "OISEAU", "ARBRE", "FLEUR", "SOLEIL", "LUNETTES", "LIVRE",	"STYLO", "CAHIER", "TABLE",	"CHAISE", "FENETRE", "PORTE", "JARDIN", "PARC", "VILLE", "MONTAGNE", "RIVIERE", "OCEAN","AVION", "TRAIN", "VELO"
	],

	// =====================
	// INIT
	// =====================
	initialiserJeu() {
		this.motATrouver = this.choisirMot();
		this.lettresUtilisees = [];
		this.lettresCorrectes = [];
		this.erreurs = 0;
		this.jeuTermine = false;
		this.mettreAJourUI();
	},

	choisirMot() {
		return this.mots[Math.floor(Math.random() * this.mots.length)];
	},

	// =====================
	// GAME LOGIC
	// =====================
	verifierLettre(lettre) {
		if (this.jeuTermine) return;
		lettre = lettre.toUpperCase().trim();
		if (!/^[A-Z]$/.test(lettre)) {
			showToast("Lettre invalide");
			return;
		}
		if (this.lettresUtilisees.includes(lettre)) {
			showToast("Lettre déjà utilisée");
			return;
		}
		this.lettresUtilisees.push(lettre);
		if (this.motATrouver.includes(lettre)) {
			this.lettresCorrectes.push(lettre);
		} else {
			this.erreurs++;
			this.jouerAnimationErreur();
			}
		this.mettreAJourUI();
		this.resetInput();
		if (this.verifierVictoire()) {
			this.jeuTermine = true;
			showToast("Victoire !");
			setTimeout(() => {
				this.initialiserJeu();
			}, 1200);
		return;
		}
		if (this.verifierDefaite()) {
			this.jeuTermine = true;
			// révèle le mot
			UI.mot.textContent = this.motATrouver.split("").join(" ");
			showToast(`Perdu : ${this.motATrouver}`);
			setTimeout(() => {
					this.initialiserJeu();
				}, 1500);
			}
	},
	verifierVictoire() {
		for (const lettre of this.motATrouver) {
			if (!this.lettresCorrectes.includes(lettre)) {
				return false;
			}
		}
		return true;
	},
	verifierDefaite() {
		return this.erreurs >= this.maxErreurs;
	},


	// =====================
	// UI
	// =====================
	mettreAJourUI() {
		this.afficherMot();
		this.afficherErreurs();
		this.afficherLettres();
		this.afficherPendu();
	},
	afficherMot() {
		const motCache =[...this.motATrouver].map(lettre =>	this.lettresCorrectes.includes(lettre) ? lettre : "_").join(" ");
		UI.mot.textContent = motCache;
	},
	afficherErreurs() {
		UI.erreurs.textContent =`Erreurs : ${this.erreurs}/${this.maxErreurs}`;
		UI.erreurs.style.color = this.erreurs >= 4 ? "var(--danger)" : "#b9b9b9";
	},
	afficherLettres() {
		UI.lettres.textContent = this.lettresUtilisees.join(" • ");
	},
	afficherPendu() {
		HANGMAN_PARTS.forEach((element, index) => {
			const visible = index < this.erreurs;
		element.style.opacity =
			visible ? "1" : "0";
		element.style.transform =
			visible
				? "scale(1)"
				: "scale(.8)";
		});
	},
	jouerAnimationErreur() {
		UI.hangman.classList.add("shake");
		setTimeout(() => {UI.hangman.classList.remove("shake");	}, 300);
	},
	resetInput() {
		UI.input.value = "";
		UI.input.focus();
	}
};


// =====================
// TOAST
// =====================

function showToast(message) {
	if (!UI.toast) {
		console.log(message);
		return;
	}
	UI.toast.textContent = message;
	UI.toast.classList.add("show");
	setTimeout(() => {UI.toast.classList.remove("show");}, 2000);
}

// =====================
// EVENTS
// =====================
UI.button.addEventListener("click", () => {
	JeuPendu.verifierLettre(UI.input.value);
});
UI.input.addEventListener("keydown", e => {
	if (e.key === "Enter") {
		JeuPendu.verifierLettre(UI.input.value);
	}
});

// =====================
// INIT
// =====================
document.addEventListener("DOMContentLoaded", () => {
	UI.input.focus();
	JeuPendu.initialiserJeu();
});