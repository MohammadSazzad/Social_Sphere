import { useState, useEffect } from "react";
import styles from "./uno.module.css";

const colors = ["red", "green", "blue", "yellow"];
const values = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "Skip", "Reverse"];

const generateDeck = () => {
  const deck = [];
  colors.forEach(color => {
    values.forEach(value => {
      deck.push({ color, value });
    });
  });
  for (let i = 0; i < 4; i++) {
    deck.push({ color: "wild", value: "Wild" });
  }
  return deck.sort(() => Math.random() - 0.5);
};

const Uno = () => {
  const [deck, setDeck] = useState(generateDeck());
  const [playerHand, setPlayerHand] = useState([]);
  const [computerHand, setComputerHand] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [status, setStatus] = useState("Your turn");
  const [wildColor, setWildColor] = useState(null);

  useEffect(() => {
    setPlayerHand(deck.slice(0, 7));
    setComputerHand(deck.slice(7, 14));
    setCurrentCard(deck[14]);
    setDeck(deck.slice(15));
  }, []);

  const isValidPlay = (card) => {
    return (
      card.color === currentCard.color ||
      card.value === currentCard.value ||
      card.color === "wild"
    );
  };

  const handlePlay = (card, isPlayer = true) => {
    if (!isValidPlay(card)) {
      setStatus("Invalid card. Draw a card.");
      return;
    }

    const updateHand = isPlayer ? [...playerHand] : [...computerHand];
    const cardIndex = updateHand.findIndex(c => c.color === card.color && c.value === card.value);
    if (cardIndex !== -1) updateHand.splice(cardIndex, 1);

    if (isPlayer) setPlayerHand(updateHand);
    else setComputerHand(updateHand);

    setCurrentCard(card);
    setStatus(isPlayer ? "Computer's turn" : "Your turn");

    if (card.color === "wild") {
      if (isPlayer) {
        setStatus("Choose a color");
      } else {
        const randColor = colors[Math.floor(Math.random() * 4)];
        setWildColor(randColor);
        setCurrentCard({ color: randColor, value: "Wild" });
        setStatus("Your turn");
      }
    } else {
      setWildColor(null);
      if (isPlayer) setTimeout(computerPlay, 1000);
    }
  };

  const drawCard = () => {
    if (deck.length === 0) return;
    const newCard = deck[0];
    setPlayerHand([...playerHand, newCard]);
    setDeck(deck.slice(1));
    setStatus("Card drawn");
  };

  const chooseWildColor = (color) => {
    setWildColor(color);
    setCurrentCard({ color, value: "Wild" });
    setStatus("Computer's turn");
    setTimeout(computerPlay, 1000);
  };

  const computerPlay = () => {
    const validCard = computerHand.find(card => isValidPlay(card));
    if (validCard) {
      handlePlay(validCard, false);
    } else {
      const newCard = deck[0];
      setComputerHand([...computerHand, newCard]);
      setDeck(deck.slice(1));
      setStatus("Your turn");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🎴 UNO</h1>

      <div className={styles.status}>Current Card:</div>
      <div className={`${styles.card} ${styles.currentCard} ${styles[currentCard?.color]}`}>{currentCard?.value}</div>

      {status === "Choose a color" && (
        <div>
          {colors.map(color => (
            <button key={color} onClick={() => chooseWildColor(color)} className={styles.wildColorBtn}>
              {color.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      <div className={styles.status}>{status}</div>

      <div className={styles.hand}>
        {playerHand.map((card, i) => (
          <div
            key={i}
            className={`${styles.card} ${styles[card.color]}`}
            onClick={() => handlePlay(card)}
          >
            {card.value}
          </div>
        ))}
      </div>

      <button onClick={drawCard} className={styles.drawCardBtn}>Draw Card</button>
    </div>
  );
};

export default Uno;
