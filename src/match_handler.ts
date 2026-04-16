let matchInit = function (ctx: any, logger: any, nk: any, params: any) {
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

let matchJoinAttempt = function (ctx: any, logger: any, nk: any, dispatcher: any, tick: number, state: any, presence: any, metadata: any) {
    return { state, accept: true };
};

let matchJoin = function (ctx: any, logger: any, nk: any, dispatcher: any, tick: number, state: any, presences: any[]) {
    presences.forEach((p) => {
        state.presences[p.userId] = p;
    });
    return { state };
};

let matchLoop = function (ctx: any, logger: any, nk: any, dispatcher: any, tick: number, state: any, messages: any[]) {
    messages.forEach((m) => {
        const data = JSON.parse(new TextDecoder().decode(m.data));
        if (m.opCode === 1 && state.board[data.position - 1] === 0 && state.winner === 0) {
            state.board[data.position - 1] = state.nextPlayer;
            state.nextPlayer = state.nextPlayer === 1 ? 2 : 1;
            dispatcher.broadcastMessage(1, JSON.stringify(state));
        }
    });
    return { state };
};

let matchLeave = function (ctx: any, logger: any, nk: any, dispatcher: any, tick: number, state: any, presences: any[]) {
    return { state };
};

let matchTerminate = function (ctx: any, logger: any, nk: any, dispatcher: any, tick: number, state: any, graceSeconds: number) {
    return { state };
};

let matchSignal = function (ctx: any, logger: any, nk: any, dispatcher: any, tick: number, state: any, data: string) {
    return { state, data };
};