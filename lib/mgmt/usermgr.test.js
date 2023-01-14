/*
Unit test to check if user manager can register and manage users successfully.
*/

const usermgr = require('./usermgr');
const {MongoClient} = require('mongodb');
const User = require('../types/user');

describe('User manager', () => {
    let connection;
    let db;
    /** @type {usermgr} */
    let umgr;
  
    beforeAll(async () => {
      connection = await MongoClient.connect(global.__MONGO_URI__, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      db = await connection.db('discdoor');
      umgr = new usermgr(db);
    });

    // Test case: Create user
    /** @type {User} Tracking variable for test user - we need this later */
    let testUser;

    test('create user', async ()=> {
        const DOB = new Date();
        testUser = await umgr.createUser("user@test.com", "test user", "test user", DOB);
        
        expect(testUser).toBeTruthy();
        expect(testUser.username).toBe("test user");
        expect(testUser.dateOfBirth).toBe(DOB);
        expect(testUser.email).toBe("user@test.com");
    });

    // Test case: validate password. Password must always be valid here.
    test('validate password is correct', async ()=> {
        const result = await testUser.verifyPassword("test user");
        expect(result).toBe(true);
    });

    // Test case: validate password but the user got it wrong. result must be false.
    test('invalidate wrong password', async ()=> {
        const result = await testUser.verifyPassword("bla bla bla");
        expect(result).toBe(false);
    });

    // Test case: is the safe user view actually safe?
    test('safe view is actually safe', async () => {
        const safeView = testUser.createSafeView();
        expect(safeView.passwordHash).toBeUndefined();
    });

    // Test case: does the cache view leak too much information?
    test('cache view does not leak more info than needed', async() => {
        const cacheView = testUser.createCacheView();

        expect(cacheView.passwordHash).toBeUndefined();
        expect(cacheView.phone).toBeUndefined();
        expect(cacheView.verifStatus).toBeUndefined();
        expect(cacheView.lastLoginDate).toBeUndefined();
        expect(cacheView.dateOfBirth).toBeUndefined();
        expect(cacheView.email).toBeUndefined();
    });

    // Test case: avatar url is set correctly.
    test('set avatar url correctly', async() => {
        const TEST_URL = 'http://test.com/test.png';
        await testUser.setAvatarUrl(TEST_URL);
        expect(testUser.avatarUrl).toBe(TEST_URL);
    });

    // Test case: change the username
    test('change username', async() => {
      const NEW_USR = 'new username';
      await testUser.changeUsername(NEW_USR);
      expect(testUser.username).toBe(NEW_USR);
    });

    // Test case: change the email
    test('change email', async() => {
      const NEW_EMAIL = 'test@test.net';
      await testUser.changeEmail(NEW_EMAIL);
      expect(testUser.email).toBe(NEW_EMAIL);
    });
  
    afterAll(async () => {
      await connection.close();
    });
  });