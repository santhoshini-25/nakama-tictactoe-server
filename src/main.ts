function InitModule(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, initializer: nkruntime.Initializer) {
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

    // 2. Register the Matchmaker (Pausing two players)
    initializer.registerMatchmakerMatched((ctx, logger, nk, matched) => {
        // When 2 players are found, start a match using the 'tictactoe' logic
        return nk.matchCreate("tictactoe");
    });

    logger.info("Tic Tac Toe Module & Matchmaker Loaded!");
}