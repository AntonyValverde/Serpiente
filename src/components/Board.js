import React from 'react';
import './Board.css';

const Board = ({ snakeDots, foodDot }) => {
  return (
    <div className="board">
      {snakeDots.map((dot, i) => (
        <div key={i} className="snake-dot" style={{ left: `${dot[0]}%`, top: `${dot[1]}%` }}></div>
      ))}
      <div className="food-dot" style={{ left: `${foodDot[0]}%`, top: `${foodDot[1]}%` }}></div>
    </div>
  );
};

export default Board;
