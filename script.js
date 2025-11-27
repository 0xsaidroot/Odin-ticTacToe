function Gameboard() {
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
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };
    const resetBoard = () => {
        board.map((row) => row.map((cell) => cell.clearCell()))
    }

    return { getBoard, addPlayerMark, printBoard, resetBoard, };
};


function Cell() {
    let value = "";

    const addToken = (player) => {
        value = player.mark;
    };
    const getValue = () => value;
    const clearCell = () => {
        value = "";
    }
    return {
        addToken,
        getValue,
        clearCell,
    };
}
function Player(name) {
    let mark = '';
    return { name, mark }
}

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    let playerOne = Player(playerOneName);
    playerOne.mark = 'X'
    let playerTwo = Player(playerTwoName);
    playerTwo.mark = 'O';

    let board = Gameboard();

    let winnerMark = null;
    let winnerPlayer;
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

    let activePlayer = playerOne;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
        console.log(`${getActivePlayer().mark}'s Mark.`);
    };
    function checkWinner() {
        let gameBoard = board.getBoard();

        for (let line of winningLines) {
            const [[r1, c1], [r2, c2], [r3, c3]] = line;
            const v1 = gameBoard[r1][c1].getValue();
            const v2 = gameBoard[r2][c2].getValue();
            const v3 = gameBoard[r3][c3].getValue();

            if (v1 !== '' && v1 === v2 && v2 === v3) {
                return v1; // 'X' or 'O'
            }
        }

        const isFull = gameBoard.every(row =>
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
        let moveMade = board.addPlayerMark(row, column, getActivePlayer());
        if (!moveMade) return;

        let result = checkWinner();

        if (result === 'X' || result === 'O') {
            gameOver = true;
            winnerMark = result;
            winnerPlayer = (result === 'X') ? playerOne : playerTwo;
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
    const getWinnerPlayer = () => winnerPlayer;
    const resetGame = () => {
        gameOver = false;
        winnerMark = "";
        isDraw = false;
        activePlayer = playerOne;
        board.resetBoard();
    };

    return {
        playRound,
        getActivePlayer,
        getGameOver,
        getWinnerMark,
        getIsDraw,
        getWinnerPlayer,
        resetGame,
        getBoard: board.getBoard,
    };
}
function ScreenController() {
    let game;
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const introContainer = document.querySelector('.intro-screen');
    const gameContainer = document.querySelector('.game-screen');
    const playerOneNAME = document.querySelector('#playerOne');
    const playerTwoNAME = document.querySelector('#playerTwo');
    const start_btn = document.querySelector('#startBtn');
    const playAgain_btn = document.querySelector('#playAgainBtn');
    const dialogBox = document.querySelector("dialog");
    const dialogText = document.querySelector('#text');

    const showDialog = (show) => {
        if (!dialogBox) return; 

        if (show) {
            if (!dialogBox.open) dialogBox.showModal();
        } else {
            if (dialogBox.open) dialogBox.close();
        }
    };


    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
        const gameOver = game.getGameOver();
        const isDraw = game.getIsDraw();
        const winnerPlayer = game.getWinnerPlayer();
        const winnerMark = game.getWinnerMark();


        if (gameOver) {
            showDialog(true);
            if (isDraw) {
                playerTurnDiv.textContent = "It's a Draw!";
                dialogText.textContent = "It's a Draw!";
            } else {
                playerTurnDiv.textContent = `${winnerPlayer.name} wins!`;
                dialogText.textContent = `${winnerPlayer.name} ${winnerMark} wins!`;
            }
        } else {
            playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
            showDialog(false);
        }


        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {

                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");

                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = colIndex;
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })
    }

    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;
        if (!selectedColumn) return;

        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }

    function clickHandlerStartBtn() {
        let p1Name = (playerOneNAME.value !== "") ? playerOneNAME.value : 'Player One';
        let p2Name = (playerTwoNAME.value !== "") ? playerTwoNAME.value : 'Player Two';
        game = GameController(p1Name, p2Name);

        introContainer.style.display = 'none';
        gameContainer.style.display = 'block';
  
        updateScreen();
        boardDiv.addEventListener("click", clickHandlerBoard);
    }

    playAgain_btn.addEventListener("click", () => {
        // showDialog(false);
        game.resetGame();
        updateScreen();
    });

    start_btn.addEventListener('click', clickHandlerStartBtn);

}

ScreenController();
