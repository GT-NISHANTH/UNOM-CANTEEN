const mongoose = require('mongoose');
require('dotenv').config({ path: 'c:/Users/saini/OneDrive/Desktop/UNOM CFS/smart-canteen/server/.env' });

async function listUsersAndFoods() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const db = mongoose.connection.db;

        const users = await db.collection('users').find({}).toArray();
        const foods = await db.collection('foods').find({}).toArray();

        console.log('--- Users ---');
        console.log(JSON.stringify(users, null, 2));
        console.log('--- Foods ---');
        console.log(JSON.stringify(foods, null, 2));

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

listUsersAndFoods();
