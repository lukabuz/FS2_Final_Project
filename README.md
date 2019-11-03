# FSCoin

FSCoin is a react + firebase application that allows users to send and receive in-app money. It also allows users to sell and buy virtual items(in the form of strings) which could be game keys, crypto wallet keys, or any other resource that can be represented as a string(even a link to a private webpage, which opens up millions of possibilities).

# Backend

The backend is an API built using Firebase Cloud Functions, Firebase Realtime Database, Express, and
Typescript.
#### Database Schema
- Users
	- email - String
	- name - String
- Transactions
	- amount - Number
	- date - Number
	- to - (user) String
	- from - (user) String
	- listingId (optional) - String 
- Item_Listings
	- itemName - String
	- itemDescription - String
	- itemPayload - String
	- itemPrice - Number
	- listingDate - Number
	- buyer (optional) (user) - String

### [API Documentation](functions/README.md)

# React App

- The react app is built using the BloomerJS css library
- It uses the src/Auth.js file for authentication
- It uses the src/Data.js file as an API wrapper

#### Components List
- App.js - Main component, contains navbar. Uses react-router to handle routing. Initializes the authenticator and passes it down to components that need it.
- Home - Home component, contains info screen and transactions list.
- UserPage - Main User page component. Uses API wrapper to get user info. Contains forms for transaction sending and depositing.
	- Listings - The listings list component of UserPage
	- Purchases - The purchases list component of UserPage
	- Transactions - The transactions list component of UserPage
- Login - The login page
- Register - The register page

# How To Run

To run the react app, you must

    $ cd web
	$ npm start

To deploy functions, you must initialize a firebase project

	$ firebase init
	$ firebase deploy --only functions
	$ firebase deploy --only hosting

The react app is already deployed at https://fscoin-f7656.firebaseapp.com/