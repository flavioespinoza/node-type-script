"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._subtract = exports._add = exports._multiply = exports._divide = void 0;
const error_1 = require("./error");
exports._divide = (a, b) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return a / b;
    }
    catch (err) {
        console.log('_divide', err);
    }
});
exports._multiply = (a, b) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return a * b;
    }
    catch (err) {
        error_1._error('_multiply', err);
    }
});
exports._add = (a, b) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return a + b;
    }
    catch (err) {
        error_1._error('_add', err);
    }
});
exports._subtract = (a, b) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return a - b;
    }
    catch (err) {
        error_1._error('_subtract', err);
    }
});
//# sourceMappingURL=async-math.js.map