export default class Auth {
	constructor() {
		this.authenticated = false;
		let username = localStorage.getItem("username");
		let password = localStorage.getItem("password");
		if (!username || !password) {
			return false;
		}
		this.authenticated = this.login(username, password);
		return this.authenticated;
	}

	register(username, password) {
		return true;
	}

	login(username, password) {
		return true;
	}
}
