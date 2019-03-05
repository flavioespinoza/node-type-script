"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("./error");
function _divide(a, b) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return a / b;
        }
        catch (err) {
            console.log('_divide', err);
        }
    });
}
exports._divide = _divide;
function _multiply(a, b) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return a * b;
        }
        catch (err) {
            error_1._error('_multiply', err);
        }
    });
}
exports._multiply = _multiply;
function _add(a, b) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return a + b;
        }
        catch (err) {
            error_1._error('_add', err);
        }
    });
}
exports._add = _add;
function _subtract(a, b) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return a - b;
        }
        catch (err) {
            error_1._error('_subtract', err);
        }
    });
}
exports._subtract = _subtract;
//# sourceMappingURL=async-math.js.map