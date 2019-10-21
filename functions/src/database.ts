export default class Database {
	private ref: any;

	constructor(db: Database) {
		this.ref = db.ref();
	}

	checkIfUserExists(user: string) {
		return new Promise(resolve => {
			this.ref
				.child("users")
				.child(user)
				.once("value", function(snapshot: any) {
					resolve(snapshot.val() !== null);
				});
		});
	}

	createUser(username: string, passwordHash: string, email: string) {
		this.ref
			.child("users")
			.child(username)
			.set({
				username: username,
				email: email
			});
		this.ref
			.child("private")
			.child(username)
			.set({
				passwordHash: passwordHash
			});
	}

	getUserHash(username: string) {
		return new Promise((resolve: any, reject: any) => {
			this.ref
				.child("private")
				.child(username)
				.on("value", function(snapshot: any) {
					const privateInfo = snapshot.val();
					if (privateInfo === null) {
						reject(new Error("User does not exist."));
					}
					resolve(privateInfo.passwordHash);
				});
		});
	}

	getUserInfo(username: string) {
		return new Promise((resolve: any, reject: any) => {
			this.ref
				.child("users")
				.child(username)
				.on("value", function(snapshot: any) {
					const user = snapshot.val();
					if (user === null) {
						reject(new Error("User does not exist."));
					}
					resolve(user);
				});
		});
	}
}
