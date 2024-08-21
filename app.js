const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const clientRoutes = require('./routes/client');
const groupRoutes = require('./routes/group');
const categoryRoutes = require('./routes/category');
const kitchenRoutes = require('./routes/kitchen');
const orderRoutes = require('./routes/order');
const positionRoutes = require('./routes/position');
const restaurantRoutes = require('./routes/restaurant');

const keys = require('./config/keys');

const app = express();

mongoose.connect(keys.mongoURI)
    .then(()=>console.log('MongoDB connected!!!'))
    .catch(error => console.log(error))

app.use(passport.initialize());
require('./middleware/passport')(passport);

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'))

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/kitchens', kitchenRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/position', positionRoutes);
app.use('/api/restaurants', restaurantRoutes);

module.exports = app;
