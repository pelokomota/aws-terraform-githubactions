const board = document.getElementById('board');
const scoreDisplay = document.getElementById('score-value');
const rows = 20;
const columns = 10;
let score = 0;
let boardArray = Array.from({ length: rows }, () => Array(columns).fill(0));

const shapes = [
  [[1, 1, 1, 1]], // I shape
  [[1, 1], [1, 1]], // O shape
  [[0, 1, 0], [1, 1, 1]], // T shape
  [[1, 1, 0], [0, 1, 1]], // S shape
  [[0, 1, 1], [1, 1, 0]], // Z shape
  [[1, 0, 0], [1, 1, 1]], // L shape
  [[0, 0, 1], [1, 1, 1]], // J shape
];

let currentShape;
let currentPosition = { x: 4, y: 0 };

function createBoard() {
  board.innerHTML = '';
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.setAttribute('data-x', x);
      cell.setAttribute('data-y', y);
      board.appendChild(cell);
    }
  }
}

function drawShape(shape, xOffset = 0, yOffset = 0) {
  shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        const xPos = currentPosition.x + x + xOffset;
        const yPos = currentPosition.y + y + yOffset;
        if (xPos >= 0 && xPos < columns && yPos < rows) {
          const cellElement = document.querySelector(`[data-x="${xPos}"][data-y="${yPos}"]`);
          if (cellElement) {
            cellElement.classList.add('falling');
          }
        }
      }
    });
  });
}

function clearShape(shape) {
  shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        const xPos = currentPosition.x + x;
        const yPos = currentPosition.y + y;
        const cellElement = document.querySelector(`[data-x="${xPos}"][data-y="${yPos}"]`);
        if (cellElement) {
          cellElement.classList.remove('falling');
        }
      }
    });
  });
}

function rotateShape(shape) {
  return shape[0].map((_, index) => shape.map(row => row[index])).reverse();
}

function moveShape(direction) {
  clearShape(currentShape);
  if (direction === 'left') {
    currentPosition.x -= 1;
  } else if (direction === 'right') {
    currentPosition.x += 1;
  } else if (direction === 'down') {
    currentPosition.y += 1;
  }
  drawShape(currentShape);
}

function checkCollision(shape) {
  return shape.some((row, y) => {
    return row.some((cell, x) => {
      if (cell) {
        const xPos = currentPosition.x + x;
        const yPos = currentPosition.y + y;
        return yPos >= rows || xPos < 0 || xPos >= columns || boardArray[yPos] && boardArray[yPos][xPos];
      }
      return false;
    });
  });
}

function placeShape() {
  currentShape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        const xPos = currentPosition.x + x;
        const yPos = currentPosition.y + y;
        boardArray[yPos][xPos] = 1;
        const cellElement = document.querySelector(`[data-x="${xPos}"][data-y="${yPos}"]`);
        if (cellElement) {
          cellElement.classList.remove('falling');
          cellElement.classList.add('fixed');
        }
      }
    });
  });

  currentPosition = { x: 4, y: 0 };
  currentShape = getRandomShape();
  if (checkCollision(currentShape)) {
    alert('Game Over');
    resetGame();
  }
}

function getRandomShape() {
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  return shape;
}

function clearLines() {
  for (let y = rows - 1; y >= 0; y--) {
    if (boardArray[y].every(cell => cell === 1)) {
      score += 100;
      scoreDisplay.textContent = score;
      boardArray.splice(y, 1);
      boardArray.unshift(Array(columns).fill(0));
      drawBoard();
    }
  }
}

function drawBoard() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
      if (boardArray[y][x] === 1) {
        cell.classList.add('fixed');
      } else {
        cell.classList.remove('fixed');
      }
    }
  }
}

function gameLoop() {
  clearShape(currentShape);
  moveShape('down');
  if (checkCollision(currentShape)) {
    placeShape();
    clearLines();
  } else {
    drawShape(currentShape);
  }
}

function handleKeyPress(event) {
  if (event.key === 'ArrowLeft') {
    moveShape('left');
  } else if (event.key === 'ArrowRight') {
    moveShape('right');
  } else if (event.key === 'ArrowDown') {
    moveShape('down');
  } else if (event.key === 'ArrowUp') {
    const rotatedShape = rotateShape(currentShape);
    if (!checkCollision(rotatedShape)) {
      currentShape = rotatedShape;
      clearShape(currentShape);
      drawShape(currentShape);
    }
  }
}

function resetGame() {
  boardArray = Array.from({ length: rows }, () => Array(columns).fill(0));
  score = 0;
  scoreDisplay.textContent = score;
  drawBoard();
  currentShape = getRandomShape();
}

createBoard();
currentShape = getRandomShape();
drawShape(currentShape);
setInterval(gameLoop, 500);
window.addEventListener('keydown', handleKeyPress);
