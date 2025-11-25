const Gameboard = (function () {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }
    const getBoard = () => board;

    const addPlayerMark = (row, column, player) => {
        if (board[row][column].getValue() === "") {
            board[row][column].addToken(player);
            return true;
        }
        return false;
    };
    const printBoard = () => {
        const boardWithCellValues = board.map((row) =>
            row.map((cell) => cell.getValue())
        );
        console.log(boardWithCellValues);
    };
    return { getBoard, addPlayerMark, printBoard };
})();

function Cell() {
    let value = "";
    const addToken = (player) => {
        value = player.mark;
    };
    const getValue = () => value;
    return { addToken, getValue };
}

function Player(name) {
    let mark = "";
    return { name, mark };
}
function GameController(p1Name = "Player One",p2Name = "Player Two") {
    let playerOne = Player(p1Name);
    playerOne.mark = "X";
    let playerTwo = Player(p2Name);
    playerTwo.mark = "O";

    let activePlayer = playerOne;
    let winnerMark = null;
    let isDraw = false;
    let gameOver = false;
    const winningLines = [
        // rows
        [
            [0, 0],
            [0, 1],
            [0, 2],
        ],
        [
            [1, 0],
            [1, 1],
            [1, 2],
        ],
        [
            [2, 0],
            [2, 1],
            [2, 2],
        ],

        // columns
        [
            [0, 0],
            [1, 0],
            [2, 0],
        ],
        [
            [0, 1],
            [1, 1],
            [2, 1],
        ],
        [
            [0, 2],
            [1, 2],
            [2, 2],
        ],

        // diagonals
        [
            [0, 0],
            [1, 1],
            [2, 2],
        ],
        [
            [0, 2],
            [1, 1],
            [2, 0],
        ],
    ];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        Gameboard.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
        console.log(`${getActivePlayer().mark}`);
    };
    function checkWinner() {
        let board = Gameboard.getBoard();

        for (let line of winningLines) {
            const [[r1, c1], [r2, c2], [r3, c3]] = line;
            const v1 = board[r1][c1].getValue();
            const v2 = board[r2][c2].getValue();
            const v3 = board[r3][c3].getValue();

            if (v1 !== '' && v1 === v2 && v2 === v3) {
                return v1; // 'X' or 'O'
            }
        }

        const isFull = board.every(row =>
            row.every(cell => cell.getValue() !== '')
        );
        if (isFull) return 'draw';

        return null;
    }

    const playRound = (row, column) => {

        if (gameOver) return;

        console.log(
            `InSerting ${getActivePlayer().name
            }'s Mark into row ${row} column ${column}...`
        );
        let moveWasMade = Gameboard.addPlayerMark(row, column, getActivePlayer());
        if (!moveWasMade) return;

        const result = checkWinner();

        if (result === 'X' || result === 'O') {
            gameOver = true;
            winnerMark = result;
            console.log(`${result} wins!`);
            return;
        }

        if (result === 'draw') {
            isDraw = true;
            gameOver = true;
            console.log("It's a draw!");
            return;
        }

        switchPlayerTurn();
        printNewRound();
    };
    printNewRound();
    const getGameOver = () => gameOver;
    const getWinnerMark = () => winnerMark;
    const getIsDraw = () => isDraw;
    return {
        playRound,
        getActivePlayer,
        getBoard: Gameboard.getBoard,
        getGameOver,
        getIsDraw,
        getWinnerMark,
    };
}
function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");

    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
        const gameOver = game.getGameOver();
        const isDraw = game.getIsDraw();
        const winnerMark = game.getWinnerMark();


        if (gameOver) {
            if (isDraw) {
                playerTurnDiv.textContent = "It's a Draw!";
            } else if (winnerMark === 'X') {
                playerTurnDiv.textContent = "PlayerOne wins!";
            } else {
                playerTurnDiv.textContent = "PlayerTwo wins!";
            }
        }else{
        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
        }


        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");

                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = colIndex;
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            });
        });
    };

    function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;

        if (!selectedColumn || !selectedRow) return;

        game.playRound(Number(selectedRow), Number(selectedColumn));
        updateScreen();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);

    updateScreen();
}

ScreenController();
