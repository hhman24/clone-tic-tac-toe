import "./App.css";
import { useState } from "react";

function Square({ value, onSquareClick, isActive }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {isActive ? <span className="hight-light-text">{value}</span>: value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      var winner = {
        winer: squares[a],
        winerLine: lines[i]
      };
      return winner;
    }
  }
  return null;
}

function Board({ xIsNext, squares, onPlay, boardRows }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    // store next move
    onPlay(nextSquares, i);
  }

  function isActive(i){
    if(winner){
      if(winner.winerLine.includes(i))
        return true;
    }
    return false;
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner.winer;
  } else if(!winner && !squares.includes(null)) {
    status = "Draw";
  }
  else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      {Array(boardRows).fill(null).map((value, row) => {
          return (
            <div className="board-row"key={row}>
              {Array(boardRows).fill(null).map((value, col) => {
                  let i = col + row * boardRows;
                  return (
                    <Square value={squares[i]} key={i} onSquareClick={() => handleClick(i)} isActive={isActive(i)}/>
                  );
                })}
            </div>
          );
        })}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{squares: Array(9).fill(null), index: [0,0]}]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;
  const boardRows = 3;

  function handlePlay(nextSquares, i) {

    let col = i % boardRows;
    let row = Math.floor(i / boardRows);

    const squaresInfo = {
      squares: nextSquares,
      index: [row, col]
    }

    const nextHistory = [...history.slice(0, currentMove + 1), squaresInfo];
    console.log(nextHistory);
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function toggleButton() {
    setAscending(!isAscending)
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    let isCurrentMove;

    if (move > 0) {
      description = "Go to move #" + move + ` (${squares.index[0]},${squares.index[1]})`;
      isCurrentMove = (move === currentMove) ? true : false;
    } else {
      description = "Go to game start";
    }

    return (
      <li key={move}>
        {isCurrentMove ? (
          <div className="current-move">
            {"You are at move #" + currentMove}
          </div>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  if (!isAscending) {
    moves.reverse();
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} boardRows={boardRows}/>
      </div>
      <div className="game-info">
        <button className="toggle-button" onClick={toggleButton}>{isAscending ? 'Descending' : 'Ascending'}</button>
        <ol start={0}>{moves}</ol>
      </div>
    </div>
  );
}
