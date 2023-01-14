# Hashing and verification

## Introduction

`dd-auth` uses the BCrypt hashing algorithm to hash and verify passwords. It has been used in many commercial applications successfully and we trust its effectiveness.

## Why BCrypt?

BCrypt has been chosen because it has been proven to be one of the most cryptographically sound algorithms out there right now. That said, some tradeoffs have to be made to leverage BCrypt to its maximum potential/effectiveness.

Namely:
 * Compared to more conventional (Sha256) algorithms, more computing power is generally needed to effectively hash a password.

 * In our case, we require 13 rounds of BCrypt to effectively hash user passwords. This number of rounds has been found to be "just-right", where the speed of computation in relation to security has been effectively leveraged.

 * Single core performance of the target deployment server is critical.

## Choosing another algorithm

If BCrypt is not sufficient or is too compromising in terms of performance, it is possible to change the default algorithm. To do this, navigate to `lib/util/crypt.js` and change the default parameter to specify `sha256` instead of `bcrypt`.

Please think twice before doing this, we instead recommend you to change the salt rounds as a means of compromise instead of an inferior algorithm.