"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuidv4 = require('uuid/v4');
/**
 * @param {{class:NewUser}} New User Class Constructor
 * */
class NewUser {
    constructor(username, email) {
        this.id = uuidv4();
        this.username = username;
        this.email = email;
        this.info = {
            id: this.id,
            username: username,
            email: email
        };
    }
    _info() {
        return this.info;
    }
}
exports.default = NewUser;
//# sourceMappingURL=NewUser.js.map