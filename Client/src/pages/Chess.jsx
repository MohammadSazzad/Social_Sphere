import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import styles from './chess.module.css';

const ChessGame = () => {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [mode, setMode] = useState(null); // null, 'offline', or 'computer'
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  const makeMove = (sourceSquare, targetSquare) => {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q',
    });

    if (move) {
      setFen(game.fen());
      setIsPlayerTurn(false);
    }

    return move !== null;
  };

  useEffect(() => {
    if (mode === 'computer' && !game.isGameOver() && !isPlayerTurn) {
      const timeout = setTimeout(() => {
        const moves = game.moves();
        const move = moves[Math.floor(Math.random() * moves.length)];
        game.move(move);
        setFen(game.fen());
        setIsPlayerTurn(true);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [fen, mode, game, isPlayerTurn]);

  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setIsPlayerTurn(true);
  };

  if (!mode) {
    return (
      <div className={styles.container}>
        <h2 className={styles.heading}>♟️ Choose Game Mode</h2>
        <div className={styles.buttons}>
          <button onClick={() => setMode('offline')}>Play Offline</button>
          <button onClick={() => setMode('computer')}>Play vs Computer</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        {mode === 'computer' ? '🤖 Play vs Computer' : '👬 Offline Chess'}
      </h2>
      <div className={styles.boardWrapper}>
        <Chessboard
          position={fen}
          onPieceDrop={(s, t) => {
            if (mode === 'computer' && !isPlayerTurn) return false;
            return makeMove(s, t);
          }}
          boardWidth={400}
        />
      </div>
      <button onClick={resetGame} className={styles.resetButton}>Reset Game</button>
    </div>
  );
};

export default ChessGame;
