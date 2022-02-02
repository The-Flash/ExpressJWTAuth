import { Request, Response, NextFunction } from "express";

export class JWTStrategy<T> {
    constructor(
        public options: JWTStrategyOptions<T>
    ) {

    }
}

export default function <T>(options: JWTOptions<T>) {
    if(!options.algorithm) {
        options["algorithm"] = "HS256";
    }
    if(!options.accessTokenLifetime) {
        options["accessTokenLifetime"] = "";
    }
    if(!options.refreshTokenLifetime) {
        options["refreshTokenLifetime"] = "";
    }
    if(!options.signingKey) {
        options["signingKey"] = "";
    }
    if(!options.rotateRefresh) {
        options["rotateRefresh"] = true;
    }
    return function (req: Request, res: Response, next: NextFunction) {
        req.jwtAuthOptions = Object.create(options);
        next();
    }
}
