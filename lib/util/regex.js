/*
This file contains common regular expressions for special strings, such as email addresses.
*/

const RGX_EMAIL = /^[A-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[A-Z0-9.-]+$/;
const RGX_HTTP_URL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

module.exports = {
    RGX_EMAIL,
    RGX_HTTP_URL
}