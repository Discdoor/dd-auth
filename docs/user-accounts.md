# User Accounts

`dd-auth` user accounts are stored in a MongoDB database. The name of this database can be customized, but in the context of DiscDoor, it is simply using the `discdoor` database.

## Structure
User accounts have a username, which can be non-unique. The uniqueness is achieved by the use of a discriminant, which is a 4 number tag appended at the end of a username. Because usernames can change, users are identified uniquely by an ID number, which is autogenerated.

When a new account is created, it is placed in verification level -1 (unverified). An account upgrades to level 0 if verification is being awaited, and is upgraded to level 1 if their email has successfully been verified. Accounts can also hit level 2 if the owner chooses to verify their phone number. Additionally, if the user changes their phone or email, the level is adjusted accordingly.

Cosmetics are generally not handled by the authentication service, except for storing the avatar URL for a user.

## Models

### User Object
User accounts are stored as objects in the `users` collection. Users are entities, and therefore have an ID.

A user object looks like this:

| Property      | Type                 | Description                                         
| ------------- | -------------------- | ------------------------------------------------------
| id            | string               | The ID of the user. Autogenerated by backend.
| bot           | boolean              | Whether this user is a registered bot account.
| username      | string               | The name of this user.
| discrim       | string               | The discriminant. Autogenerated.
| email         | string               | User email.
| phone         | string               | User phone number.
| avatarUrl     | string               | An URL pointing to an image file storing the user avatar.
| passwordHash  | string               | Stored password hash used to verify password.
| verifStatus   | string               | The account verification level.
| creationDate  | Date                 | When the account was created.
| lastLoginDate | Date                 | When the user last logged in.
| dateOfBirth   | Date                 | User date of birth.

### Session Objects
Session objects are stored in the `sessions` collection and are linked to a user.

A session object looks like this:

| Property | Type   | Description
| -------- | ------ | ------------
| key      | string | The session key.
| expiry   | number | Unix timestamp of expiry date.
| id       | string | Associated user ID.