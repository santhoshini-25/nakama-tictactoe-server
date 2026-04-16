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

var matchLoop = function(ctx, logger, nk, dispatcher, tick, state, messages) {
    for (var i = 0; i < messages.length; i++) {
        var m = messages[i];
        var data = JSON.parse(nk.binaryToString(m.data));
        if (m.opCode === 1 && state.board[data.position - 1] === 0 && state.winner === 0) {
            state.board[data.position - 1] = state.nextPlayer;
            state.nextPlayer = state.nextPlayer === 1 ? 2 : 1;
            dispatcher.broadcastMessage(1, JSON.stringify(state));
        }
    }
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