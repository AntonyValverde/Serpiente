import React from 'react';
import './Modal.css';

const Modal = ({ score, restartGame }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Juego Terminado</h2>
        <p>Tu puntaje fue: {score}</p>
        <button onClick={restartGame}>Reiniciar</button>
      </div>
    </div>
  );
};

export default Modal;
