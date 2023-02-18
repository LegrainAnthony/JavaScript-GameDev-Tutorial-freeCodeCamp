// Attendre que la page soit complètement chargée avant d'exécuter le code
window.addEventListener("load", function () {
  // Sélectionner l'élément canvas et récupérer son contexte 2D
  const canvas = document.querySelector("#canvas1");
  const ctx = canvas.getContext("2d");

  // Définir les dimensions du canvas
  canvas.width = 1280;
  canvas.height = 720;

  // Définir les propriétés du contexte de rendu
  ctx.fillStyle = "white"; // couleur de remplissage pour les formes dessinées
  ctx.lineWidth = 3; // largeur de la bordure pour les formes dessinées
  ctx.strokeStyle = "white"; // couleur de la bordure pour les formes dessinées

  // Définir la classe Player
  class Player {
    constructor(game) {
      this.game = game;
      this.collisionX = this.game.width * 0.5;
      this.collisionY = this.game.height * 0.5;
      this.collisionRadius = 30;
      this.speedX = 0;
      this.speedY = 0;
      this.dx = 0;
      this.dy = 0;
      this.speedModifier = 5;
    }
    draw(contexte) {
      // dessiner le cercle du joueur
      contexte.beginPath(); // indiquer au contexte de rendu que l'on va dessiner un nouveau chemin
      contexte.arc(this.collisionX, this.collisionY, 50, 0, Math.PI * 2); // dessiner un cercle avec les paramètres spécifiés
      contexte.save(); // sauvegarder le contexte actuel
      contexte.globalAlpha = 0.5; // définir l'opacité globale pour la forme suivante
      contexte.fill(); // remplir la forme avec la couleur de remplissage actuelle
      contexte.restore(); // restaurer le contexte précédent
      contexte.stroke(); // dessiner la bordure de la forme
      // dessiner une ligne reliant le centre du cercle du joueur à la position de la souris
      contexte.beginPath(); // indiquer au contexte de rendu que l'on va dessiner un nouveau chemin
      contexte.moveTo(this.collisionX, this.collisionY); // déplacer le point de départ du chemin
      contexte.lineTo(this.game.mouse.x, this.game.mouse.y); // dessiner une ligne reliant le point de départ au point d'arrivée spécifié
      contexte.stroke(); // dessiner la bordure de la ligne
    }
    update() {
      // mettre à jour la position du joueur en fonction de la position de la souris
      this.dx = this.game.mouse.x - this.collisionX;
      this.dy = this.game.mouse.y - this.collisionY;
      const distance = Math.hypot(this.dx, this.dy);
      if (distance > this.speedModifier) {
        this.speedX = this.dx / distance || 0;
        this.speedY = this.dy / distance || 0;
      } else {
        this.speedX = 0;
        this.speedY = 0;
      }
      this.collisionX += this.speedX * this.speedModifier;
      this.collisionY += this.speedY * this.speedModifier;
    }
  }
  // Définir la classe Obstacle
  class Obstacle {
    constructor(game) {
      this.game = game;
      this.collisionX = Math.random() * this.game.width; // définit la position X aléatoire de l'obstacle dans la zone de jeu
      this.collisionY = Math.random() * this.game.height; // définit la position Y aléatoire de l'obstacle dans la zone de jeu
      this.collisionRadius = 60; // définit le rayon de collision de l'obstacle
    }
    draw(contexte) {
      contexte.beginPath(); // indique que l'on va dessiner un nouveau chemin
      contexte.arc(this.collisionX, this.collisionY, 50, 0, Math.PI * 2); // dessine un cercle avec un rayon de 50 pixels et avec un angle de 0 à 2*PI
      contexte.save(); // sauvegarde les propriétés actuelles du contexte de rendu
      contexte.globalAlpha = 0.5; // définit l'opacité du cercle
      contexte.fill(); // remplit le cercle avec la couleur actuelle du contexte de rendu
      contexte.restore(); // restaure les propriétés précédemment sauvegardées du contexte de rendu
      contexte.stroke(); // dessine le contour du cercle avec la couleur actuelle du contexte de rendu
    }
  }

  // Définir la classe Game
  class Game {
    constructor(canvas) {
      this.canvas = canvas;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.player = new Player(this); // crée un nouveau joueur avec l'instance de Game comme argument
      this.numberOfObstacles = 5; // définit le nombre d'obstacles à créer
      this.obstacle = []; // initialise un tableau d'obstacles vides
      this.mouse = {
        x: this.width * 0.5, // définit la position X initiale de la souris au milieu de la zone de jeu
        y: this.height * 0.5, // définit la position Y initiale de la souris au milieu de la zone de jeu
        pressed: false, // initialise l'état du bouton de la souris à "non appuyé"
      };

      // Ajoute des écouteurs d'événements pour détecter les mouvements de la souris et les clics de souris
      canvas.addEventListener("mousedown", (e) => {
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
        this.mouse.pressed = true;
      });
      canvas.addEventListener("mouseup", (e) => {
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
        this.mouse.pressed = false;
      });
      canvas.addEventListener("mousemove", (e) => {
        if (this.mouse.pressed) {
          this.mouse.x = e.offsetX;
          this.mouse.y = e.offsetY;
        }
      });
    }
    render(contexte) {
      this.player.draw(contexte); // dessine le joueur
      this.player.update(); // met à jour la position du joueur
      this.obstacle.forEach((obstacle) => {
        obstacle.draw(contexte); // dessine chaque obstacle dans le tableau d'obstacles
      });
    }
    init() {
      let attemps = 0;
      // Tant que le nombre d'obstacles est inférieur au nombre d'obstacles souhaité
      // et que le nombre d'essais est inférieur à 500
      while (this.obstacle.length < this.numberOfObstacles && attemps < 500) {
        // Créer un nouvel obstacle
        let testObstacle = new Obstacle(this);
        let overlap = false;
        // Vérifier si l'obstacle créé chevauche un obstacle existant
        this.obstacle.forEach((obstacle) => {
          const dx = testObstacle.collisionX - obstacle.collisionX;
          const dy = testObstacle.collisionY - obstacle.collisionY;
          const distance = Math.hypot(dx, dy);
          const sumOfRadii =
            testObstacle.collisionRadius + obstacle.collisionRadius;
          if (distance < sumOfRadii) {
            overlap = true;
          }
        });
        // Si l'obstacle ne chevauche aucun obstacle existant, l'ajouter à la liste d'obstacles
        if (!overlap) {
          this.obstacle.push(testObstacle);
        }
        // Réinitialiser la variable overlap et incrémenter le nombre d'essais
        overlap = false;
        attemps++;
      }
    }
  }

  const game = new Game(canvas);

  // Appeler la méthode init pour initialiser le jeu
  game.init();

  // Afficher l'objet game dans la console
  console.log(game);

  // Définir la fonction animate qui sera appelée en continu pour mettre à jour le rendu du jeu
  function animate() {
    // Effacer le canvas avant chaque nouvelle frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Appeler la méthode render de la classe Game pour dessiner le joueur et les obstacles
    game.render(ctx);
    // Demander à l'API de rendre la prochaine frame
    window.requestAnimationFrame(animate);
  }

  animate();
});
