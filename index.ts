import express from "express";
import { Request, Response } from "express";

import jwtAuth, { JWTStrategy, authenticate, getToken, refreshToken } from "./src";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(jwtAuth({
    algorithm: "HS256",
    signingKey: "some big secret here",
    refreshTokenLifetime: "1209600s",
    accessTokenLifetime: "300s",
    strategy: new JWTStrategy<object>({
        identifier: "id",
        payloadFields: ["nickname"],
        getUser: async (username: string, password: string) => {
            return {
                id: "",
                username: "Augustine",
                age: 100,
                nickname: "Flash"
            };
        },
        getUserById: async (id: string) => {
            return {
                username: "Augustine",
                age: 100,
                nickname: "Flash"
            };
        },
        responseExtras: async (id: string) => {
            return {
                lastname: "Augustine"
            }
        }
    }),
}));

app.get("/", function (req: Request, res: Response) {
    res.json({
        message: "Hello World"
    })
})

app.post("/token", getToken);
app.post("/refresh", refreshToken);
app.get("/protected", authenticate, (req: Request, res: Response) => {
    res.json({
        details: "I am protected",
        ...req.user
    })
})

app.listen(8000, function () {
    console.log(`Listening on port 8000`);
})