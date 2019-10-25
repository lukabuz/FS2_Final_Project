import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";
import * as parser from "body-parser";
import * as hash from "object-hash";
import { Validator } from "./validator";
import * as admin from "firebase-admin";
import Database from "./database";
import { resolve } from "url";

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
	return new Promise(async (resolve: any, reject: any) => {
		const userExists = await dataInterface.checkIfUserExists(username);

		if (!userExists) {
			reject(false);
			return;
		}

		const userHash = await dataInterface.getUserHash(username);

		if (userHash === hash(password)) {
			resolve(true);
		} else {
			reject(false);
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

	const authenticated = authenticate(req.body.username, req.body.password);

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

	const authenticated = authenticate(req.body.username, req.body.password);
	const data = await dataInterface.getUserInfo(req.body.username);

	if (authenticated) {
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

exports.api = functions.https.onRequest(api);
