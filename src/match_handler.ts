let matchInit = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, params: {[key: string]: string}) {
    return {
        state: {
            board: Array(9).fill(0),
            marks: 0,
            winner: 0,
            nextPlayer: 1,
            presences: {} as {[userId: string]: nkruntime.Presence}
        },
        tickRate: 1, // 1 tick per second
        label: ""
    };
};

let matchJoinAttempt = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: nkruntime.MatchState, presence: nkruntime.Presence, metadata: {[key: string]: string}) {
    return { state, accept: true };
};

let matchJoin = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: any, presences: nkruntime.Presence[]) {
    presences.forEach((p) => {
        state.presences[p.userId] = p;
    });
    return { state };
};

let matchLoop = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: any, messages: nkruntime.MatchData[]) {
    messages.forEach((m) => {
        const data = JSON.parse(new TextDecoder().decode(m.data));
        // Opcode 1 = Make Move
        if (m.opCode === 1 && state.board[data.position - 1] === 0 && state.winner === 0) {
            state.board[data.position - 1] = state.nextPlayer;
            state.nextPlayer = state.nextPlayer === 1 ? 2 : 1;
            // Broadcast the new state to everyone
            dispatcher.broadcastMessage(1, JSON.stringify(state));
        }
    });
    return { state };
};

let matchLeave = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: any, presences: nkruntime.Presence[]) {
    return { state };
};

let matchTerminate = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: any, graceSeconds: number) {
    return { state };
};

let matchSignal = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: any, data: string) {
    return { state, data };
};