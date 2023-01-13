/*
Unit test to check if session manager can register and manage sessions successfully.
*/

const sessionmgr = require('./sessionmgr');
const usermgr = require('./usermgr');
const {MongoClient} = require('mongodb');
const User = require('../types/user');

describe('Session manager', () => {
    let connection;
    let db;
    /** @type {usermgr} */
    let umgr;

    /** @type {sessionmgr} */
    let smgr;

    /** @type {User} */
    let testUser;
  
    beforeAll(async () => {
      connection = await MongoClient.connect(global.__MONGO_URI__, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      db = await connection.db('discdoor');
      umgr = new usermgr(db);
      smgr = new sessionmgr(db);
      
      // Create test user
      testUser = await umgr.createUser("test@user.com", "testuser12345", "testuser12345", new Date());
    });

    // Test case: Create session
    let lastSessionKey; // Keep track of last session key for next test

    test('create session', async ()=> {
        const session = await smgr.createSession(testUser);
        expect(session).toBeTruthy();
        expect(session.id).toBe(testUser.id);
        lastSessionKey = session.key;
    });

    // Test case: get session from key
    test('get session', async() => {
        const session = await smgr.getSession(lastSessionKey);
        expect(session).toBeTruthy();
        expect(session.key).toBe(lastSessionKey);
    });

    // Test case: validate session
    test('validate session', async() => {
        const result = await smgr.validateSession(lastSessionKey);
        expect(result).toBe(true);
    });
  
    afterAll(async () => {
      await connection.close();
    });
  });