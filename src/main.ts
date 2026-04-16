// 1. Define the Win Logic
function checkWin(board) {
    const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (let line of lines) {
        const [a, b, c] = line;
        if (board[a] !== 0 && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; 
        }
    }
    return 0;
}

// 2. Define the Match Handler functions directly
function matchInit(ctx, logger, nk, params) {
    return {
        state: { board: Array(9).fill(0), marks: 0, winner: 0, nextPlayer: 1, presences: {} },
        tickRate: 1,
        label: ""
    };
}

function matchJoinAttempt(ctx, logger, nk, dispatcher, tick, state, presence, metadata) {
    return { state, accept: true };
}

function matchJoin(ctx, logger, nk, dispatcher, tick, state, presences) {
    presences.forEach(function(p) {
        if (!state.presences[p.userId]) {
            state.presences[p.userId] = Object.keys(state.presences).length + 1;
        }
    });
    return { state };
}

function matchLoop(ctx, logger, nk, dispatcher, tick, state, messages) {
    messages.forEach(function(m) {
        var data = JSON.parse(nk.binaryToString(m.data));
        var playerNumber = state.presences[m.sender.userId];
        if (m.opCode === 1) {
            if (playerNumber === state.nextPlayer && state.board[data.position - 1] === 0 && state.winner === 0) {
                state.board[data.position - 1] = state.nextPlayer;
                state.marks++;
                var winner = checkWin(state.board);
                if (winner !== 0) { state.winner = winner; }
                else if (state.marks === 9) { state.winner = 3; }
                else { state.nextPlayer = state.nextPlayer === 1 ? 2 : 1; }
                dispatcher.broadcastMessage(1, JSON.stringify(state));
            }
        }
        if (m.opCode === 2) {
            state.board = Array(9).fill(0);
            state.marks = 0; state.winner = 0; state.nextPlayer = 1;
            dispatcher.broadcastMessage(1, JSON.stringify(state));
        }
    });
    return { state };
}

function matchLeave(ctx, logger, nk, dispatcher, tick, state, presences) { return { state }; }
function matchTerminate(ctx, logger, nk, dispatcher, tick, state, graceSeconds) { return { state }; }
function matchSignal(ctx, logger, nk, dispatcher, tick, state, data) { return { state, data }; }

// 3. The Initializer
function InitModule(ctx, logger, nk, initializer) {
    // We register by passing the function objects directly
    initializer.registerMatch("tictactoe", {
        init: matchInit,
        joinAttempt: matchJoinAttempt,
        join: matchJoin,
        leave: matchLeave,
        loop: matchLoop,
        terminate: matchTerminate,
        signal: matchSignal
    });

    initializer.registerMatchmakerMatched(function(ctx, logger, nk, matched) {
        return nk.matchCreate("tictactoe");
    });

    logger.info("Tic Tac Toe Module & Matchmaker Loaded Successfully!");
}