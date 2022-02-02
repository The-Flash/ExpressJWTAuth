import { Request, NextFunction, Response } from "express";
export declare function getToken(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function refreshToken(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function authenticate(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
