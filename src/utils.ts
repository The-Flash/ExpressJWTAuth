import { JwtPayload } from "jsonwebtoken";

export const extractPayload = (user: object, fields: any[]) : object => {
    const payload = {};
    if(!user) return payload;
    fields.forEach((key) => {
        payload[key] = user[key];
    });
    return payload;
}

export const getTokenFromString = (tokenString: string) => {
    /**
    @params {
        tokenString: Bearer token
    }
    @return token
    */
    try {
        return tokenString.split(" ")[1].trim();
    } catch(err) {
        return null;
    }
}