// script.js
const chessBoard = document.getElementById('chessBoard');
const playerTurnDisplay = document.getElementById('playerTurn');
const restartButton = document.getElementById('restartButton');
const boardSize = 8;
let currentPlayer = 'white';
const pieces = {
    r: '♜', n: '♞', b: '♝', q: '♛', k: '♚', p: '♟',
    R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔', P: '♙'
};

// Create the chess board
function createBoard() {
    chessBoard.innerHTML = '';
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.classList.add((row + col) % 2 === 0 ? 'white' : 'black');
            cell.dataset.row = row;
            cell.dataset.col = col;
            chessBoard.appendChild(cell);
        }
    }
}

// Place the chess pieces
function placePieces() {
    const initialPositions = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        [],
        [],
        [],
        [],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ];

    for (let row = 0; row < initialPositions.length; row++) {
        for (let col = 0; col < initialPositions[row].length; col++) {
            if (initialPositions[row][col]) {
                const piece = document.createElement('div');
                piece.classList.add('piece');
                piece.classList.add(initialPositions[row][col] === initialPositions[row][col].toUpperCase() ? 'white' : 'black');
                piece.textContent = pieces[initialPositions[row][col]];
                piece.dataset.row = row;
                piece.dataset.col = col;
                piece.draggable = true;
                piece.addEventListener('dragstart', onDragStart);
                piece.addEventListener('dragend', onDragEnd);
                chessBoard.children[row * boardSize + col].appendChild(piece);
            }
        }
    }
}

function onDragStart(event) {
    if (event.target.classList.contains(currentPlayer)) {
        event.dataTransfer.setData('text/plain', event.target.textContent);
        event.dataTransfer.setData('text/row', event.target.dataset.row);
        event.dataTransfer.setData('text/col', event.target.dataset.col);
        event.target.classList.add('dragging');
    } else {
        event.preventDefault();
    }
}

function onDragEnd(event) {
    event.target.classList.remove('dragging');
}

function onDrop(event) {
    event.preventDefault();
    const piece = event.dataTransfer.getData('text/plain');
    const fromRow = event.dataTransfer.getData('text/row');
    const fromCol = event.dataTransfer.getData('text/col');
    const toCell = event.target.closest('.cell');
    const toRow = toCell.dataset.row;
    const toCol = toCell.dataset.col;

    // Move the piece
    const movingPiece = document.querySelector(
        `.piece[data-row='${fromRow}'][data-col='${fromCol}']`
    );
    movingPiece.dataset.row = toRow;
    movingPiece.dataset.col = toCol;
    toCell.appendChild(movingPiece);

    // Switch player
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
    playerTurnDisplay.textContent = `Turn: ${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}`;
}

function allowDrop(event) {
    event.preventDefault();
}

function restartGame() {
    currentPlayer = 'white';
    playerTurnDisplay.textContent = 'Turn: White';
    createBoard();
    placePieces();
}

document.addEventListener('DOMContentLoaded', () => {
    createBoard();
    placePieces();
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.addEventListener('dragover', allowDrop);
        cell.addEventListener('drop', onDrop);
    });
    restartButton.addEventListener('click', restartGame);
});