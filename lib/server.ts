const log = require('ololog').configure({
	locate: false
})

import app from './app'
import Greeter from './Greeter'

const PORT = 7000

app.listen(PORT, function () {

	let greeter1 = new Greeter('greeter1')

	greeter1.greet()

    log.yellow('Express server listening on port ', PORT)
})