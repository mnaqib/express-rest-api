import config from 'config'
import { get } from 'lodash'
import { FilterQuery, FlattenMaps, LeanDocument, UpdateQuery } from 'mongoose'

import Session, { SessionDocument } from '../model/session.model'
import { decode, sign } from '../utils/jwt.utils'
import { findUser } from './user.service'

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

export async function reIssueAccessToken({
    refreshToken,
}: {
    refreshToken: string
}) {
    //Decode the refresh token
    const { decoded } = decode(refreshToken)

    if (!decoded || !get(decoded, '_id')) return false

    //get the session
    const session = await Session.findById(get(decoded, '_id'))

    if (!session || !session?.valid) return false

    const user = await findUser({ _id: session.user })

    if (!user) return false

    const accessToken = createAccessToken({ user, session })

    return accessToken
}

export async function updateSession(
    query: FilterQuery<SessionDocument>,
    update: UpdateQuery<SessionDocument>
) {
    return await Session.updateOne(query, update)
}
