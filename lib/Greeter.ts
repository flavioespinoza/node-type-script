import { _isEmail } from './is-email'
const uuidv4 = require ('uuid/v4')

export class User {

	username: string

	email: string | any

	id: string

	details: {
		message: string,
		subMessage: string
	} | any

	info: {
		success: boolean,
		id: string,
		username: string,
		email: string,
		details: object
	} | any

	constructor (username: string, email: string) {

		this.username = username
		this.id = uuidv4 ()

		if (_isEmail (email)) {

			this.email = email
			this.details = {
				message: 'User created successfully!',
				subMessage: 'All is well'
			}

			this.info = {
				success: true,
				id: this.id,
				username: this.username,
				email: this.email,
				details: this.details
			}

		} else {

			this.email = null

			this.details = {
				message: `Email entered is invalid: ${email}`,
				subMessage: 'Must match pattern: youremail@emailprovider.com'
			}

			this.info = {
				success: false,
				id: null,
				username: this.username,
				email: this.email,
				details: this.details
			}

		}

	}

	public _info () {
		return this.info
	}

}


export default class Greeter {
	greeting: string

	constructor (message: string) {
		this.greeting = message
	}

	greet () {
		return 'Hello, ' + this.greeting
	}
}


