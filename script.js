// Attendre que la page soit complètement chargée avant d'exécuter le code
window.addEventListener('load', function() {
    
    // Sélectionner l'élément canvas et récupérer son contexte 2D
    const canvas = document.querySelector('#canvas1');
    const ctx = canvas.getContext('2d');

    // Définir les dimensions du canvas
    canvas.width = 1280;
    canvas.height = 720;

    // Définir la classe Player
    class Player {
        constructor(game) {
            this.game = game;
        }
    }

    // Définir la classe Game
    class Game {
        constructor(canvas){
            this.canvas = canvas;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.player = new Player(this);
        }
    }

    // Créer une nouvelle instance de Game avec l'élément canvas comme argument
    const game = new Game(canvas);
    
    // Afficher l'instance de Game dans la console
    console.log(game);

    // Définir la fonction animate (pour le moment vide)
    function animate () {
        
    }
});
