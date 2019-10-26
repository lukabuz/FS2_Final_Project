export default class DataInterface {
	constructor(username, password) {
		this.username = username;
		this.password = password;
		this.API = "https://us-central1-fscoin-f7656.cloudfunctions.net/api/";
	}

	apiRequest = (route, configs, auth) => {
		return new Promise(async (resolve, reject) => {
			if (auth) {
				configs["username"] = this.username;
				configs["password"] = this.password;
			}
			const response = await fetch(this.API + route, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(configs)
			});
			const json = await response.json();
			if (json.status === "success") {
				json.sent = this.dictToArray(json.sent);
				json.received = this.dictToArray(json.received);
				resolve(json);
			} else {
				reject(response.errors);
			}
		});
	};

	getTransactions = () => {
		return new Promise(async (resolve, reject) => {
			this.apiRequest("myTransactions", {}, true)
				.then(res => {
					resolve(res);
				})
				.catch(e => {
					reject(e);
				});
		});
	};

	dictToArray = dict => {
		let array = [];
		for (let key in dict) {
			if (!dict.hasOwnProperty(key)) continue;
			let element = dict[key];
			element.key = key;
			array.push(element);
		}
		return array;
	};

	throwErrors = errors => {
		return;
	};
}
