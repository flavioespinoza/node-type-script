import { v4String } from 'uuid/interfaces'
import { _isEmail } from './is-email'

const uuidv4 = require ('uuid/v4')

export class User {

	details: {
		message: string,
		subMessage: string
	}
	info: {
		success: boolean,
		id: v4String,
		username: string,
		email: string,
		details: object
	}
	username: string
	email: string
	id: v4String

	constructor (username, email) {

		this.username = username

		if (_isEmail (email)) {

			this.id = uuidv4 ()
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
			this.details.message = `Email entered is invalid: ${email}`
			this.details.subMessage = 'Must match pattern: youremail@emailprovider.com'

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


