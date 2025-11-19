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

        if (board[row][column].getValue() === '') board[row][column].addToken(player);
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
    playerOne.mark = "X";
    let playerTwo = Player("PlayerTwo")
    playerTwo.mark = "O";


    let activePlayer = playerOne;
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        Gameboard.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
        console.log(`${getActivePlayer().mark}`);

    };
    const playRound = (row, column) => {
        console.log(
            `InSerting ${getActivePlayer().name}'s Mark into row ${row} column ${column}...`
        );
        Gameboard.addPlayerMark(row, column, getActivePlayer());

        let ticBoard = Gameboard.getBoard();
        

        // Switch player turn
        switchPlayerTurn();
        printNewRound();
    };
    printNewRound();
    return {
        playRound,
        getActivePlayer,
        getBoard : Gameboard.getBoard(),    };
}
const game = GameController();
game.playRound(0,2);
game.playRound(0,0)