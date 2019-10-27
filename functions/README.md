# FScoin

----------------

Documentation for the FScoin Firebase Functions API

----------------

## Register

```
POST https://us-central1-fscoin-f7656.cloudfunctions.net/api/register
```

Registration route.

----------------

### Request

> 
> **Header**
> 
> |Key|Value|Description|
> |---|---|---|
> |Content-Type|application/x-www-form-urlencoded||
> 
> **Body**
> 
> |Key|Value|Type|Description|
> |---|---|---|---|
> |username|luka|text|username , min: 1 , max: 50|
> |password|testpassword|text|password , min: 6 , max: 1000|
> |email|testemail@example.com|text|email , min: 4 , max: 1000|
> 

----------------

## Login

```
POST https://us-central1-fscoin-f7656.cloudfunctions.net/api/login
```

Log in, returns success if username and password combo are registered.

----------------

### Request

> 
> **Header**
> 
> |Key|Value|Description|
> |---|---|---|
> |Content-Type|application/x-www-form-urlencoded||
> 
> **Body**
> 
> |Key|Value|Type|Description|
> |---|---|---|---|
> |username|luka|text|username , min: 1 , max: 50|
> |password|testpassword|text|password , min: 6 , max: 1000|
> 

----------------

## Get purchases and listings

```
POST https://us-central1-fscoin-f7656.cloudfunctions.net/api/myPurchases
```

Get a list of purchases and a list of listings.

----------------

### Request

> 
> **Header**
> 
> |Key|Value|Description|
> |---|---|---|
> |Content-Type|application/x-www-form-urlencoded||
> 
> **Body**
> 
> |Key|Value|Type|Description|
> |---|---|---|---|
> |username|luka|text|username , min: 1 , max: 50|
> |password|testpassword|text|password , min: 6 , max: 1000|
> 

----------------

## Get transactions

```
POST https://us-central1-fscoin-f7656.cloudfunctions.net/api/myTransactions
```

Get a list of sent and recieved transactions.

----------------

### Request

> 
> **Header**
> 
> |Key|Value|Description|
> |---|---|---|
> |Content-Type|application/x-www-form-urlencoded||
> 
> **Body**
> 
> |Key|Value|Type|Description|
> |---|---|---|---|
> |username|gio|text|username , min: 1 , max: 50|
> |password|testpassword|text|password , min: 6 , max: 1000|
> 

----------------

## Create money

```
POST https://us-central1-fscoin-f7656.cloudfunctions.net/api/sendAsAdmin
```

Send money to an account as the administrator.

----------------

### Request

> 
> **Header**
> 
> |Key|Value|Description|
> |---|---|---|
> |Content-Type|application/x-www-form-urlencoded||
> 
> **Body**
> 
> |Key|Value|Type|Description|
> |---|---|---|---|
> |adminpass|adminpass|text|Administrator password|
> |recipient|gio|text|username of recipient , min: 1 , max: 50|
> |amount|200|text|amount to send , min: 1 , max: 5000000000|
> 

----------------

## Send money

```
POST https://us-central1-fscoin-f7656.cloudfunctions.net/api/send
```

Send money to another user

----------------

### Request

> 
> **Header**
> 
> |Key|Value|Description|
> |---|---|---|
> |Content-Type|application/x-www-form-urlencoded||
> 
> **Body**
> 
> |Key|Value|Type|Description|
> |---|---|---|---|
> |username|gio|text|username , min: 1 , max: 50|
> |password|testpassword|text|password , min: 6 , max: 1000|
> |recipient|luka|text|username of recipient , min: 1 , max: 50|
> |amount|2|text|amount to send , min: 1 , max: 5000000000|
> 

----------------

## Create listing

```
POST https://us-central1-fscoin-f7656.cloudfunctions.net/api/createListing
```

Create a listing to sell a digital item.

----------------

### Request

> 
> **Header**
> 
> |Key|Value|Description|
> |---|---|---|
> |Content-Type|application/x-www-form-urlencoded||
> 
> **Body**
> 
> |Key|Value|Type|Description|
> |---|---|---|---|
> |username|gio|text|username , min: 1 , max: 50|
> |password|testpassword|text|password , min: 6 , max: 1000|
> |name|Another Item|text|name of item , min: 1 , max: 40|
> |description|Test description for this other item|text|description of item , min: 1 , max: 2000|
> |payload|this is another test payload|text|payload(the string being sold) , min: 1 , max: 50000|
> |price|102|text|amount to send , min: 1 , max: 5000000000|
> 

----------------

## Purchase listing

```
POST https://us-central1-fscoin-f7656.cloudfunctions.net/api/buyItem
```

Create a listing to sell a digital item.

----------------

### Request

> 
> **Header**
> 
> |Key|Value|Description|
> |---|---|---|
> |Content-Type|application/x-www-form-urlencoded||
> 
> **Body**
> 
> |Key|Value|Type|Description|
> |---|---|---|---|
> |username|luka|text|username , min: 1 , max: 50|
> |password|testpassword|text|password , min: 6 , max: 1000|
> |listing|a9f03143bd7bfcd96436926a31595c1bc9b5d7c0|text|listing ID , min: 1 , max: 400|
> 

----------------

----------------

Author: [Lukabuz](https://github.com/lukabuz)

Language - [Typescript](https://www.typescriptlang.org/)
Database API - [Firebase Realtime Database](https://firebase.google.com/docs/database)
Serverless Functions API - [Firebase Cloud Functions](https://firebase.google.com/docs/functions)
NodeJS HTTP Framework - [ExpressJS](https://expressjs.com/)
Documentation Built with [Postman](https://expressjs.com/) and [Postdown](https://github.com/TitorX/Postdown).
