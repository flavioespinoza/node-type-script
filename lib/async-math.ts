import { _error } from './error'

export const _divide = async (a: number, b: number) => {
	try {
		return a / b
	} catch (err) {
	  console.log('_divide', err)
	}
}

export const _multiply = async (a: number, b: number) => {
	try {
		return a * b
	} catch (err) {
	  _error('_multiply', err)
	}
}

export const _add = async (a: number, b: number) => {
	try {
		return a + b
	} catch (err) {
	  _error('_add', err)
	}
}

export const _subtract = async (a: number, b: number) => {
	try {
		return a - b
	} catch (err) {
	  _error('_subtract', err)
	}
}
