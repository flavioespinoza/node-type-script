"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log = require('ololog').configure({
    locate: false
});
const app_1 = require("./app");
const Greeter_1 = require("./Greeter");
const PORT = 7000;
app_1.default.listen(PORT, function () {
    let greeter1 = new Greeter_1.default('greeter1');
    greeter1.greet();
    log.yellow('Express server listening on port ', PORT);
});
//# sourceMappingURL=server.js.map