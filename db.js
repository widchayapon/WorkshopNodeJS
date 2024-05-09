const mongoose = require('mongoose');

const { DB_HOST, DB_PORT, DB_NAME, DB_PASS, DB_USER } = process.env;

mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
    user: DB_USER,
    pass: DB_PASS,
}).then(() => {
    console.log('✅ DB Connected');
}).catch(err => {
    console.error('❌ DB Connection Failed !!', err);
});