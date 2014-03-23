Pillar API
===

Access at
http://spa-api.herokuapp.com/

Running locally
====

1. `cd api`

2. Install node.js dependencies

        npm install

3. Start mongo

        mongod --dbpath data/

4. Start the app

        node app.js

==================

## API End Points

#### User data returned in each response

    {
        "response": "OK",
        "user": {
            "__v": 0,
            "_id": "532d703b5331699ae745db51",
            "username": "tu",
            "scores": [
                {
                    "score": 5,
                    "_id": "532d70425331699ae745db52",
                    "timestamp": "2014-03-22T11:14:40.710Z"
                },
                {
                    "score": 5,
                    "_id": "532d704a5331699ae745db53",
                    "timestamp": "2014-03-22T11:14:40.710Z"
                },
                {
                    "score": 10,
                    "_id": "532d70935e3e83f5e77b9e85",
                    "timestamp": "2014-03-22T11:14:27.218Z"
                }
            ],
            "created_at": "2014-03-22T11:12:59.250Z"
        }
    }

#### Sign up a user

`POST /signup`

Form needed:

    username: phone's id

In case of an error:

    {
        "response": "FAIL",
        "errors": [
            "User already exists"
        ]
    }

#### Login the user

`POST /signing`

Form needed:

    username: phone's id

In case user not found:

    {
        "response": "FAIL",
        "errors": [
            "User not found"
        ]
    }

#### Add a score

`POST /addscore`

Form needed:

    score: the new score to add

#### Add a new message for logged in user

`POST addmessage`

Form needed:

    message: message body (**must** be 10-2000 characters)

Response:

    {
        "response": "OK",
        "message": {
            "__v": 0,
            "message": "o thou art",
            "username": "tu",
            "_id": "532d7f7b0ae6fd58f7dc129a",
            "created_at": "2014-03-22T12:18:03.217Z"
        }
    }

#### Get all messages posted by logged in user

`GET /mymessages`

Response:

    {
        "response": "OK",
        "messages": [
            {
                "message": "\"hello world\"",
                "username": "tu",
                "_id": "532d7f710ae6fd58f7dc1299",
                "__v": 0,
                "created_at": "2014-03-22T12:17:53.550Z"
            },
            {
                "message": "o thou art",
                "username": "tu",
                "_id": "532d7f7b0ae6fd58f7dc129a",
                "__v": 0,
                "created_at": "2014-03-22T12:18:03.217Z"
            }
        ]
    }

#### Get all messages on the network except those by logged in user, sortest by timestamp

`GET /allmessages`

Response:

    {
        "response": "OK",
        "messages": [
            {
                "message": "o thou art",
                "username": "tu",
                "_id": "532d7f7b0ae6fd58f7dc129a",
                "__v": 0,
                "created_at": "2014-03-22T12:18:03.217Z"
            },
            {
                "message": "\"hello world\"",
                "username": "tu",
                "_id": "532d7f710ae6fd58f7dc1299",
                "__v": 0,
                "created_at": "2014-03-22T12:17:53.550Z"
            }
        ]
    }

#### Get a random quote from the bible

`GET /getquote`

Response:

    {
        "response": "OK",
        "quote": {
            "title": "1 John 5:4",
            "preview": "because everyone who is fathered by God conquers the world. \r\nAnd this is the victory which has conquered the world: our faith."
        }
    }

##### Reply to an existing message

`POST sendmessage`

Form needs:

    messageID - objectID of the message to which this is a reply
    message - body of the message
    messageTitle - title of the message (1 John 5: or empty)

Response:

    {
        "response": "OK",
        "message": {
            "__v": 0,
            "_id": "532d7f710ae6fd58f7dc1299",
            "message": "\"hello world\"",
            "username": "tu",
            "replies": [
                {
                    "message": "this is a testing message reply",
                    "title": "",
                    "_id": "532dccd88636f300005e9e80",
                    "timestamp": "2014-03-22T17:48:08.650Z"
                }
            ],
            "created_at": "2014-03-22T12:17:53.550Z"
        }
    }

#### Get details of a given message

`GET /getmessage`

Params:

    messageID - the id of the message

Response

    {
        "response": "OK",
        "messages": {
            "message": "\"hello world\"",
            "username": "tu",
            "_id": "532d7f710ae6fd58f7dc1299",
            "__v": 0,
            "created_at": "2014-03-22T12:17:53.550Z"
        }
    }
