"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log = require('ololog').configure({
    locate: false
});
const app_1 = __importDefault(require("./app"));
const Greeter_1 = __importDefault(require("./Greeter"));
const PORT = 7000;
app_1.default.listen(PORT, function () {
    let greeter1 = new Greeter_1.default('greeter1');
    greeter1.greet();
    log.yellow('Express server listening on port ', PORT);
});
//# sourceMappingURL=server.js.map