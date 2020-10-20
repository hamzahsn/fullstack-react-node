import { Router, Request, Response, NextFunction } from 'express'

type Wrapper = (router: Router) => void

type Handler = (req: Request, res: Response, next: NextFunction, error?: Error) => Promise<void> | void

type Route = {
    path: string
    method: string
    handler: Handler | Handler[]
}

export const applyMiddleware = (middleware: Wrapper[], router: Router) => {
    for (const wrapper of middleware) {
        wrapper(router)
    }
}

export const applyRoutes = (routes: Route[], router: Router) => {
    for (const route of routes) {
        const { method, path, handler } = route
        ;(router as any)[method](path, handler)
    }
}
