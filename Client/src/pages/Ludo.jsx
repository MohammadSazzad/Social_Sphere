import { useState } from 'react';
import styles from './ludo.module.css';

const players = ['red', 'green', 'yellow', 'blue'];

const Ludo = () => {
  const [dice, setDice] = useState(1);
  const [turn, setTurn] = useState(0); // index of current player
  const [positions, setPositions] = useState({
    red: [0, 0, 0, 0],
    green: [0, 0, 0, 0],
    yellow: [0, 0, 0, 0],
    blue: [0, 0, 0, 0],
  });

  const rollDice = () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    setDice(roll);
  };

  const nextTurn = () => {
    setTurn((turn + 1) % players.length);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🎲 Ludo Game</h1>
      <p className={styles.status}>Current Player: {players[turn].toUpperCase()}</p>
      <div className={styles.dice} onClick={rollDice}>🎲 {dice}</div>
      <button className={styles.turnButton} onClick={nextTurn}>End Turn</button>

      {/* Placeholder for board */}
      <div className={styles.board}>
        {players.map((player) => (
          <div key={player} className={styles.tokenRow}>
            <strong>{player.toUpperCase()} Tokens:</strong> {positions[player].join(', ')}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ludo;
