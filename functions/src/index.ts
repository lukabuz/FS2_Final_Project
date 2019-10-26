import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";
import * as parser from "body-parser";
import * as hash from "object-hash";
import { Validator } from "./validator";
import * as admin from "firebase-admin";
import Database from "./database";

admin.initializeApp();
const db: any = admin.database();
const dataInterface = new Database(db);

// function for determining if a body is a json string
const isJsonString = (str: any): boolean => {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
};

const authenticate = (username: string, password: string) => {
	return new Promise(async (resolve: any) => {
		const userExists = await dataInterface.checkIfUserExists(username);

		if (!userExists) {
			resolve(false);
			return;
		}

		const userHash = await dataInterface.getUserHash(username);

		if (userHash === hash(password)) {
			resolve(true);
		} else {
			resolve(false);
		}
	});
};

// middleware for parsing req.body
const parsingMiddleware = (req: any, res: any, next: any) => {
	if (isJsonString(req.body)) {
		req.body = JSON.parse(req.body);
	}
	next();
};

const authenticationMiddleware = async (req: any, res: any, next: any) => {
	const validator = new Validator(
		[
			{
				variableName: "username",
				displayName: "username",
				minLength: 1,
				maxLength: 50
			},
			{
				variableName: "password",
				displayName: "password",
				minLength: 6,
				maxLength: 1000
			}
		],
		req.body
	);

	if (!validator.validate()) {
		res.json({ status: "error", errors: validator.errors });
		return;
	}

	const authenticated = await authenticate(
		req.body.username,
		req.body.password
	);

	if (authenticated) {
		next();
	} else {
		res.json({ status: "error", errors: ["Unable to authenticate."] });
		return;
	}
};

// initialize express, set cors, and handle body parsing
const api = express();
api.use(cors({ origin: true }));
api.use(parser.urlencoded({ extended: false }));
api.use(parser.json());
api.use(parsingMiddleware);

api.post("/login", async (req: any, res: any) => {
	const validator = new Validator(
		[
			{
				variableName: "username",
				displayName: "username",
				minLength: 1,
				maxLength: 50
			},
			{
				variableName: "password",
				displayName: "password",
				minLength: 6,
				maxLength: 1000
			}
		],
		req.body
	);

	if (!validator.validate()) {
		res.json({ status: "error", errors: validator.errors });
		return;
	}

	const authenticated = await authenticate(
		req.body.username,
		req.body.password
	);

	if (authenticated) {
		const data = await dataInterface.getUserInfo(req.body.username);
		res.json({ status: "success", username: req.body.username, data: data });
	} else {
		res.json({ status: "error", errors: ["Unable to authenticate."] });
		return;
	}
});

api.post("/register", async (req: any, res: any) => {
	const validator = new Validator(
		[
			{
				variableName: "username",
				displayName: "username",
				minLength: 1,
				maxLength: 50
			},
			{
				variableName: "password",
				displayName: "password",
				minLength: 6,
				maxLength: 1000
			},
			{
				variableName: "email",
				displayName: "email",
				minLength: 4,
				maxLength: 1000
			}
		],
		req.body
	);

	if (!validator.validate()) {
		res.json({ status: "error", errors: validator.errors });
		return;
	}

	const userExists = await dataInterface.checkIfUserExists(req.body.username);

	if (userExists) {
		res.json({ status: "error", errors: ["User already exists."] });
		return;
	}

	dataInterface.createUser(
		req.body.username,
		hash(req.body.password),
		req.body.email
	);

	res.json({ status: "success" });
	return;
});

api.post("/send", authenticationMiddleware, async (req: any, res: any) => {
	const validator = new Validator(
		[
			{
				variableName: "recipient",
				displayName: "recipient",
				minLength: 1,
				maxLength: 50
			},
			{
				variableName: "amount",
				displayName: "amount",
				minLength: 1,
				maxLength: 5000000000
			}
		],
		req.body
	);

	if (!validator.validate()) {
		res.json({ status: "error", errors: validator.errors });
		return;
	}

	dataInterface
		.createTransaction(req.body.username, req.body.recipient, +req.body.amount)
		.then((id: any) => {
			res.json({
				status: "success",
				message: "Transaction " + id + " sent successfully.",
				id: id
			});
			return;
		})
		.catch((e: any) => {
			res.json({ status: "error", errors: [e] });
			return;
		});
	return;
});

