const express = require('express');
const controller = require('../controllers/position')
const passport = require("passport");
const upload = require("../middleware/upload");

const router = express.Router();

// router.get('/:categoryById', controller.getByCategoryId);
router.get('/', passport.authenticate('jwt', {session: false}), upload.single('image'), controller.getAll);
router.get('/category/:id', passport.authenticate('jwt', {session: false}), controller.getPositionsByCategoryId);
router.get('/:id', passport.authenticate('jwt', {session: false}), controller.getById);
router.post('/', passport.authenticate('jwt', {session: false}), upload.single('image'), controller.create);
router.patch('/:id', passport.authenticate('jwt', {session: false}), upload.single('image'), controller.update);
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.delete);

module.exports = router;