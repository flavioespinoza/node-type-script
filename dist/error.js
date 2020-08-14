"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._error = void 0;
require('ansicolor').nice;
const log = require('ololog').configure({ locate: false });
function _error(method, err) {
    log.lightYellow(`${method} ERROR:`, err.message);
}
exports._error = _error;
//# sourceMappingURL=error.js.map