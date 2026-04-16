// --- DIRECT FUNCTION DECLARATIONS ---

function matchInit(ctx, logger, nk, params) {
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
}

function matchJoinAttempt(ctx, logger, nk, dispatcher, tick, state, presence, metadata) {
    return { state, accept: true };
}

function matchJoin(ctx, logger, nk, dispatcher, tick, state, presences) {
    presences.forEach(function(p) {
        state.presences[p.userId] = p;
    });
    return { state };
}

function matchLoop(ctx, logger, nk, dispatcher, tick, state, messages) {
    messages.forEach(function(m) {
        var data = JSON.parse(nk.binaryToString(m.data));
        if (m.opCode === 1 && state.board[data.position - 1] === 0 && state.winner === 0) {
            state.board[data.position - 1] = state.nextPlayer;
            state.nextPlayer = state.nextPlayer === 1 ? 2 : 1;
            dispatcher.broadcastMessage(1, JSON.stringify(state));
        }
    });
    return { state };
}

function matchLeave(ctx, logger, nk, dispatcher, tick, state, presences) {
    return { state };
}

function matchTerminate(ctx, logger, nk, dispatcher, tick, state, graceSeconds) {
    return { state };
}

function matchSignal(ctx, logger, nk, dispatcher, tick, state, data) {
    return { state, data };
}

// --- INITIALIZER AT THE BOTTOM ---

function InitModule(ctx, logger, nk, initializer) {
    initializer.registerMatch("tictactoe", {
        init:          matchInit,          // Key must be 'init'
        joinAttempt:   matchJoinAttempt,   // Key must be 'joinAttempt'
        join:          matchJoin,          // Key must be 'join'
        leave:         matchLeave,         // Key must be 'leave'
        loop:          matchLoop,          // Key must be 'loop'
        terminate:     matchTerminate,     // Key must be 'terminate'
        signal:        matchSignal,        // Key must be 'signal'
    });

    initializer.registerMatchmakerMatched(function(ctx, logger, nk, matched) {
        return nk.matchCreate("tictactoe");
    });

    logger.info("Tic Tac Toe Module & Matchmaker Loaded Successfully!");
}