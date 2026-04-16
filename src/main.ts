// 1. Win Logic Helper
function checkWin(board) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    for (let line of lines) {
        const [a, b, c] = line;
        if (board[a] !== 0 && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; 
        }
    }
    return 0;
}

// 2. Match Handler Functions
var matchInit = function(ctx, logger, nk, params) {
    return {
        state: {
            board: Array(9).fill(0),
            marks: 0,
            winner: 0,
            nextPlayer: 1,
            presences: {} // This will store { "userId": playerNumber }
        },
        tickRate: 1,
        label: ""
    };
};

var matchJoinAttempt = function(ctx, logger, nk, dispatcher, tick, state, presence, metadata) {
    return { state: state, accept: true };
};

var matchJoin = function(ctx, logger, nk, dispatcher, tick, state, presences) {
    presences.forEach(function(p) {
        // Assign first joining player as 1, second as 2
        if (!state.presences[p.userId]) {
            state.presences[p.userId] = Object.keys(state.presences).length + 1;
        }
    });
    return { state: state };
};

var matchLoop = function(ctx, logger, nk, dispatcher, tick, state, messages) {
    messages.forEach(function(m) {
        var data = JSON.parse(nk.binaryToString(m.data));
        var playerNumber = state.presences[m.sender.userId];

        // Opcode 1: Make Move
        if (m.opCode === 1) {
            // VALIDATION:
            // 1. Is it this player's turn?
            // 2. Is the tile empty?
            // 3. Is the game still active (no winner)?
            if (playerNumber === state.nextPlayer && state.board[data.position - 1] === 0 && state.winner === 0) {
                state.board[data.position - 1] = state.nextPlayer;
                state.marks++;

                var winner = checkWin(state.board);
                if (winner !== 0) {
                    state.winner = winner;
                } else if (state.marks === 9) {
                    state.winner = 3; // Draw
                } else {
                    state.nextPlayer = state.nextPlayer === 1 ? 2 : 1;
                }
                dispatcher.broadcastMessage(1, JSON.stringify(state));
            }
        }

        // Opcode 2: Play Again (Reset)
        if (m.opCode === 2) {
            state.board = Array(9).fill(0);
            state.marks = 0;
            state.winner = 0;
            state.nextPlayer = 1;
            dispatcher.broadcastMessage(1, JSON.stringify(state));
        }
    });
    return { state: state };
};

var matchLeave = function(ctx, logger, nk, dispatcher, tick, state, presences) {
    return { state: state };
};

var matchTerminate = function(ctx, logger, nk, dispatcher, tick, state, graceSeconds) {
    return { state: state };
};

var matchSignal = function(ctx, logger, nk, dispatcher, tick, state, data) {
    return { state: state, data: data };
};

var matchmakerMatched = function(ctx, logger, nk, matched) {
    return nk.matchCreate("tictactoe");
};

// 3. The Registration Initializer (Always at the very bottom)
function InitModule(ctx, logger, nk, initializer) {
    initializer.registerMatch("tictactoe", {
        init:          matchInit,
        joinAttempt:   matchJoinAttempt,
        join:          matchJoin,
        leave:         matchLeave,
        loop:          matchLoop,
        terminate:     matchTerminate,
        signal:        matchSignal
    });

    initializer.registerMatchmakerMatched(matchmakerMatched);
    logger.info("Tic Tac Toe Module & Matchmaker Loaded Successfully!");
}