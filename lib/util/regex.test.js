const { RGX_EMAIL, RGX_HTTP_URL } = require("./regex");


// Suite to test proposed regexes
describe('Regular expression testing', () => {
    // Case 1: check mail regex with valid email
    test('email regex with valid email', () => {
        expect(RGX_EMAIL.test("yes@good.com")).toBe(true);
    });

    // Case 2: check mail regex with invalid email
    test('email regex with invalid email', () => {
        expect(RGX_EMAIL.test("yesgood")).toBe(false);
    });

    // Case 3: check http url regex with valid url
    test('http regex with valid url', () => {
        expect(RGX_HTTP_URL.test("http://youtube.com")).toBe(true);
    });

    // Case 4: check http url regex with invalid url
    test('http regex with invalid url', () => {
        expect(RGX_HTTP_URL.test("youtube")).toBe(false);
    });
});