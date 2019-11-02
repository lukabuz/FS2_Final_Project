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
			console.log(json);
			if (json.status === "success") {
				resolve(json);
			} else {
				reject(json.errors);
			}
		});
	};

	getInfo = () => {
		return new Promise(async (resolve, reject) => {
			this.apiRequest("myInfo", {}, true)
				.then(json => {
					json.sent = this.dictToArray(json.sent);
					json.received = this.dictToArray(json.received);
					json.purchases = this.dictToArray(json.purchases);
					json.listings = this.dictToArray(json.listings);
					resolve(json);
				})
				.catch(e => {
					reject(e);
				});
		});
	};

	getAllTransactions = () => {
		return new Promise((resolve, reject) => {
			fetch("https://fscoin-f7656.firebaseio.com/transactions.json")
				.then(response => response.json())
				.then(json => {
					let ret = this.dictToArray(json);
					console.log(ret);
					ret.sort(this.orderTransactions);
					resolve(ret);
				})
				.catch(error => {
					reject(error);
				});
		});
	};

	sendMoney = (recipient, amount) => {
		return new Promise(async (resolve, reject) => {
			this.apiRequest("send", { recipient: recipient, amount: amount }, true)
				.then(json => {
					resolve(json.message);
				})
				.catch(e => {
					reject(e);
				});
		});
	};

	depositMoney = amount => {
		return new Promise(async (resolve, reject) => {
			this.apiRequest(
				"sendAsAdmin",
				{ amount: amount, adminpass: "adminpass", recipient: this.username },
				false
			)
				.then(json => {
					resolve(json.message);
				})
				.catch(e => {
					reject(e);
				});
		});
	};

	purchaseListing = listingId => {
		return new Promise((resolve, reject) => {
			this.apiRequest("buyItem", { listing: listingId }, true)
				.then(json => {
					resolve(json.data.listing.id + " successfully purchased");
				})
				.catch(e => {
					reject(e);
				});
		});
	};

	createListing = (name, description, payload, price) => {
		return new Promise((resolve, reject) => {
			this.apiRequest(
				"createListing",
				{
					name: name,
					description: description,
					payload: payload,
					price: price
				},
				true
			)
				.then(json => {
					resolve(json.message);
				})
				.catch(e => {
					reject(e);
				});
		});
	};

	getAllListings = () => {
		return new Promise((resolve, reject) => {
			fetch("https://fscoin-f7656.firebaseio.com/item_listings.json")
				.then(response => response.json())
				.then(jsonData => {
					jsonData = this.dictToArray(jsonData).sort(this.orderListings);
					resolve(jsonData);
				})
				.catch(error => {
					reject(error);
				});
		});
	};

	orderListings(a, b) {
		if (a.listingDate < b.listingDate) {
			return 1;
		}
		if (a.listingDate > b.listingDate) {
			return -1;
		}
		return 0;
	}

	orderTransactions(a, b) {
		if (a.date < b.date) {
			return 1;
		}
		if (a.date > b.date) {
			return -1;
		}
		return 0;
	}

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
}
