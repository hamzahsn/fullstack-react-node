import express from 'express'
import Debug from 'debug'
import mongoose from 'mongoose'
import * as winston from 'winston'
import { applyMiddleware, applyRoutes } from './utils/wrapper'
import middleware from './middleware/handlers'
import errorHandlers from './middleware/error'
import routes from './services/routes'

/**
 * Server Configuration & Middlewares
 */
const app = express()
applyMiddleware(middleware, app)
applyMiddleware(errorHandlers, app)
applyRoutes(routes, app)
const config = require('./config/default')
const port = config.nodeServer.port
const db = mongoose.connection
let dataBaseUrl = config.database.url.prod

// change Database url for testing mode
if (process.env.NODE_ENV == 'test') {
    dataBaseUrl = config.database.url.test
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: any) {
    if (error.syscall !== 'listen') {
        throw error
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            winston.error(bind + ' requires elevated privileges')
            process.exit(1)
            break
        case 'EADDRINUSE':
            winston.error(bind + ' is already in use')
            process.exit(1)
            break
        default:
            throw error
    }
}

/**
 * Database connection
 */
mongoose.connect(dataBaseUrl, { useNewUrlParser: true }).then(
    () => {
        console.info('database is connected')
    },
    err => {
        console.error(' cannot connect to the database' + err)
    }
)

/**
 * Listen on connection with database
 */
db.on('error', onDBError)
db.on('listening', onDBListening)

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    const addr = server.address()
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port
    Debug('Listening on ' + bind)
}

/**
 * Server listen
 */
const server = app.listen(process.env.PORT || port, () => {
    console.info('application connected on port: ', port)
})

/**
 * Listen on provided port, on all network interfaces.
 */
server.on('error', onError)
server.on('Listening', onListening)

/**
 * Event listener for mongo database "error" event
 */
function onDBError(error: any) {
    console.error('Connection database error: ', error)
}

/**
 * Event listener for mongo database "Listening" event
 */
function onDBListening() {
    console.log('Connected successfully to database')
}
