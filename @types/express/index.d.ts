declare namespace Express {
    interface Request {
        jwtAuthOptions?: any;
        user?: any;
    }
}
