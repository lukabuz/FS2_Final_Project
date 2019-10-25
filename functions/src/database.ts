import * as hash from "object-hash";

export default class Database {
	private ref: any;

	constructor(db: any) {
		this.ref = db.ref();
	}

	// check if user exists
	// returns promise that will resolve to a boolean
	checkIfUserExists(user: string) {
		return new Promise<boolean>(resolve => {
			if (user === "ADMIN") {
				resolve(true);
			}
			this.ref
				.child("users")
				.child(user)
				.once("value", function(snapshot: any) {
					resolve(snapshot.val() !== null);
				});
		});
	}

	// check if listing exists
	// returns promise that will resolve to a boolean
	checkIfListingExists(listing: string) {
		return new Promise<boolean>(resolve => {
			this.ref
				.child("item_listings")
				.child(listing)
				.once("value", function(snapshot: any) {
					resolve(snapshot.val() !== null);
				});
		});
	}

	// create a user
	createUser(username: string, passwordHash: string, email: string) {
		// user data is stored in the 'users' key
		this.ref
			.child("users")
			.child(username)
			.set({
				username: username,
				email: email
			});
		// due to how firebase rules work, private data like hashes have to be stored in a separate key
		this.ref
			.child("private")
			.child("users")
			.child(username)
			.set({
				passwordHash: passwordHash
			});
	}

	// get the hash for a user's password
	// resolves to a string or rejects with an error
	getUserHash(username: string) {
		return new Promise((resolve: any, reject: any) => {
			this.ref
				.child("private")
				.child("users")
				.child(username)
				.on("value", function(snapshot: any) {
					const privateInfo = snapshot.val();
					if (privateInfo === null) {
						reject("User does not exist.");
					}
					resolve(privateInfo.passwordHash);
				});
		});
	}

	// Get public data about an user
	// resolves to an object or rejects with an error
	getUserInfo(username: string) {
		return new Promise((resolve: any, reject: any) => {
			this.ref
				.child("users")
				.child(username)
				.on("value", function(snapshot: any) {
					const user = snapshot.val();
					if (user === null) {
						reject("User does not exist.");
					}
					resolve(user);
				});
		});
	}

	// create a transaction
	// optional parameter listingId can be provided if the transaction is payment for a listing
	// resolves to a string or rejects with an error
	createTransaction(from: string, to: string, amount: number, listingId = "") {
		return new Promise(async (resolve: any, reject: any) => {
			if (from === "ADMIN") {
				// do not check anything other than recipient if transaction is from an admin
				const toExists = this.checkIfUserExists(to);
				if (toExists) {
					reject("Error, recipient not found.");
				}
			} else {
				// validate if both users exist
				const fromExists = this.checkIfUserExists(from);
				const toExists = this.checkIfUserExists(to);
				// check if sender has enough money
				const balance = await this.getUserBalance(from);
				if (!fromExists) {
					reject("Error, sender does not exist.");
				} else if (!toExists) {
					reject("Error, recipient does not exist.");
				} else if (balance < amount) {
					reject("Error, not enough funds.");
				}
			}
			// generate an unique id for transaction
			const id = hash(from + Date.now().toString() + to);
			const transaction: any = {
				from: from,
				to: to,
				amount: amount,
				date: Date.now()
			};
			if (listingId !== "") {
				// set listing id in case the transaction is a payment for a listing
				transaction.listingId = listingId;
			}
			// send transaction to database
			this.ref
				.child("transactions")
				.child(id)
				.set(transaction);
			resolve(id);
		});
	}

	// get a list of transactions from or to an user
	// if sent is true(default), the function returns transactions sent by user
	// if sent is false, the function returns transactions recieved by user
	// resolves to an object and rejects with an error string
	getUserTransactions(username: string, sent: boolean = true) {
		return new Promise(async (resolve: any, reject: any) => {
			// validate if user exists
			if (!this.checkIfUserExists(username)) {
				reject("User does not exist.");
				return;
			}
			this.ref
				.child("transactions")
				.orderByChild(sent ? "from" : "to")
				.equalTo(username)
				.on("value", function(snapshot: any) {
					resolve(snapshot.val());
				});
		});
	}

