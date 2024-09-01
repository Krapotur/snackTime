const express = require('express');
const controller = require('../controllers/position')

const router = express.Router();

// router.get('/:categoryById', controller.getByCategoryId);
router.get('/', controller.getAll);
router.get('/category/:id', controller.getPositionsByCategoryId);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.patch('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;