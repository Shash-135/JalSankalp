const axios = require('axios');

async function testOtp() {
    try {
        console.log("Sending POST to live backend...");
        const res = await axios.post('https://jalsankalp.onrender.com/api/otp/send', {
            email: 'shashanktalekar7@gmail.com'
        });
        console.log("SUCCESS:", res.data);
    } catch (error) {
        console.log("ERROR STATUS:", error.response?.status);
        console.log("ERROR DATA:", error.response?.data);
        console.log("ERROR MSG:", error.message);
    }
}

testOtp();
