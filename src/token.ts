import jwt, { JwtPayload } from "jsonwebtoken";

abstract class TokenBase {
    type: string;
}

export class AccessToken extends TokenBase {
    type: string;

    constructor() {
        super();
        this.type = "access";
    }
}

export class RefreshToken extends TokenBase {
    type: string;

    constructor() {
        super();
        this.type = "refresh";
    }
}

export class TokenGenerator {
    static verify(token: string, secretKey: jwt.Secret, tokenType: TokenBase): JwtPayload | null {
        try {
            const payload = jwt.verify(token, secretKey);
            if (typeof payload !== "string") {
                if (payload.type === tokenType.type) {
                    return payload;
                }
            }
            return null;
        } catch(e) {
            return null;
        }
    }

    static generateToken<T>(payload: object, tokenType: TokenBase, options: JWTOptions<T>): string {
        payload = {
            ...payload,
            type: tokenType.type
        }
        let expiresIn: string | number;
        if (tokenType instanceof RefreshToken) {
            expiresIn = options.refreshTokenLifetime;
        } else {
            expiresIn = options.accessTokenLifetime;
        }
        const token = jwt.sign(payload, options.signingKey, {
            expiresIn,
            algorithm: options.algorithm,
        });
        return token;
    }
}