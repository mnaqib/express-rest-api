import express from 'express'
import morgan from 'morgan'
import config from 'config'
import log from './logger'
import connect from './db/connect'
import router from './routes'

const port = config.get('port') as number
const host = config.get('host') as string

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))

router(app)

app.listen(port, host, () => {
    log.info(`Server is listening at http://${host}:${port}`)

    connect()
})
