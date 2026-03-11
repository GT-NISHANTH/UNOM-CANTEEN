const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config({ path: 'c:/Users/saini/OneDrive/Desktop/UNOM CFS/smart-canteen/server/.env' });

async function testOrderPost() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const User = mongoose.model('User', new mongoose.Schema({}), 'users');
        const Food = mongoose.model('Food', new mongoose.Schema({ price: Number }), 'foods');

        const user = await User.findOne({});
        const food = await Food.findOne({});

        if (!user || !food) {
            console.error('User or Food not found');
            process.exit(1);
        }

        const orderData = {
            user: user._id,
            items: [{ food: food._id, quantity: 1 }],
            totalAmount: food.price
        };

        console.log('Sending Order Data:', JSON.stringify(orderData, null, 2));

        const response = await axios.post('http://localhost:5000/api/orders', orderData);
        console.log('Response Status:', response.status);
        console.log('Response Data:', JSON.stringify(response.data, null, 2));

        await mongoose.disconnect();
    } catch (err) {
        if (err.response) {
            console.error('Error Response:', err.response.data);
        } else {
            console.error('Error:', err.message);
        }
        process.exit(1);
    }
}

testOrderPost();