api.post("/sendAsAdmin", async (req: any, res: any) => {
	const validator = new Validator(
		[
			{
				variableName: "adminpass",
				displayName: "administrator password",
				minLength: 1,
				maxLength: 50
			},
			{
				variableName: "recipient",
				displayName: "recipient",
				minLength: 1,
				maxLength: 50
			},
			{
				variableName: "amount",
				displayName: "amount",
				minLength: 1,
				maxLength: 5000000000
			}
		],
		req.body
	);

	if (!validator.validate()) {
		res.json({ status: "error", errors: validator.errors });
		return;
	}

	if (functions.config().admin.password === req.body.adminpass) {
		dataInterface
			.giveUserMoney(req.body.recipient, +req.body.amount)
			.then((id: any) => {
				res.json({
					status: "success",
					message: "Transaction " + id + " sent successfully.",
					id: id
				});
			})
			.catch((e: any) => {
				res.json({ status: "error", errors: [e] });
			});
	} else {
		res.json({ status: "error", errors: ["Wrong password."] });
	}
});

api.post(
	"/createListing",
	authenticationMiddleware,
	async (req: any, res: any) => {
		const validator = new Validator(
			[
				{
					variableName: "name",
					displayName: "item name",
					minLength: 1,
					maxLength: 40
				},
				{
					variableName: "description",
					displayName: "item description",
					minLength: 1,
					maxLength: 2000
				},
				{
					variableName: "price",
					displayName: "item price",
					minLength: 1,
					maxLength: 5000000000
				},
				{
					variableName: "payload",
					displayName: "payload",
					minLength: 1,
					maxLength: 50000
				}
			],
			req.body
		);

		if (!validator.validate()) {
			res.json({ status: "error", errors: validator.errors });
			return;
		}

		dataInterface
			.createListing(
				req.body.username,
				req.body.name,
				req.body.payload,
				+req.body.price,
				req.body.description
			)
			.then((id: string) => {
				res.json({
					status: "success",
					message: "Listing " + id + " created successfully.",
					id: id
				});
			})
			.catch((e: string) => {
				res.json({ status: "error", errors: [e] });
			});
		return;
	}
);

api.post("/buyItem", authenticationMiddleware, async (req: any, res: any) => {
	const validator = new Validator(
		[
			{
				variableName: "listing",
				displayName: "listing ID",
				minLength: 1,
				maxLength: 400
			}
		],
		req.body
	);

	if (!validator.validate()) {
		res.json({ status: "error", errors: validator.errors });
		return;
	}

	dataInterface
		.buyItem(req.body.username, req.body.listing)
		.then((item: string) => {
			res.json({
				status: "success",
				data: item
			});
		})
		.catch((e: string) => {
			res.json({ status: "error", errors: e });
		});
	return;
});

api.post(
	"/myTransactions",
	authenticationMiddleware,
	async (req: any, res: any) => {
		const sent = await dataInterface.getUserTransactions(
			req.body.username,
			true
		);
		const received = await dataInterface.getUserTransactions(
			req.body.username,
			false
		);

		const balance = await dataInterface.getUserBalance(req.body.username);

		res.json({
			status: "success",
			balance: balance,
			sent: sent,
			received: received
		});
	}
);

api.post(
	"/myPurchases",
	authenticationMiddleware,
	async (req: any, res: any) => {
		const purchases = await dataInterface.getUserPurchases(req.body.username);
		const listings = await dataInterface.getUserListings(req.body.username);

		res.json({
			status: "success",
			purchases: purchases,
			listings: listings
		});
	}
);

// TODO

// DONE
// buy listing
// send transaction
// send admin transaction
// create listing
// get user transaction data
// get user purchase data

exports.api = functions.https.onRequest(api);
