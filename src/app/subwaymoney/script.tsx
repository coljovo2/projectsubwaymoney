import { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';

interface Obstacle {
    element: HTMLDivElement;
    position: number;
    top: number;
}

const DodgeGame = () => {
    const [playerPosition, setPlayerPosition] = useState(0); // Player starts at leftmost column
    const [score, setScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [speed, setSpeed] = useState(2); // Initial speed
    const [obstacleSpawnInterval, setObstacleSpawnInterval] = useState(1000); // Initial spawn interval
    const gameBoardRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<HTMLDivElement>(null);
    const gameIntervalRef = useRef<number | null>(null);
    const difficultyIntervalRef = useRef<number | null>(null);
    const lastTimeRef = useRef(0);
    const obstaclesRef = useRef<Obstacle[]>([]); // Use ref to avoid state updates on obstacle changes

    // Handle player movement with arrow keys
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isGameOver) return;

            if (e.key === 'ArrowLeft' && playerPosition > 0) {
                setPlayerPosition((prev) => prev - 1); // Move left
            } else if (e.key === 'ArrowRight' && playerPosition < 2) {
                setPlayerPosition((prev) => prev + 1); // Move right
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [playerPosition, isGameOver]);

    // Increase difficulty over time
    const increaseDifficulty = () => {
        setSpeed((prevSpeed) => prevSpeed + 0.1); // Slightly increase fall speed
        setObstacleSpawnInterval((prevInterval) => prevInterval * 0.98); // Reduce spawn interval by 2%

        if (gameIntervalRef.current) clearInterval(gameIntervalRef.current); // Clear previous interval
        gameIntervalRef.current = window.setInterval(createObstacle, obstacleSpawnInterval); // Set new interval
    };

    // Create an obstacle at a random position
    const createObstacle = () => {
        if (!gameBoardRef.current) return;

        const obstacleElement = document.createElement('div');
        obstacleElement.classList.add(styles.obstacle); // Assuming CSS for obstacle exists
        const obstaclePosition = Math.floor(Math.random() * 3); // Random position (0, 1, 2)
        obstacleElement.style.left = `${obstaclePosition * 50}px`;
        obstacleElement.style.top = '0px';

        gameBoardRef.current.appendChild(obstacleElement);
        obstaclesRef.current.push({ element: obstacleElement, position: obstaclePosition, top: 0 });
    };

    // Move obstacles and check for collisions
    const moveObstacles = (deltaTime: number) => {
        obstaclesRef.current.forEach((obstacle) => {
            const newTop = obstacle.top + speed * (deltaTime / 16);
            obstacle.element.style.top = `${newTop}px`;

            // Check if obstacle has passed
            if (newTop >= 350) {
                obstacle.element.remove();
                obstaclesRef.current = obstaclesRef.current.filter((o) => o !== obstacle);
                increaseScore(); // Increase score if the obstacle passes
            }

            // Check for collision with player
            if (newTop >= 260 && obstacle.position === playerPosition) {
                endGame(); // End the game on collision
            }

            obstacle.top = newTop; // Update obstacle position
        });
    };

    // Increase score when an obstacle passes
    const increaseScore = () => {
        setScore((prevScore) => prevScore + 1);
    };

    // End the game
    const endGame = () => {
        setIsGameOver(true);
        if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
        if (difficultyIntervalRef.current) clearInterval(difficultyIntervalRef.current);
    };

    // Main game loop using requestAnimationFrame
    const gameLoop = (timestamp: number) => {
        if (isGameOver) return;

        const deltaTime = timestamp - lastTimeRef.current;
        lastTimeRef.current = timestamp;

        moveObstacles(deltaTime);
        requestAnimationFrame(gameLoop);
    };

    // Start the game
    const startGame = () => {
        setIsGameOver(false);
        obstaclesRef.current = [];
        setScore(0);
        setSpeed(2);
        setObstacleSpawnInterval(1000);
        setPlayerPosition(0);
        lastTimeRef.current = 0;

        if (gameBoardRef.current) gameBoardRef.current.innerHTML = ''; // Clear the board

        gameIntervalRef.current = window.setInterval(createObstacle, obstacleSpawnInterval);
        difficultyIntervalRef.current = window.setInterval(increaseDifficulty, 2000); // Increase difficulty every 2s
        requestAnimationFrame(gameLoop);
    };

    // Reset the game
    const restartGame = () => {
        window.location.reload(); // Reload the page to reset
    };

    return (
        <div>
            {!isGameOver ? (
                <div id="menu-screen" className={styles.menuScreen}>
                    <h1>Jogo de Esquiva</h1>
                    <button onClick={startGame}>Iniciar</button>
                </div>
            ) : (
                <div id="game-over-screen" className={styles.gameOverScreen}>
                    <h1>Game Over</h1>
                    <button onClick={restartGame}>Reiniciar</button>
                </div>
            )}

            <div className={styles.gameContainer} id="game-container" style={{ display: isGameOver ? 'none' : 'flex' }}>
                <div ref={gameBoardRef} id="game-board" className={styles.gameBoard}>
                    <div ref={playerRef} className={styles.player} style={{ left: `${playerPosition * 50}px` }} />
                </div>
                <div id="score-display" className={styles.scoreDisplay}>Score: {score}</div>
            </div>
        </div>
    );
};

export default DodgeGame;
