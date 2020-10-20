import { Request, Response, NextFunction, Router } from 'express'

/**
 * Generating errors for client
 */
class HTTPClientError extends Error {
    readonly statusCode!: number
    readonly name!: string
    constructor(message: any | string) {
        if (message instanceof Object) {
            super(JSON.stringify(message))
        } else {
            super(message)
        }
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor)
    }
}

class HTTP404Error extends HTTPClientError {
    readonly statusCode = 404
    constructor(message: string | any = 'Not found') {
        super(message)
    }
}

const Error404 = (router: Router) => {
    router.use((req: Request, res: Response) => {
        throw new HTTP404Error('Method not found.')
    })
}

const ServerErrors = (router: Router) => {
    router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error(err)
        // should test
        if (process.env.NODE_ENV === 'production') {
            res.status(500).send('Internal Server Error')
        } else {
            // res.status(501).send(err.stack);
            res.status(500).send(err.stack)
        }
    })
}

export default [ServerErrors]
