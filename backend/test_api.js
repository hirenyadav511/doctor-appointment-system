import axios from 'axios';
async function test() {
  try {
    const res = await axios.post('http://localhost:5001/api/admin/login', { email: 'admin@example.com', password: 'admin12345' });
    console.log(res.data);
    const token = res.data.token;
    const dashRes = await axios.get('http://localhost:5001/api/admin/dashboard', { headers: { aToken: token } });
    console.log(dashRes.data);
  } catch(e) {
    console.error(e.message);
  }
}
test();
