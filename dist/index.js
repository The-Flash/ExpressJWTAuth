"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtAuth = exports.JWTStrategy = exports.authenticate = exports.refreshToken = exports.getToken = void 0;
const controllers_1 = require("./controllers");
Object.defineProperty(exports, "getToken", { enumerable: true, get: function () { return controllers_1.getToken; } });
Object.defineProperty(exports, "refreshToken", { enumerable: true, get: function () { return controllers_1.refreshToken; } });
Object.defineProperty(exports, "authenticate", { enumerable: true, get: function () { return controllers_1.authenticate; } });
class JWTStrategy {
    constructor(options) {
        this.options = options;
    }
}
exports.JWTStrategy = JWTStrategy;
function jwtAuth(options) {
    if (!options.algorithm) {
        options["algorithm"] = "HS256";
    }
    if (!options.accessTokenLifetime) {
        options["accessTokenLifetime"] = "";
    }
    if (!options.refreshTokenLifetime) {
        options["refreshTokenLifetime"] = "";
    }
    if (!options.signingKey) {
        options["signingKey"] = "";
    }
    if (!options.rotateRefresh) {
        options["rotateRefresh"] = true;
    }
    return function (req, res, next) {
        req.jwtAuthOptions = Object.create(options);
        next();
    };
}
exports.jwtAuth = jwtAuth;
