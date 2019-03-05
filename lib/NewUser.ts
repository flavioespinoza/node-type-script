import { v4String } from 'uuid/interfaces'

const uuidv4 = require ('uuid/v4')

/**
 * @param {{class:NewUser}} New User Class Constructor
 * */
export default class NewUser {
	info: object
	username: string
	email: string
	id: v4String

	constructor (username: string, email: string) {

		this.id = uuidv4()

		this.username = username
		this.email = email

		this.info = {
			id: this.id,
			username: username,
			email: email
		}
	}

	public _info () {
		return this.info
	}

}

