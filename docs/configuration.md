# Authentication service configuration

By default, the authentication service comes with the most optimized and ideal settings for a medium sized DiscDoor instance.

The configuration files for `dd-auth` are stored in the `data/` folder.

## Salt warning
Remember to CHANGE THE SALT! The default one provided here has only been provided for simplicity and testing, but please change it for production to avoid **serious** security issues.

## Default configuration file

Default `dd-auth` configuration file (as of Jan 2023):

```json
{
    "http": {
        "port": 8082,
        "restrict_hostname": "localhost"
    },
    "db": {
        "name": "discdoor",
        "url": "mongodb://127.0.0.1:27017"
    },
    "crypto": {
        "algo": "bcrypt",
        "params": {
            "salt": [
                246, 117, 237, 17,
                141,   4, 134, 99,
                147, 169, 122, 142
            ],
            "rounds": 13
        }
    },
    "session": {
        "maxAge": 6048000
    },
    "limits": {
        "username": {
            "minLen": 2,
            "maxLen": 30
        },
        "avatar": {
            "maxSize": 2097152
        }
    },
    "defaults": {
        "avatarUrl": "/assets/defaults/avatar1.png"
    },
    "extern": {
        "cdn": "http://localhost:8082"
    }
}
```

**Clarifications**:

 - `http.port` - The http port to listen to.
 - `http.restrict_hostname` - Restricted API access grant hostname. Should be set to the same hostname as which the gateway locally runs on. You can leave this as is.
 - `crypto.algo` - Crypto algorithm to use. It's recommended to stick with bcrypt.
 - `crypto.params.salt` - The salt prepended before each password hash. Change it ASAP if you haven't changed it from the default.
 - `crypto.params.rounds` - Hashing rounds. 13 has been found to be the best number between security and hashing speed.
 - `session.maxAge` - Time until session expires (in seconds).
 - `limits` - Various limits
 - `defaults.avatarUrl` - Default avatar URL to use.
