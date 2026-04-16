function InitModule(ctx: any, logger: any, nk: any, initializer: any) {
    logger.info("Tic Tac Toe Module Loaded Successfully!");
}

// This line is the "magic" that Nakama needs instead of 'exports'
// @ts-ignore
initializer.registerRpc("healthcheck", () => JSON.stringify({status: "ok"}));