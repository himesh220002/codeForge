const jwt = require('jsonwebtoken');

const token = jwt.sign(
    { userId: '666db61214dc7de6b34360e2', role: 'user' },
    'lookbehindyou',
    { expiresIn: '15m' }
);

console.log(token);
