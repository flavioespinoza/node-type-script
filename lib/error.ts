require ('ansicolor').nice
const log = require ('ololog').configure ({locate: false})

export function _error (method: string, err: any) {
	log.lightYellow(`${method} ERROR:`, err.message)
}