	// get the balance of an user
	// resolves to a number or rejects with an error string
	getUserBalance(username: string) {
		return new Promise<any>(async (resolve: any, reject: any) => {
			if (!this.checkIfUserExists(username)) {
				reject("User does not exist.");
				return;
			}

			let balance = 0;
			// get a list of sent transactions and decrement balance by their values
			const sent: any = await this.getUserTransactions(username);
			for (const key in sent) {
				if (!sent.hasOwnProperty(key)) continue;
				balance -= sent[key].amount;
			}

			// get a list of received transactions and increment balance by their values
			const received: any = await this.getUserTransactions(username, false);
			for (const key in received) {
				if (!received.hasOwnProperty(key)) continue;
				balance += received[key].amount;
			}
			resolve(balance);
		});
	}

	// give user money as administrator
	// administrator has an infinite balance
	giveUserMoney(username: string, amount: number) {
		return new Promise<any>(async (resolve: any, reject: any) => {
			if (!this.checkIfUserExists(username)) {
				reject("User does not exist");
			} else {
				this.createTransaction("ADMIN", username, amount)
					.then(res => {
						resolve(res);
					})
					.catch(e => {
						reject(e);
					});
			}
		});
	}

	// create a listing for a digital item
	// resolves to a boolean or rejects with an error string
	createListing(
		seller: string,
		itemName: string,
		itemPayload: string,
		itemPrice: number,
		itemDescription: string
	) {
		return new Promise<any>(async (resolve: any, reject: any) => {
			if (!this.checkIfUserExists(seller)) {
				reject("User does not exist");
				return;
			}
			// create an unique id
			const id = hash(seller + Date.now().toString() + itemName + itemPrice);
			// store public data in item_listings
			this.ref
				.child("item_listings")
				.child(id)
				.set({
					seller: seller,
					itemName: itemName,
					itemPrice: itemPrice,
					itemDescription: itemDescription,
					listingDate: Date.now(),
					buyer: ""
				});
			// store private data(product being sold) in private/item_listings
			this.ref
				.child("private")
				.child("item_listings")
				.child(id)
				.set({
					itemPayload: itemPayload
				});
			resolve(true);
		});
	}

	// get a listing
	// resolves to an object or rejects with an error string
	getListing(listing: string) {
		return new Promise<any>(async (resolve: any, reject: any) => {
			this.ref
				.child("item_listings")
				.child(listing)
				.on("value", function(snapshot: any) {
					const value = snapshot.val();
					if (value === null) {
						reject("Listing does not exist.");
					}
					value.id = snapshot.key;
					resolve(value);
				});
		});
	}

	// get the item being sold in a listing(a string) from the database
	// resolves to an object or rejects with an error string
	getPayloadForListing(listing: string) {
		return new Promise<any>(async (resolve: any, reject: any) => {
			this.ref
				.child("private")
				.child("item_listings")
				.child(listing)
				.child("itemPayload")
				.on("value", function(snapshot: any) {
					const value = snapshot.val();
					if (value === null) {
						reject("Listing does not exist.");
					}
					resolve(value);
				});
		});
	}

	// purchase a specific item
	// resolves to a string or rejects with an error string
	buyItem(buyer: string, listing: string) {
		return new Promise(async (resolve: any, reject: any) => {
			const errors: string[] = [];
			// validate existence of both user and listing
			const userExists = await this.checkIfUserExists(buyer);
			const listingExists = await this.checkIfListingExists(listing);
			let userBalance: any;
			let listingObject: any;
			if (!userExists) {
				errors.push("User does not exist");
			} else if (!listingExists) {
				errors.push("Listing does not exist");
			}

			if (errors.length === 0) {
				// if both exist, check balance of user
				userBalance = this.getUserBalance(buyer);
				listingObject = await this.getListing(listing);
				if (userBalance < listingObject.itemPrice) {
					errors.push("Not enough funds.");
				}
				// check if someone is buying their own item
				if (buyer === listingObject.sellerName) {
					errors.push("You can not buy your own item.");
				}
			}
			if (errors.length !== 0) {
				reject(errors);
			}

			// send money
			await this.createTransaction(
				buyer,
				listingObject.seller,
				listingObject.itemPrice,
				listingObject.id
			);

			// give item to buyer
			const itemPayload = await this.getPayloadForListing(listing);

			// put the payload and listing in private/users/{user}/owned
			this.ref
				.child("private")
				.child("users")
				.child(buyer)
				.child("owned")
				.child(listingObject.id)
				.set({
					listingObject: listingObject,
					itemPayload: itemPayload,
					date: Date.now()
				});
			// update item listing to mark it as sold
			this.ref
				.child("item_listings")
				.child(listingObject.id)
				.update({ buyer: buyer });

			resolve("Successfully bought item");
		});
	}
}
