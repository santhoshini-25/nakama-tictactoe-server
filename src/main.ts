function InitModule(ctx: any, logger: any, nk: any, initializer: any) {
    // 1. Log that we are alive
    logger.info("Tic Tac Toe Module Loaded Successfully!");

    // 2. Register a simple healthcheck function so we can test it
    initializer.registerRpc("healthcheck", () => {
        return JSON.stringify({ status: "ok" });
    });
}