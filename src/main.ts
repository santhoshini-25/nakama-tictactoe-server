var matchInit = function(ctx, logger, nk, params) {
    logger.info("Match Init Triggered");
    return {
        state: {
            board: Array(9).fill(0),
            marks: 0,
            winner: 0,
            nextPlayer: 1,
            presences: {}
        },
        tickRate: 1,
        label: ""
    };
};

var matchJoinAttempt = function(ctx, logger, nk, dispatcher, tick, state, presence, metadata) {
    return { state: state, accept: true };
};

var matchJoin = function(ctx, logger, nk, dispatcher, tick, state, presences) {
    for (var i = 0; i < presences.length; i++) {
        state.presences[presences[i].userId] = presences[i];
    }
    return { state: state };
};

// --- Add this Win Detection helper ---
function checkWin(board) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    for (let line of lines) {
        const [a, b, c] = line;
        if (board[a] !== 0 && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // Returns 1 or 2
        }
    }
    return 0;
}

// --- Update your matchLoop ---
function matchLoop(ctx, logger, nk, dispatcher, tick, state, messages) {
    messages.forEach(function(m) {
        const data = JSON.parse(nk.binaryToString(m.data));

        // Opcode 1: Make Move
        if (m.opCode === 1) {
            // Only allow move if square is empty and no winner yet
            if (state.board[data.position - 1] === 0 && state.winner === 0) {
                state.board[data.position - 1] = state.nextPlayer;
                state.marks++;
                
                const winner = checkWin(state.board);
                if (winner !== 0) {
                    state.winner = winner;
                } else if (state.marks === 9) {
                    state.winner = 3; // 3 represents a DRAW
                } else {
                    state.nextPlayer = state.nextPlayer === 1 ? 2 : 1;
                }
                
                dispatcher.broadcastMessage(1, JSON.stringify(state));
            }
        }
        
        // Opcode 2: Play Again (Reset Board)
        if (m.opCode === 2) {
            state.board = Array(9).fill(0);
            state.marks = 0;
            state.winner = 0;
            state.nextPlayer = 1;
            dispatcher.broadcastMessage(1, JSON.stringify(state));
        }
    });
    return { state };
}

var matchLeave = function(ctx, logger, nk, dispatcher, tick, state, presences) {
    return { state: state };
};

var matchTerminate = function(ctx, logger, nk, dispatcher, tick, state, graceSeconds) {
    return { state: state };
};

var matchSignal = function(ctx, logger, nk, dispatcher, tick, state, data) {
    return { state: state, data: data };
};

// Must also be a named var, not an inline literal
var matchmakerMatched = function(ctx, logger, nk, matched) {
    return nk.matchCreate("tictactoe");
};

function InitModule(ctx, logger, nk, initializer) {
    initializer.registerMatch("tictactoe", {
        matchInit:        matchInit,
        matchJoinAttempt: matchJoinAttempt,
        matchJoin:        matchJoin,
        matchLeave:       matchLeave,
        matchLoop:        matchLoop,
        matchTerminate:   matchTerminate,
        matchSignal:      matchSignal
    });

    initializer.registerMatchmakerMatched(matchmakerMatched);

    logger.info("Tic Tac Toe Module & Matchmaker Loaded Successfully!");
}