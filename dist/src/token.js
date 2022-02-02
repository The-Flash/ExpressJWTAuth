"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenGenerator = exports.RefreshToken = exports.AccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class TokenBase {
}
class AccessToken extends TokenBase {
    constructor() {
        super();
        this.type = "access";
    }
}
exports.AccessToken = AccessToken;
class RefreshToken extends TokenBase {
    constructor() {
        super();
        this.type = "refresh";
    }
}
exports.RefreshToken = RefreshToken;
class TokenGenerator {
    static verify(token, secretKey, tokenType) {
        try {
            const payload = jsonwebtoken_1.default.verify(token, secretKey);
            if (typeof payload !== "string") {
                if (payload.type === tokenType.type) {
                    return payload;
                }
            }
            return null;
        }
        catch (e) {
            return null;
        }
    }
    static generateToken(payload, tokenType, options) {
        payload = Object.assign(Object.assign({}, payload), { type: tokenType.type });
        let expiresIn;
        if (tokenType instanceof RefreshToken) {
            expiresIn = options.refreshTokenLifetime;
        }
        else {
            expiresIn = options.accessTokenLifetime;
        }
        const token = jsonwebtoken_1.default.sign(payload, options.signingKey, {
            expiresIn,
            algorithm: options.algorithm,
        });
        return token;
    }
}
exports.TokenGenerator = TokenGenerator;
