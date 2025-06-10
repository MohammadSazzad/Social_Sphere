import styles from './gaming.module.css';
import { Link } from 'react-router-dom';
import chessImg from "../../assets/chess.jpeg";
import ludoImg from "../../assets/ludo.png";
import unoImg from "../../assets/uno.jpeg";


const Gaming = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>🎮 Gaming Zone</h1>
      
      <div className={styles.cardGrid}>
        <Link to="/gaming/chess" className={styles.card}>
          <img src={chessImg} alt="Chess" />
          <p>Chess</p>
        </Link>

        <Link to="/gaming/ludo" className={styles.card}>
          <img src={ludoImg} alt="Ludo" />
          <p>Ludo</p>
        </Link>

        <Link to="/gaming/uno" className={styles.card}>
          <img src={unoImg} alt="UNO" />
          <p>UNO</p>
        </Link>
      </div>
    </div>
  );
};

export default Gaming;
