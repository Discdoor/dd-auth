# API endpoint documentation

## `POST` /register
Registers a new user. Returns a session object upon successful registration.

Body Parameters:
 - `username` - The name of the user to register
 - `email` - The user's email address.
 - `password` - The password to register with.
 - `dob` - The date of birth expressed in unix time.

Results:
- `200` - If the account creation was successful
- `400` - If the account creation has failed.

Example Request:

Request: `POST /register`

Body:
```json
{
    "username": "Big Cool",
    "email": "bigcool@test.com",
    "password": "secure password",
    "dob": 1673688941965
}
```

Example Response:
```json
{
    "success": true,
    "message": "",
    "data": {
        "key": "3bfbfa5af2a21c67c59c3fceb2f103f3108c9185bc15eae27dec6566fe3f015b",
        "expiry": 1673689546765,
        "id": "372348579234952376"
    }
}
```

-----

## `POST` /login
Logs in with the specified details. Returns a session object on success.

Body Parameters:
 - `email` - The user's email address.
 - `password` - The password.

Results:
- `200` - If the login was successful
- `400` - If the login has failed.

Example Request:

Request: `POST /login`

Body:
```json
{
    "username": "Big Cool",
    "password": "secure password"
}
```

Example Response:
```json
{
    "success": true,
    "message": "",
    "data": {
        "key": "3bfbfa5af2a21c67c59c3fceb2f103f3108c9185bc15eae27dec6566fe3f015b",
        "expiry": 1673689546765,
        "id": "372348579234952376"
    }
}
```

-----

## `GET` /user/`:id:`/view
Internal endpoint to get a user object. This endpoint is restricted to whatever host is specified in the config.

Parameters:
 - `:id:` - The ID of the user.

Results:
- `200` - If retrieval was successful
- `400` - If retrieval has failed.

Example Request:

`GET /user/1673635559289/view`

Example Response:
```json
{
    "success": true,
    "message": "",
    "data": {
        "id": "1673635559289",
        "bot": false,
        "username": "Testing",
        "discrim": "6459",
        "avatarUrl": "/assets/defaults/avatar1.png",
        "creationDate": "2023-01-13T18:46:00.070Z"
    }
}
```

-----

## `POST` /session/validate
Validates the user session by verifying the token held in the `Authorization` header.

Header Parameters:
- `Authorization` - Contains the user bearer token and is formatted as `Bearer <key here>`.

Results:
- `200` - If the validation was successful
- `400` - If the validation has failed.

Example Request:

Request: `POST /session/validate`

Example Response:
```json
{
    "success": true,
    "message": "",
    "data": {
        "key": "3bfbfa5af2a21c67c59c3fceb2f103f3108c9185bc15eae27dec6566fe3f015b",
        "expiry": 1673689546765,
        "id": "372348579234952376"
    }
}
```

-----

## `GET` /user/@me
Gets the user object for the currently authenticated user.

Header Parameters:
- `Authorization` - Contains the user bearer token and is formatted as `Bearer <key here>`.

Results:
- `200` - If retrieval was successful
- `400` - If retrieval has failed.

Example Request:

`GET /user/@me`

Example Response:
```json
{
    "success": true,
    "message": "",
    "data": {
        "id": "1673635559289",
        "bot": false,
        "username": "Testing",
        "discrim": "6459",
        "email": "testing@gmail.com",
        "phone": "00000000000",
        "avatarUrl": "/assets/defaults/avatar1.png",
        "verifStatus": "AWAIT_VERIF",
        "creationDate": "2023-01-13T18:46:00.070Z",
        "lastLoginDate": "2023-01-14T09:42:49.217Z",
        "dateOfBirth": "2003-10-10T00:00:00.000Z"
    }
}
```

-----

## `PATCH` /user/@me
Changes user account details and returns the newly updated user state.

Header Parameters:
- `Authorization` - Contains the user bearer token and is formatted as `Bearer <key here>`.

Body Parameters:
 - `username` - The username (if the username is to be changed).
 - `email` - The email (if the email is to be changed).
 - `password` - The password (if the password is to be changed).

Results:
- `200` - If change was successful
- `400` - If change has failed.

Example Request:

`GET /PATCH/@me`

Body:
```json
{
    "password": "new secure password"
}
```

Example Response:
```json
{
    "success": true,
    "message": "",
    "data": {
        "id": "1673635559289",
        "bot": false,
        "username": "Testing",
        "discrim": "6459",
        "email": "testing@gmail.com",
        "phone": "00000000000",
        "avatarUrl": "/assets/defaults/avatar1.png",
        "verifStatus": "AWAIT_VERIF",
        "creationDate": "2023-01-13T18:46:00.070Z",
        "lastLoginDate": "2023-01-14T09:42:49.217Z",
        "dateOfBirth": "2003-10-10T00:00:00.000Z"
    }
}

-----