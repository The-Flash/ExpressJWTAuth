/// <reference types="common" />
import jwt, { JwtPayload } from "jsonwebtoken";
declare abstract class TokenBase {
    type: string;
}
export declare class AccessToken extends TokenBase {
    type: string;
    constructor();
}
export declare class RefreshToken extends TokenBase {
    type: string;
    constructor();
}
export declare class TokenGenerator {
    static verify(token: string, secretKey: jwt.Secret, tokenType: TokenBase): JwtPayload | null;
    static generateToken<T>(payload: object, tokenType: TokenBase, options: JWTOptions<T>): string;
}
export {};
