require('dotenv').config();
const mongoose = require('mongoose');
const http = require('http');
const fs = require('fs');

mongoose.connect(process.env.MONGO_URL, { dbName: '26CSPH10' })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('DB error:', err.message));

const Registration = mongoose.model(
  'Registration',
  new mongoose.Schema({
    email: String,
    phone: String,
    age: Number,
    password: String
  }),
  'Registrations'
);

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/register') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        await Registration.create(JSON.parse(body));
        console.log('Saved!');
        res.end('ok');
      } catch (err) {
        console.log('Error:', err.message);
        res.statusCode = 500;
        res.end('error');
      }
    });
    } else if (req.method === 'POST' && req.url === '/login') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { email, password } = JSON.parse(body);
        const user = await Registration.findOne({ email, password });
        res.statusCode = user ? 200 : 401;
        res.end(user ? 'ok' : 'wrong');
      } catch (err) {
        res.statusCode = 500;
        res.end('error');
      }
    });
  } else {
    fs.readFile('home.html', (err, content) => {
      res.end(err ? 'home.html not found' : content);
    });
  }
});

server.listen(3001, () => console.log('Running on http://localhost:3001'));