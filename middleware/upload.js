const path = require('path');
const multer = require('multer');
const moment = require('moment');

const MIME_EXT = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

function normalizeBaseName(fileName = '') {
  const parsedName = path.parse(fileName).name || 'image';
  const safeName = parsedName
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .toLowerCase();

  if (!safeName) return 'image';
  if (['getter', 'undefined', 'null', 'blob'].includes(safeName)) return 'image';

  return safeName;
}

const storage = multer.diskStorage({
  destination(req, _file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    const date = moment().format('DDMMYYYY-HHmmss_SSS');
    const ext =
      MIME_EXT[file.mimetype] || path.extname(file.originalname || '').toLowerCase() || '.jpg';
    const baseName = normalizeBaseName(file.originalname);

    cb(null, `${date}-${baseName}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/webp'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const limits = {
  fileSize: 1024 * 1024 * 5,
};

module.exports = multer({
  storage,
  fileFilter,
  limits,
});