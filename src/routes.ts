import { Express, Request, Response } from 'express'
import {
    createUserSessionHandler,
    invalidateUserSessionHandler,
} from './controller/session.controller'
import { createUserHandler } from './controller/user.controller'
import { validateRequest, requiresUser } from './middleware'
import { createUserSchema, createUserSessionSchema } from './schema/user.schema'

export default (app: Express) => {
    app.get('/health', (req: Request, res: Response) => res.sendStatus(200))

    //Register user
    app.post('/api/users', validateRequest(createUserSchema), createUserHandler)

    //Login
    app.post(
        '/api/sessions',
        validateRequest(createUserSessionSchema),
        createUserSessionHandler
    )

    //Get the users session

    //Logout
    app.delete('/api/sessions', requiresUser, invalidateUserSessionHandler)
}
