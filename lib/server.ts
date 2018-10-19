import app from './app'
const log = require('ololog').configure({
    locate: false
})
const port = 7000
app.listen(port, function () {
    log.yellow('Express server listening on port ', port )
})