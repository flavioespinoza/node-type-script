"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function _isEmail(search) {
    const EmailRegEx = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return EmailRegEx.test(search);
}
exports._isEmail = _isEmail;
//# sourceMappingURL=is-email.js.map