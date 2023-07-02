import {UserjwtToken} from "../interfaces";
import jwt, {JwtPayload} from "jsonwebtoken";

export class JwtService{
    createJwtToken({ user, id }:UserjwtToken) {
        return jwt.sign(
            {
                sub: id || user?._id.toString(),
                exp: Math.floor(Date.now() / 1000) + 900,
            },
            process.env.JWTKEY
        );
    }

    async checkExpirationToken(token: string) {
        const tokenDecoded = jwt.verify(token, process.env.JWTKEY, {ignoreExpiration: true}) as JwtPayload;
        const tokenExp = tokenDecoded.exp;
        const tokenUserId = tokenDecoded.sub
        const nowInSec = Math.floor(Date.now() / 1000);
        if (tokenExp && tokenUserId) {
            if (nowInSec <= tokenExp) {
                return tokenDecoded;
            } else if (nowInSec > tokenExp && nowInSec - tokenExp) {
                const refreshedToken = this.createJwtToken({user: undefined, id: tokenDecoded.sub});
                return jwt.verify(refreshedToken, process.env.JWTKEY);
            }else{
                throw new JwtError("Token expired.")
            }
        }
        throw new JwtError("Jwt invalid.")
    };

    async decodeJwtToken(token: string) {
        const test = await this.checkExpirationToken(token)
        if(test){
            return test
        }else{
            throw new JwtError("Jwt decode failed")
        }
    }
}

export class JwtError extends Error {

    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, JwtError.prototype);
    }
}