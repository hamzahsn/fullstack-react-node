import { Request, Response } from 'express'
const Todo = require('../models/todoModelModel')

const routes = [
    /**
     * Displaying data when requesting
     */
    {
        path: '/todo',
        method: 'get',
        handler: async (req: Request, res: Response) => {
            Todo.find()
                .then((td: any) => {
                    res.send({ td })
                })
                .catch((err: any) => {
                    res.status(400).send(err)
                })
        }
    },
    {
        path: '/td/:id',
        method: 'get',
        handler: async (req: Request, res: Response) => {
            const id = req.params.id
            console.log(id)
            Todo.find({ td: id })
                .then((td: any) => {
                    if (!td) {
                        return res.status(404).send()
                    }
                    res.send({ td })
                })
                .catch((err: any) => {
                    res.status(400).send(err)
                })
        }
    }
]

export default [...routes]
