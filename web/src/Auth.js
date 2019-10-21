export default class Auth {
	constructor(updateCallback) {
		this.authenticated = false;
		this.updateCallback = updateCallback;
		return this.authenticated;
	}

	async initialize() {
		return new Promise(async resolve => {
			let username = localStorage.getItem("username");
			let password = localStorage.getItem("password");
			if (!username || !password) {
				return false;
			}
			this.authenticated = await this.login(username, password);
			this.updateCallback();
			resolve(this.authenticated);
		});
	}

	register(username, email, password) {
		return new Promise(async (resolve, reject) => {
			const response = await fetch(
				"https://us-central1-fscoin-f7656.cloudfunctions.net/api/register",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						username: username,
						password: password,
						email: email
					})
				}
			);
			const json = await response.json();
			if (json.status === "success") {
				resolve(true);
			} else {
				this.errors = json.errors;
				reject(this.errors);
			}
		});
	}

	async login(username, password) {
		return new Promise(async (resolve, reject) => {
			const response = await fetch(
				"https://us-central1-fscoin-f7656.cloudfunctions.net/api/login",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({ username: username, password: password })
				}
			);
			const json = await response.json();
			if (json.status === "success") {
				this.authenticated = true;
				this.userData = json.data;
				localStorage.setItem("username", username);
				localStorage.setItem("password", password);
				this.updateCallback();
				resolve(true);
			} else {
				this.authenticated = false;
				this.errors = json.errors;
				this.updateCallback();
				reject(false);
			}
		});
	}

	logout = () => {
		console.log("logout");
		localStorage.clear();
		this.authenticated = false;
		this.userData = null;
		this.updateCallback();
	};
}
