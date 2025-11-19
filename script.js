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

        if (board[row][column] === '') board[row][column].addToken(player);
    }
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    }
    return { getBoard, addPlayerMark, printBoard };
})();

function Cell() {
    let value = '';
    const addToken = (player) => {
        value = player.mark;
    }
    const getValue = () => value;
    return { addToken, getValue };
}

function Player(name) {
    let mark = '';
    return { name, mark };

}
function GameController() {
    let playerOne = Player("PlayerOne");
    playerOne.mark = 'X';
    let playerTwo = Player("PlayerTwo")
    playerTwo.mark = 'O';


    let activePlayer = playerOne;
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        Gameboard.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);

    };
    const playRound = (row, column) => {
        console.log(
            `InSerting ${getActivePlayer().name}'s Mark into row ${row} column ${column}...`
        );
        Gameboard.addPlayerMark(row, column, getActivePlayer().mark);

        /*  This is where we would check for a winner and handle that logic,
            such as a win message. */

        // Switch player turn
        switchPlayerTurn();
        printNewRound();
    };
    printNewRound();
    return {
        playRound,
        getActivePlayer
    };
}