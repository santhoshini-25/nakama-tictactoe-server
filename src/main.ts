function InitModule(ctx: any, logger: any, nk: any, initializer: any) {
    // 1. Register the Game Logic
    initializer.registerMatch("tictactoe", {
        init: matchInit,
        joinAttempt: matchJoinAttempt,
        join: matchJoin,
        leave: matchLeave,
        loop: matchLoop,
        terminate: matchTerminate,
        signal: matchSignal,
    });

    // 2. Register the Matchmaker
    initializer.registerMatchmakerMatched((ctx: any, logger: any, nk: any, matched: any) => {
        return nk.matchCreate("tictactoe");
    });

    logger.info("Tic Tac Toe Module & Matchmaker Loaded!");
}