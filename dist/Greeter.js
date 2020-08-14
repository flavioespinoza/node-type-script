"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const is_email_1 = require("./is-email");
const uuidv4 = require('uuid/v4');
class User {
    constructor(username, email) {
        this.username = username;
        this.id = uuidv4();
        if (is_email_1._isEmail(email)) {
            this.email = email;
            this.details = {
                message: 'User created successfully!',
                subMessage: 'All is well'
            };
            this.info = {
                success: true,
                id: this.id,
                username: this.username,
                email: this.email,
                details: this.details
            };
        }
        else {
            this.email = null;
            this.details = {
                message: `Email entered is invalid: ${email}`,
                subMessage: 'Must match pattern: youremail@emailprovider.com'
            };
            this.info = {
                success: false,
                id: null,
                username: this.username,
                email: this.email,
                details: this.details
            };
        }
    }
    _info() {
        return this.info;
    }
}
exports.User = User;
class Greeter {
    constructor(message) {
        this.greeting = message;
    }
    greet() {
        return 'Hello, ' + this.greeting;
    }
}
exports.default = Greeter;
//# sourceMappingURL=Greeter.js.map