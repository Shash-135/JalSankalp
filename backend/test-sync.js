const axios = require('axios');
const fs = require('fs');
const token = fs.readFileSync('test-token.txt', 'utf8').trim() || '';

async function run() {
  try {
    const res = await axios.post('http://localhost:5000/api/pump/sync', {
      logs: [{ pump_id: 1, action: 'start' }]
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('SUCCESS', res.data);
  } catch (err) {
    if (err.response) {
      console.log('ERROR STATUS:', err.response.status);
      console.log('ERROR DATA:', err.response.data);
    } else {
      console.log('ERROR:', err.message);
    }
  }
}
run();
