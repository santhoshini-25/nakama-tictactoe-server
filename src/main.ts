// --- DIRECT FUNCTION DECLARATIONS ---

function matchInit(ctx: any, logger: any, nk: any, params: any) {
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

function matchJoinAttempt(ctx: any, logger: any, nk: any, dispatcher: any, tick: number, state: any, presence: any, metadata: any) {
    return { state, accept: true };
}

function matchJoin(ctx: any, logger: any, nk: any, dispatcher: any, tick: number, state: any, presences: any[]) {
    presences.forEach((p) => { state.presences[p.userId] = p; });
    return { state };
}

function matchLoop(ctx: any, logger: any, nk: any, dispatcher: any, tick: number, state: any, messages: any[]) {
    messages.forEach((m) => {
        const data = JSON.parse(new TextDecoder().decode(m.data));
        if (m.opCode === 1 && state.board[data.position - 1] === 0 && state.winner === 0) {
            state.board[data.position - 1] = state.nextPlayer;
            state.nextPlayer = state.nextPlayer === 1 ? 2 : 1;
            dispatcher.broadcastMessage(1, JSON.stringify(state));
        }
    });
    return { state };
}

function matchLeave(ctx: any, logger: any, nk: any, dispatcher: any, tick: number, state: any, presences: any[]) {
    return { state };
}

function matchTerminate(ctx: any, logger: any, nk: any, dispatcher: any, tick: number, state: any, graceSeconds: number) {
    return { state };
}

function matchSignal(ctx: any, logger: any, nk: any, dispatcher: any, tick: number, state: any, data: string) {
    return { state, data };
}

// --- INITIALIZER AT THE BOTTOM ---

function InitModule(ctx: any, logger: any, nk: any, initializer: any) {
    // We pass the functions directly by name
    initializer.registerMatch("tictactoe", {
        init: matchInit,
        joinAttempt: matchJoinAttempt,
        join: matchJoin,
        leave: matchLeave,
        loop: matchLoop,
        terminate: matchTerminate,
        signal: matchSignal,
    });

    initializer.registerMatchmakerMatched((ctx: any, logger: any, nk: any, matched: any) => {
        return nk.matchCreate("tictactoe");
    });

    logger.info("Tic Tac Toe Module & Matchmaker Loaded Successfully!");
}