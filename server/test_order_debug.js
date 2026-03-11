const jwt = require('jsonwebtoken');

async function testPlaceOrder() {
    const baseURL = 'http://localhost:5000/api';
    const JWT_SECRET = 'smartcanteen'; // From .env

    // First, let's get a token for a student
    const token = jwt.sign({ id: '69ae79bf080a14cd222211140', role: 'student' }, JWT_SECRET, { expiresIn: '1d' });

    const orderData = {
        items: [
            {
                food: '69ab9c488fa2d4653060d0ab', // Real Food ID
                quantity: 2
            }
        ],
        totalAmount: 100
    };

    try {
        console.log('Testing Order Placement...');
        const res = await fetch(`${baseURL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });
        const data = await res.json();
        console.log('Response Status:', res.status);
        console.log('Response Data:', data);
    } catch (err) {
        console.error('Error:', err.message);
    }
}

testPlaceOrder();
