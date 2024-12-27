require('dotenv').config();

const config = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseUrl: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId
};

module.exports = config;
