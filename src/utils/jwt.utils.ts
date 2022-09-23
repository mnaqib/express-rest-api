import config from 'config'
import jwt from 'jsonwebtoken'
import log from '../logger'

const privateKey = config.get('privateKey') as string

export function sign(object: Object, options?: jwt.SignOptions) {
    return jwt.sign(object, privateKey, options)
}

export function decode(token: string) {
    try {
        const decoded = jwt.verify(token, privateKey)
        return { valid: true, expired: false, decoded }
    } catch (e: any) {
        log.error(e)
        return {
            valid: false,
            expired: e.message === 'jwt expired',
            decoded: null,
        }
    }
}
