require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

if (process.env.NODE_ENV !== 'test') app.use(morgan('combined'));
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api', require('./controllers'));

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}.`);
});

module.exports = app;
