import { JWTStrategy } from "../../src";
import jwt from "jsonwebtoken";

export { };
declare global {
    interface JWTOptions<T, I> {
        algorithm?: jwt.Algorithm;
        signingKey?: string;
        refreshTokenLifetime?: string | number;
        accessTokenLifetime?: string | number;
        rotateRefresh?: boolean;
        strategy: JWTStrategy<T, I>
    }

    interface JWTStrategyOptions<T, I> {
        identifier: string;
        payloadFields: string[];
        getUser: (username: string, password: string) => Promise<T>;
        getUserById: (id: I) => Promise<T>;
    }

    interface JWTAuthRequest<T, I> extends Request {
        jwtAuthOptions?: JWTOptions<T, I>;
        user?: T,
        body: any;
    }

    interface JWTAuthResponse {
        access: string,
        refresh?: string
    }
}