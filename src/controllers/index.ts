import { Request, NextFunction, Response } from "express";
import { HTTP_BAD_REQUEST, HTTP_OK, HTTP_UNAUTHORIZED } from "../status_codes";
import { AccessToken, RefreshToken, TokenGenerator } from "../token";
import { extractPayload, getTokenFromString } from "../utils";

export async function getToken(req: Request, res: Response) {
    const { strategy } = req.jwtAuthOptions;
    const { identifier, getUser, payloadFields } = strategy.options;
    const username: string = req.body;
    const password: string = req.body;
    const user = await getUser(username, password);
    if (!user) {
        res.status(HTTP_UNAUTHORIZED).json({
            details: "Incorrect credentials"
        })
    }
    const payload = extractPayload(user, [identifier, ...payloadFields]);
    const accessToken: string = TokenGenerator.generateToken(payload, new AccessToken(), req.jwtAuthOptions);
    const refreshToken: string = TokenGenerator.generateToken(payload, new RefreshToken(), req.jwtAuthOptions);

    let response = {
        "access": accessToken,
        "refresh": refreshToken
    }

    return res.json(response);
}

export async function refreshToken(req: Request, res: Response) {
    const { refresh } = req.body;
    if (!refresh) {
        return res.status(HTTP_BAD_REQUEST).json({
            details: "Missing refresh token"
        });
    }
    const { strategy, signingKey } = req.jwtAuthOptions;
    const { identifier, getUserById, payloadFields } = strategy.options;
    const fields = [identifier, ...payloadFields];
    const payloadFromJWT = TokenGenerator.verify(refresh, signingKey, new RefreshToken());
    if(!payloadFromJWT) {
        return res.status(HTTP_UNAUTHORIZED).json({
            details: "Incorrect credentials"
        });
    }
    const payload = extractPayload(payloadFromJWT, fields);
    const accessToken: string = TokenGenerator.generateToken(payload, new AccessToken(), req.jwtAuthOptions);
    const refreshToken: string = TokenGenerator.generateToken(payload, new RefreshToken(), req.jwtAuthOptions);
    const user = await getUserById(payload[identifier]);
    if(!user) {
        return res.status(HTTP_UNAUTHORIZED).json({
            details: "Incorrect credentials"
        });
    }
    let response: JWTAuthResponse = {
        "access": accessToken
    }
    if(req.jwtAuthOptions.rotateRefresh === true) {
        response = {
            ...response,
            "refresh": refreshToken
        }
    }
    return res.status(HTTP_OK).json(response);
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
    const { strategy, signingKey } = req.jwtAuthOptions;
    const { identifier, getUserById } = strategy.options;
    const accessToken = getTokenFromString(req.headers.authorization);
    if(!accessToken) {
        return res.status(HTTP_BAD_REQUEST).json({
            details: "bad authorization header"
        });
    }
    const payload = TokenGenerator.verify(accessToken, signingKey, new AccessToken());
    if(!payload) {
        return res.status(HTTP_UNAUTHORIZED).json({
            details: "Incorrect credentials"
        });
    }
    const user = await getUserById(payload[identifier]);
    if(!user) {
        return res.status(HTTP_UNAUTHORIZED).json({
            details: "Incorrect credentials"
        });
    }
    req.user = user;
    next();
}