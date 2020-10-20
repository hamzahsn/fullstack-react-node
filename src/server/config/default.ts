module.exports = {
    nodeServer: {
        host: '0.0.0.0',
        port: 4000
    },
    database: {
        url: {
            prod: 'mongodb://localhost:27017/Todo',
            test: 'mongodb://localhost:27017/TodoTest'
        }
    }
}
