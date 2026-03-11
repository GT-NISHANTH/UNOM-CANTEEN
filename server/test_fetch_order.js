async function testOrder() {
    const orderData = {
        user: "67c99253060d0ab46d311531",
        items: [
            {
                food: "69ab9c488fa2d4653060d0ab",
                quantity: 2
            }
        ],
        totalAmount: 90
    };

    try {
        const response = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error:', err);
    }
}

testOrder();
