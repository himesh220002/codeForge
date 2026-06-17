const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

async function test() {
  await mongoose.connect('mongodb+srv://satyamhimesh:06452220002Hq@cluster0.ckkeqng.mongodb.net/myProgressDB?retryWrites=true&w=majority');
  
  const User = mongoose.connection.collection('users');
  const user = await User.findOne({});
  if (!user) {
    console.log("No users found");
    process.exit(1);
  }
  
  console.log("Found user:", user._id.toString());
  
  const token = jwt.sign(
      { userId: user._id.toString(), role: user.role || 'user' },
      'lookbehindyou',
      { expiresIn: '15m' }
  );
  
  console.log("Token:", token);
  
  const res = await fetch('http://localhost:5000/api/user/settings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ nvidiaApiKey: 'test-api-key' })
  });
  
  const data = await res.json();
  console.log("Save Response:", res.status, data);

  const checkUser = await User.findOne({ _id: user._id });
  console.log("User after save:", checkUser);

  process.exit(0);
}

test();
