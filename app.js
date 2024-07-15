const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const groupRoutes = require('./routes/group');
const categoryRoutes = require('./routes/category');
const kitchenRoutes = require('./routes/kitchen');
const orderRoutes = require('./routes/order');
const positionRoutes = require('./routes/position');
const restaurantRoutes = require('./routes/restaurant');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/kitchen', kitchenRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/position', positionRoutes);
app.use('/api/restaurant', restaurantRoutes);

module.exports = app;
