async function testAuth() {
    const baseURL = 'http://localhost:5000/api';
    const testUser = {
        name: 'Test Student',
        mobile: '1234567891', // Use a different number
        role: 'student',
        rollNo: 'S124'
    };

    try {
        console.log('Testing Registration...');
        const regRes = await fetch(`${baseURL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });
        const regData = await regRes.json();
        console.log('Registration Response:', regData);

        console.log('Testing Login...');
        const loginRes = await fetch(`${baseURL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                role: 'student',
                mobile: '1234567891',
                rollNo: 'S124'
            })
        });
        const loginData = await loginRes.json();
        console.log('Login Response:', loginData);
    } catch (err) {
        console.error('Error:', err.message);
    }
}

testAuth();
