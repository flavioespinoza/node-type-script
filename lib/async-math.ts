import { _error } from './error'

export async function _divide (a: number, b: number) {
	try {
		return a / b
	} catch (err) {
	  console.log('_divide', err)
	}
}

export async function _multiply (a: number, b: number) {
	try {
		return a * b
	} catch (err) {
	  _error('_multiply', err)
	}
}

export async function _add (a: number, b: number) {
	try {
		return a + b
	} catch (err) {
	  _error('_add', err)
	}
}

export async function _subtract (a: number, b: number) {
	try {
		return a - b
	} catch (err) {
	  _error('_subtract', err)
	}
}
