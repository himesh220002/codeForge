const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

async function test() {
  await mongoose.connect('mongodb+srv://satyamhimesh:06452220002Hq@cluster0.ckkeqng.mongodb.net/myProgressDB?retryWrites=true&w=majority');
  
  const User = mongoose.connection.collection('users');
  const user = await User.findOne({});
  
  const token = jwt.sign(
      { userId: user._id.toString(), role: user.role || 'user' },
      'lookbehindyou',
      { expiresIn: '15m' }
  );
  
  const res = await fetch('http://localhost:5000/api/user/settings', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await res.json();
  console.log("Get Response:", res.status, data);

  process.exit(0);
}

test();
