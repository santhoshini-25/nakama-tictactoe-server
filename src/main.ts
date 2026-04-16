// 1. Define the function separately
function healthcheck(ctx: any, logger: any, nk: any, payload: string) {
    logger.info("Healthcheck RPC called");
    return JSON.stringify({ status: "ok" });
}

// 2. Register it by name inside InitModule
function InitModule(ctx: any, logger: any, nk: any, initializer: any) {
    logger.info("Tic Tac Toe Module Loaded Successfully!");

    // Pass the function name 'healthcheck' instead of writing it inline
    initializer.registerRpc("healthcheck", healthcheck);
}