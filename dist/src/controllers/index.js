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
exports.authenticate = exports.refreshToken = exports.getToken = void 0;
const status_codes_1 = require("../status_codes");
const token_1 = require("../token");
const utils_1 = require("../utils");
function getToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { strategy } = req.jwtAuthOptions;
        const { identifier, getUser, payloadFields, responseExtras } = strategy.options;
        const username = req.body;
        const password = req.body;
        const user = yield getUser(username, password);
        if (!user) {
            res.status(status_codes_1.HTTP_UNAUTHORIZED).json({
                details: "Incorrect credentials"
            });
        }
        const payload = (0, utils_1.extractPayload)(user, [identifier, ...payloadFields]);
        const accessToken = token_1.TokenGenerator.generateToken(payload, new token_1.AccessToken(), req.jwtAuthOptions);
        const refreshToken = token_1.TokenGenerator.generateToken(payload, new token_1.RefreshToken(), req.jwtAuthOptions);
        let response = {
            "access": accessToken,
            "refresh": refreshToken
        };
        if (responseExtras) {
            const extras = yield responseExtras(user[identifier]);
            response = Object.assign(Object.assign({}, response), extras);
        }
        return res.status(status_codes_1.HTTP_OK).json(response);
    });
}
exports.getToken = getToken;
function refreshToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { refresh } = req.body;
        if (!refresh) {
            return res.status(status_codes_1.HTTP_BAD_REQUEST).json({
                details: "Missing refresh token"
            });
        }
        const { strategy, signingKey } = req.jwtAuthOptions;
        const { identifier, getUserById, payloadFields, responseExtras } = strategy.options;
        const fields = [identifier, ...payloadFields];
        const payloadFromJWT = token_1.TokenGenerator.verify(refresh, signingKey, new token_1.RefreshToken());
        if (!payloadFromJWT) {
            return res.status(status_codes_1.HTTP_UNAUTHORIZED).json({
                details: "Incorrect credentials"
            });
        }
        const payload = (0, utils_1.extractPayload)(payloadFromJWT, fields);
        const accessToken = token_1.TokenGenerator.generateToken(payload, new token_1.AccessToken(), req.jwtAuthOptions);
        const refreshToken = token_1.TokenGenerator.generateToken(payload, new token_1.RefreshToken(), req.jwtAuthOptions);
        const user = yield getUserById(payload[identifier]);
        if (!user) {
            return res.status(status_codes_1.HTTP_UNAUTHORIZED).json({
                details: "Incorrect credentials"
            });
        }
        let response = {
            "access": accessToken
        };
        if (req.jwtAuthOptions.rotateRefresh === true) {
            response = Object.assign(Object.assign({}, response), { "refresh": refreshToken });
        }
        if (responseExtras) {
            const extras = yield responseExtras(user[identifier]);
            response = Object.assign(Object.assign({}, response), extras);
        }
        return res.status(status_codes_1.HTTP_OK).json(response);
    });
}
exports.refreshToken = refreshToken;
function authenticate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { strategy, signingKey } = req.jwtAuthOptions;
        const { identifier, getUserById } = strategy.options;
        const accessToken = (0, utils_1.getTokenFromString)(req.headers.authorization);
        if (!accessToken) {
            return res.status(status_codes_1.HTTP_BAD_REQUEST).json({
                details: "bad authorization header"
            });
        }
        const payload = token_1.TokenGenerator.verify(accessToken, signingKey, new token_1.AccessToken());
        if (!payload) {
            return res.status(status_codes_1.HTTP_UNAUTHORIZED).json({
                details: "Incorrect credentials"
            });
        }
        const user = yield getUserById(payload[identifier]);
        if (!user) {
            return res.status(status_codes_1.HTTP_UNAUTHORIZED).json({
                details: "Incorrect credentials"
            });
        }
        req.user = user;
        next();
    });
}
exports.authenticate = authenticate;
