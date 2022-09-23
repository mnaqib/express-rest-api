import config from 'config'
import { FlattenMaps, LeanDocument } from 'mongoose'

import Session from '../model/session.model'
import { sign } from '../utils/jwt.utils'

export async function createSession(userId: string, userAgent: string) {
    const session = await Session.create({ user: userId, userAgent })

    return session.toJSON()
}

export function createAccessToken({
    user,
    session,
}: {
    user: Pick<FlattenMaps<LeanDocument<any>>, string | number | symbol>
    session: Pick<FlattenMaps<LeanDocument<any>>, string | number | symbol>
}) {
    //build and return the new access token
    const accessToken = sign(
        { ...user, session: session._id },
        { expiresIn: config.get('accessTokenTtl') }
    ) //15min

    return accessToken
}
