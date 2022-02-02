"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenFromString = exports.extractPayload = void 0;
const extractPayload = (user, fields) => {
    const payload = {};
    if (!user)
        return payload;
    fields.forEach((key) => {
        payload[key] = user[key];
    });
    return payload;
};
exports.extractPayload = extractPayload;
const getTokenFromString = (tokenString) => {
    /**
    @params {
        tokenString: Bearer token
    }
    @return token
    */
    try {
        return tokenString.split(" ")[1].trim();
    }
    catch (err) {
        return null;
    }
};
exports.getTokenFromString = getTokenFromString;
