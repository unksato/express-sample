import * as jwt from 'jsonwebtoken'

let _TOKEN_TIMEOUT_SEC = 15 * 60;

export function createToken(credential: any, secret: string) {
    return jwt.sign(credential, secret, { expiresIn: _TOKEN_TIMEOUT_SEC});
}