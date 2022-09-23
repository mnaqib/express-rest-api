import config from 'config'
import jwt from 'jsonwebtoken'

const privateKey = config.get('privateKey') as string

export function sign(object: Object, options?: jwt.SignOptions) {
    return jwt.sign(object, privateKey, options)
}