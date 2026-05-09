const path = require('path');
const fs = require('fs');
const multer = require('multer');


const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();


const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const clientRoutes = require('./routes/client');
const groupRoutes = require('./routes/group');
const categoryRoutes = require('./routes/category');
const kitchenRoutes = require('./routes/kitchen');
const orderRoutes = require('./routes/order');
const positionRoutes = require('./routes/position');
const restaurantRoutes = require('./routes/restaurant');
const promoRoutes = require('./routes/promo');

const keys = require('./config/keys');

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
const uploadAbs = path.join(__dirname, '..', UPLOAD_DIR);
if (!fs.existsSync(uploadAbs)) fs.mkdirSync(uploadAbs, { recursive: true });

const app = express();

app.use(passport.initialize());
require('./middleware/passport')(passport);

app.use(morgan('dev'));
app.use(`/${UPLOAD_DIR}`, express.static(UPLOAD_DIR));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/kitchens', kitchenRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/positions', positionRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/promos', promoRoutes);

app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ message: 'Файл слишком большой (лимит 25MB)' });
    if (err.code === 'LIMIT_FILE_COUNT') return res.status(400).json({ message: 'Слишком много файлов (макс 10)' });
    return res.status(400).json({ message: `Ошибка загрузки: ${err.code}` });
  }

  // Common mongoose errors
  if (err?.name === 'ValidationError') return res.status(400).json({ message: err.message });
  if (err?.name === 'CastError') return res.status(400).json({ message: 'Invalid id' });

  // eslint-disable-next-line no-console
  console.error('Unhandled error', err);
  return res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;
