var liveServer = require("live-server");

// DODO: implement your own watch function.
var params = {
    port: 4000, // Set the server port. Defaults to 8080.
    host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
    root: process.cwd(), // Set root directory that's being served. Defaults to cwd.
    open: false, // When false, it won't load your browser by default.
    ignore: 'scss', // comma-separated string for paths to ignore
    file: "index.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
    wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
    logLevel: 2 // 0 = errors only, 1 = some, 2 = lots
};
liveServer.start(params);
