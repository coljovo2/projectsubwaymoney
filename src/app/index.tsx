import { useState, useEffect } from 'react';
import styles from './styles.module.css'; // Assuming you're using CSS modules for styling

const DodgeGame = () => {
    const [isGameActive, setIsGameActive] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [score, setScore] = useState(0);

    // Function to handle starting the game
    const startGame = () => {
        setIsGameActive(true);
        setIsGameOver(false);
        setScore(0);
        // Initialize or reset other game elements if needed
    };

    // Function to handle restarting the game
    const restartGame = () => {
        setIsGameOver(false);
        startGame();
    };

    // Example game logic to increase score (useEffect to simulate game loop)
    useEffect(() => {
        if (isGameActive && !isGameOver) {
            const interval = setInterval(() => {
                setScore(prevScore => prevScore + 1);
            }, 1000);

            // Cleanup interval on component unmount or game end
            return () => clearInterval(interval);
        }
    }, [isGameActive, isGameOver]);

    return (
        <div>
            {/* Menu Screen */}
            {!isGameActive && !isGameOver && (
                <div id="menu-screen" className={styles.menuScreen}>
                    <h1>Jogo de Esquiva</h1>
                    <button id="start-button" onClick={startGame}>
                        Iniciar
                    </button>
                </div>
            )}

            {/* Game Screen */}
            {isGameActive && !isGameOver && (
                <div className={styles.gameContainer} id="game-container">
                    <div id="game-board" className={styles.gameBoard}>
                        <div className={styles.player} id="player"></div>
                    </div>
                    <div id="score-display" className={styles.scoreDisplay}>
                        Score: {score}
                    </div>
                </div>
            )}

            {/* Game Over Screen */}
            {isGameOver && (
                <div id="game-over-screen" className={styles.gameOverScreen}>
                    <h1>Game Over</h1>
                    <button id="restart-button" onClick={restartGame}>
                        Reiniciar
                    </button>
                </div>
            )}
        </div>
    );
};

export default DodgeGame;
