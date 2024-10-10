const menuScreen = document.getElementById('menu-screen');
const gameContainer = document.getElementById('game-container');
const gameBoard = document.getElementById('game-board');
const startButton = document.getElementById('start-button');
const gameOverScreen = document.getElementById('game-over-screen');
const restartButton = document.getElementById('restart-button');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score-display'); // Elemento para mostrar o score

let playerPosition = 0; // Inicializa o jogador na coluna mais à esquerda
let gameInterval;
let obstacles = [];
let speed = 2; // Velocidade inicial
let obstacleSpawnInterval = 1000; // Intervalo inicial de spawn dos blocos (em milissegundos)
let isGameOver = false;
let lastTime = 0;
let score = 0; // Variável para armazenar o score

// Função para aumentar gradualmente a dificuldade
function increaseDifficulty() {
    speed += 0.1; // Aumenta a velocidade de queda levemente
    obstacleSpawnInterval *= 0.98; // Reduz o intervalo de spawn dos blocos azuis em 2%
    
    clearInterval(gameInterval); // Limpa o intervalo anterior de spawn
    gameInterval = setInterval(createObstacle, obstacleSpawnInterval); // Define o novo intervalo de spawn
}

// Movimento do jogador com as setas
document.addEventListener('keydown', (e) => {
    if (isGameOver) return; // Não permite movimento após o game over

    if (e.key === 'ArrowLeft' && playerPosition > 0) {
        playerPosition--;
        player.style.left = `${playerPosition * 50}px`; // Move para a esquerda
    } else if (e.key === 'ArrowRight' && playerPosition < 2) { // Limite da borda direita (coluna 2)
        playerPosition++;
        player.style.left = `${playerPosition * 50}px`; // Move para a direita
    }
});

// Função para criar obstáculos
function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    const obstaclePosition = Math.floor(Math.random() * 3); // Gera um obstáculo em uma coluna aleatória (0, 1 ou 2)
    obstacle.style.left = `${obstaclePosition * 50}px`;
    obstacle.style.top = '0px';
    gameBoard.appendChild(obstacle);
    obstacles.push({ element: obstacle, position: obstaclePosition, top: 0 });
}

// Função para mover os obstáculos
function moveObstacles(deltaTime) {
    obstacles.forEach((obstacle, index) => {
        obstacle.top += speed * (deltaTime / 16); // Usa a velocidade dinâmica para mover os obstáculos
        obstacle.element.style.top = `${obstacle.top}px`;

        if (obstacle.top >= 350) { // Se o obstáculo ultrapassar o limite inferior, remove e aumenta o score
            obstacle.element.remove();
            obstacles.splice(index, 1);
            increaseScore(); // Aumenta a pontuação quando o obstáculo passa sem colisão
        } else if (obstacle.top >= 260 && obstacle.position === playerPosition) { // Checa a colisão com o jogador (260)
            endGame();
        }
    });
}

// Função para aumentar o score
function increaseScore() {
    score++;
    scoreDisplay.textContent = `Score: ${score}`; // Atualiza a exibição do score
}

// Função para terminar o jogo
function endGame() {
    isGameOver = true;
    clearInterval(gameInterval);
    clearInterval(difficultyInterval); // Para de aumentar a dificuldade quando o jogo termina
    gameOverScreen.style.display = 'block'; // Mostra a tela de Game Over
}

// Função principal do loop do jogo
function gameLoop(timestamp) {
    if (isGameOver) return;
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    moveObstacles(deltaTime);
    requestAnimationFrame(gameLoop);
}

// Função para iniciar o jogo
function startGame() {
    isGameOver = false;
    obstacles = [];
    score = 0; // Reseta o score
    speed = 2; // Reseta a velocidade inicial
    obstacleSpawnInterval = 1000; // Reseta o intervalo de spawn dos blocos
    scoreDisplay.textContent = `Score: ${score}`; // Reseta o score visualmente
    playerPosition = 0; // Reseta a posição do jogador
    player.style.left = '0px'; // Reposiciona o jogador na primeira coluna
    gameInterval = setInterval(createObstacle, obstacleSpawnInterval); // Cria novos obstáculos a cada 1 segundo
    difficultyInterval = setInterval(increaseDifficulty, 2000); // Aumenta a dificuldade a cada 2 segundos (aumenta a velocidade e reduz o spawn)
    requestAnimationFrame(gameLoop); // Inicia o loop do jogo
}

// Função para reiniciar o jogo
restartButton.addEventListener('click', () => {
    location.reload(); // Recarrega a página para reiniciar o jogo
});

// Iniciar o jogo a partir do menu
startButton.addEventListener('click', () => {
    menuScreen.style.display = 'none'; // Esconde o menu
    gameContainer.style.display = 'flex'; // Mostra o jogo
    startGame(); // Inicia o jogo
});
