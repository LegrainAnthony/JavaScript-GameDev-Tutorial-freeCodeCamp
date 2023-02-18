// Attendre que la page soit complètement chargée avant d'exécuter le code
window.addEventListener('load', function() {
    
    // Sélectionner l'élément canvas et récupérer son contexte 2D
    const canvas = document.querySelector('#canvas1');
    const ctx = canvas.getContext('2d');

    // Définir les dimensions du canvas
    canvas.width = 1280;
    canvas.height = 720;

    // Définir les propriétés du contexte de rendu
    ctx.fillStyle = 'white';
    ctx.libeWidth = 3;
    ctx.strokeStyle = 'white';

    // Définir la classe Player
    class Player {
        constructor(game) {
            this.game = game;
            this.collisionX = this.game.width * 0.5;
            this.collisionY= this.game.height * 0.5;
            this.collisionRadius = 30;
            this.speedX = 0;
            this.speedY = 0;
            this.dx = 0;
            this.dy = 0;
            this.speedModifier = 5;
        }
        draw(contexte) {
            // methode pour indiquer au contexte de rendu que l'on va dessiner un nouveau chemin
            contexte.beginPath();
            // methode pour indiquer au contexte de rendu que l'on va dessiner un arc de cercle
            // x, y, rayon, angle de départ, angle de fin
            contexte.arc(this.collisionX, this.collisionY, 50, 0, Math.PI * 2);
            contexte.save();
            contexte.globalAlpha = 0.5;
            contexte.fill();
            contexte.restore();
            // donne la couleur au cercle
            contexte.stroke();
            contexte.beginPath();
            contexte.moveTo(this.collisionX, this.collisionY);
            contexte.lineTo(this.game.mouse.x, this.game.mouse.y);
            contexte.stroke();

        }
        update() {
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


    class Obstacle {
        constructor(game) {
            this.game = game;
            this.collisionX = Math.random() * this.game.width;
            this.collisionY = Math.random() * this.game.height;
            this.collisionRadius = 60;
        }
        draw(contexte) {
            contexte.beginPath();
            contexte.arc(this.collisionX, this.collisionY, 50, 0, Math.PI * 2);
            contexte.save();
            contexte.globalAlpha = 0.5;
            contexte.fill();
            contexte.restore();
            contexte.stroke();
        }
    }


    // Définir la classe Game
    class Game {
        constructor(canvas){
            this.canvas = canvas;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.player = new Player(this);
            this.numberOfObstacles = 5;
            this.obstacle = []
            this.mouse = {
                x: this.width * 0.5,
                y: this.height * 0.5,
                pressed : false
            }


            canvas.addEventListener('mousedown', (e) => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.pressed = true;
            });
            canvas.addEventListener('mouseup', (e) => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.pressed = false;
            });
            canvas.addEventListener('mousemove', (e) => {
                if (this.mouse.pressed) {
                    this.mouse.x = e.offsetX;
                    this.mouse.y = e.offsetY;
                }
            });
        }
        render(contexte){
            this.player.draw(contexte);
            this.player.update();
            this.obstacle.forEach(obstacle => {
                obstacle.draw(contexte);
            });
        }
        init () {
            let attemps = 0;
            while (this.obstacle.length < this.numberOfObstacles && attemps < 500) {
              let testObstacle = new Obstacle(this);
              let overlap = false;
              this.obstacle.forEach(obstacle => {
                const dx = testObstacle.collisionX - obstacle.collisionX;
                const dy = testObstacle.collisionY - obstacle.collisionY;
                const distance = Math.hypot(dx, dy);
                const sumOfRadii = testObstacle.collisionRadius + obstacle.collisionRadius;
                if (distance < sumOfRadii) {
                  overlap = true;
                }
              });
              if (!overlap) {
                this.obstacle.push(testObstacle);
              }
              overlap = false;
              attemps++;
            }
          }
          
}

    // Créer une nouvelle instance de Game avec l'élément canvas comme argument
    const game = new Game(canvas);
    game.init();
    console.log(game);



    // Définir la fonction animate (pour le moment vide)
    function animate () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.render(ctx);
        window.requestAnimationFrame(animate);
    }

    animate();
});
