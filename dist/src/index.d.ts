/// <reference types="common" />
import { Request, Response, NextFunction } from "express";
import { getToken, refreshToken, authenticate } from "./controllers";
export declare class JWTStrategy<T> {
    options: JWTStrategyOptions<T>;
    constructor(options: JWTStrategyOptions<T>);
}
export default function <T>(options: JWTOptions<T>): (req: Request, res: Response, next: NextFunction) => void;
export { getToken, refreshToken, authenticate };
