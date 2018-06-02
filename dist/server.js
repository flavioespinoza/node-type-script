"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const log = require('ololog').configure({
    locate: false
});
const port = 8080;
app_1.default.listen(port, function () {
    log.yellow('Express server listening on port ', port);
});
//# sourceMappingURL=server.js.map