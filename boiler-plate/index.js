const express = require('express');
const app = express();
const port = 5000;

const mongoose = require('mongoose');
mongoose
  .connect(
    'mongodb+srv://kang:abc123abc123@boiler.qyaqk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
  )
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listeninig on port ${port}`);
});
