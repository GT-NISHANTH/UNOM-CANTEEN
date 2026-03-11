const mongoose = require('mongoose');
require('dotenv').config({ path: 'c:/Users/saini/OneDrive/Desktop/UNOM CFS/smart-canteen/server/.env' });

async function findIds() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const User = mongoose.model('User', new mongoose.Schema({}), 'users');
        const Food = mongoose.model('Food', new mongoose.Schema({}), 'foods');

        const user = await User.findOne({});
        const food = await Food.findOne({});

        console.log(`USER_ID:${user._id}`);
        console.log(`FOOD_ID:${food._id}`);

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

findIds();
