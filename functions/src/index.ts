import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";
import * as parser from "body-parser";

// function for determining if a body is a json string
const isJsonString = (str: any): boolean => {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
};

// middleware for parsing req.body
const parsingMiddleware = (req: any, res: any, next: any) => {
	if (isJsonString(req.body)) {
		req.body = JSON.parse(req.body);
	}
	next();
};

// initialize express, set cors, and handle body parsing
const api = express();
api.use(cors({ origin: true }));
api.use(parser.urlencoded({ extended: false }));
api.use(parser.json());
api.use(parsingMiddleware);

exports.api = functions.https.onRequest(api);
