import { JWTStrategy } from "../../src";
import jwt from "jsonwebtoken";

export { };
declare global {
    interface JWTOptions<T> {
        algorithm?: jwt.Algorithm;
        signingKey?: string;
        refreshTokenLifetime?: string | number;
        accessTokenLifetime?: string | number;
        rotateRefresh?: boolean;
        strategy: JWTStrategy<T>
    }

    interface JWTStrategyOptions<T> {
        identifier: string | number;
        payloadFields: string[];
        getUser: (username: string, password: string) => Promise<T>;
        getUserById: (id: string | number) => Promise<T>;
        responseExtras?: (id: string | number) => Promise<object>
    }

    interface JWTAuthRequest<T> extends Request {
        jwtAuthOptions?: JWTOptions<T>;
        user?: T,
        body: any;
    }

    interface JWTAuthResponse {
        access: string,
        refresh?: string
    }
}