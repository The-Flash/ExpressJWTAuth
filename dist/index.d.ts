/// <reference types="common" />
import { Request, Response, NextFunction } from "express";
import { getToken, refreshToken, authenticate } from "./controllers";
export { getToken, refreshToken, authenticate };
export declare class JWTStrategy<T> {
    options: JWTStrategyOptions<T>;
    constructor(options: JWTStrategyOptions<T>);
}
export declare function jwtAuth<T>(options: JWTOptions<T>): (req: Request, res: Response, next: NextFunction) => void;
