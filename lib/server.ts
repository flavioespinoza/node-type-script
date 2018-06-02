import app from './app'
const log = require('ololog').configure({
    locate: false
})
const port = 8080
app.listen(port, function () {
    log.yellow('Express server listening on port ', port )
})