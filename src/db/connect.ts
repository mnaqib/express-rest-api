import mongoose from 'mongoose'
import config from 'config'
import log from '../logger'

function connect() {
    const dbUri = config.get('dbUri') as string

    return mongoose
        .connect(dbUri)
        .then(() => log.info('Database connected'))
        .catch((e) => {
            log.error('db error', e)
            process.exit(1)
        })
}

export default connect
