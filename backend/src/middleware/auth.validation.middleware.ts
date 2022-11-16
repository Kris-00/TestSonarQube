import jwt, { TokenExpiredError } from 'jsonwebtoken'
import crypto from 'crypto'
import { NextFunction, Request, Response } from 'express'
import fs from 'fs'

export function verifyRefreshBodyField(req: Request, res: Response, next: NextFunction) {
    if (req.body && req.body.refresh_token) {
        return next();
    } else {
        return res.status(400).send({ error: 'need to pass refresh_token field' });
    }
}

export function validRefreshNeeded(req: Request, res: Response, next: NextFunction){
    let token = req.headers['authorization']?.split(' ')[1]
    const decodedJwt: any = jwt.decode(token!)

    let b = Buffer.from(req.body.refresh_token, 'base64')
    let refresh_token = b.toString()
    let hash = crypto.createHmac('sha512', req.body.refreshKey).update(decodedJwt!.email + process.env.JWT_SECRET).digest("base64")
    if (hash === refresh_token) {
        return next();
    } else {
        return res.status(400).send({ error: 'Invalid refresh token' });
    }
};

export function validJWTNeeded(req: Request, res: Response, next: NextFunction) {
    if (req.headers['authorization']) {
        try {
            const publicKey = fs.readFileSync(process.env.JWT_PUBLIC_KEY!)

            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== 'Bearer') {
                return res.status(401).send();
            } else {
                const decoded:any = jwt.verify(authorization[1], publicKey, { algorithms: ['RS256'] });
                req.body.userid = decoded.userid
                req.body.unique_num = decoded.unique_num
                return next();
            }
        } catch (err) {
            if (err instanceof TokenExpiredError)
                return res.status(403).send();
            
            console.log("auth error:", err)
            return res.status(403).send();
        }
    } else {
        return res.status(401).send();
    }
};