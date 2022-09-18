/*
Authentication service source.
*/

const express = require('express');
const app = express();
const cfg = require('./data/config.json');

// Setup routes
app.get(`/auth/register`, (req, res)=>{

});

app.listen(cfg.http.port, () => {
    console.log(`DiscDoor Auth service available at :${cfg.http.port}`);
});