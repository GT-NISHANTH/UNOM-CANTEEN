const mongoose = require('mongoose');
require('dotenv').config({ path: 'c:/Users/saini/OneDrive/Desktop/UNOM CFS/smart-canteen/server/.env' });

async function listFoods() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const db = mongoose.connection.db;
        const foods = await db.collection('foods').find({}).toArray();
        process.stdout.write(JSON.stringify(foods, null, 2));
        await mongoose.disconnect();
    } catch (err) {
        process.stderr.write(err.toString());
        process.exit(1);
    }
}

listFoods();
