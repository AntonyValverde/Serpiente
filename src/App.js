import React, { useState, useEffect } from 'react';
import Board from './components/Board';
import './App.css';
import Modal from './components/Modal';

const getRandomCoordinates = () => {
  let min = 1;
  let max = 98;
  let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  return [x, y];
};

const initialState = {
  snakeDots: [[0, 0], [2, 0]],
  foodDot: getRandomCoordinates(),
  direction: 'RIGHT',
  speed: 200,
  score: 0,
  gameOver: false,
  hasStarted: false,
};

function App() {
  const [snakeDots, setSnakeDots] = useState(initialState.snakeDots);
  const [foodDot, setFoodDot] = useState(initialState.foodDot);
  const [direction, setDirection] = useState(initialState.direction);
  const [speed, setSpeed] = useState(initialState.speed);
  const [score, setScore] = useState(initialState.score);
  const [gameOver, setGameOver] = useState(initialState.gameOver);
  const [hasStarted, setHasStarted] = useState(initialState.hasStarted);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect if the device is mobile
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    if (gameOver || !hasStarted) return;

    const moveSnake = () => {
      let dots = [...snakeDots];
      let head = dots[dots.length - 1];

      switch (direction) {
        case 'RIGHT':
          head = [head[0] + 2, head[1]];
          break;
        case 'LEFT':
          head = [head[0] - 2, head[1]];
          break;
        case 'DOWN':
          head = [head[0], head[1] + 2];
          break;
        case 'UP':
          head = [head[0], head[1] - 2];
          break;
        default:
          break;
      }

      dots.push(head);
      dots.shift();
      setSnakeDots(dots);
    };

    const checkIfOutOfBorders = () => {
      let head = snakeDots[snakeDots.length - 1];
      if (head[0] >= 100 || head[0] < 0 || head[1] >= 100 || head[1] < 0) {
        onGameOver();
      }
    };

    const checkIfCollapsed = () => {
      let snake = [...snakeDots];
      let head = snake[snake.length - 1];
      snake.pop();
      snake.forEach(dot => {
        if (head[0] === dot[0] && head[1] === dot[1]) {
          onGameOver();
        }
      });
    };

    const checkIfEat = () => {
      let head = snakeDots[snakeDots.length - 1];
      if (head[0] === foodDot[0] && head[1] === foodDot[1]) {
        setFoodDot(getRandomCoordinates());
        enlargeSnake();
        increaseSpeed();
        setScore(score + 1);
        playSound('eat');
      }
    };

    const enlargeSnake = () => {
      let newSnake = [...snakeDots];
      newSnake.unshift([]);
      setSnakeDots(newSnake);
    };

    const increaseSpeed = () => {
      if (speed > 10) {
        setSpeed(speed - 10);
      }
    };

    const onGameOver = () => {
      setGameOver(true);
      playSound('lose');
    };

    const handleKeyDown = (e) => {
      e = e || window.event;
      switch (e.keyCode) {
        case 38:
          setDirection('UP');
          break;
        case 40:
          setDirection('DOWN');
          break;
        case 37:
          setDirection('LEFT');
          break;
        case 39:
          setDirection('RIGHT');
          break;
        default:
          break;
      }
    };

    document.onkeydown = handleKeyDown;

    const interval = setInterval(() => {
      moveSnake();
      checkIfOutOfBorders();
      checkIfCollapsed();
      checkIfEat();
    }, speed);

    return () => clearInterval(interval);
  }, [snakeDots, foodDot, direction, speed, gameOver, hasStarted]);

  const startGame = () => {
    setHasStarted(true);
    playSound('start');
  };

  const restartGame = () => {
    setSnakeDots(initialState.snakeDots);
    setFoodDot(initialState.foodDot);
    setDirection(initialState.direction);
    setSpeed(initialState.speed);
    setScore(initialState.score);
    setGameOver(false);
    setHasStarted(false);
  };

  const handleControlClick = (newDirection) => {
    setDirection(newDirection);
  };

  const playSound = (type) => {
    const sound = new Audio(`/sounds/${type}.mpeg`);
    sound.play().catch(error => {
      console.log(`Failed to play ${type} sound:`, error);
    });
  };

  return (
    <div className="App">
      <h1>Juego de la Serpiente</h1>
      <p>Puntaje: {score}</p>
      {!hasStarted && (
        <button onClick={startGame} className="start-button">
          Comenzar Juego
        </button>
      )}
      <Board snakeDots={snakeDots} foodDot={foodDot} />
      {gameOver && <Modal score={score} restartGame={restartGame} />}
      {isMobile && (
        <div className="controls">
          <button onClick={() => handleControlClick('UP')}>Arriba</button>
          <div>
            <button onClick={() => handleControlClick('LEFT')}>Izquierda</button>
            <button onClick={() => handleControlClick('RIGHT')}>Derecha</button>
          </div>
          <button onClick={() => handleControlClick('DOWN')}>Abajo</button>
        </div>
      )}
    </div>
  );
}

export default App;
