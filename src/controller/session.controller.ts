import { Request, Response } from 'express'
import config from 'config'
import {
    createAccessToken,
    createSession,
    updateSession,
} from '../service/session.service'
import { validatePassword } from '../service/user.service'
import { sign } from '../utils/jwt.utils'
import { get } from 'lodash'

export async function createUserSessionHandler(req: Request, res: Response) {
    //validate the email and password
    const user = await validatePassword(req.body)

    if (!user) return res.status(401).send('Invalid username and password')

    // create a session
    const session = await createSession(user._id, req.get('user-agent') || '')

    // create access token
    const accessToken = createAccessToken({ user, session })

    // create refresh token
    const refreshToken = sign(session, {
        expiresIn: config.get('refreshTokenTtl'),
    }) // 1 year

    // send refresh & access token back
    res.json({ accessToken, refreshToken })
}

export async function invalidateUserSessionHandler(
    req: Request,
    res: Response
) {
    const sessionId = get(req, 'user.session')
    await updateSession({ _id: sessionId }, { valid: false })

    return res.sendStatus(200)
}
