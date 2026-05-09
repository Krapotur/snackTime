const express = require('express');
const controller = require('../controllers/position')
const passport = require("passport");
const upload = require("../middleware/upload");

const router = express.Router();

router.get('/', controller.getAll);
router.get('/category/:id', controller.getPositionsByCategoryId);
router.get('/restaurant/:id', controller.getPositionsByRestaurantId);
router.get('/:id', controller.getById);
router.post('/', passport.authenticate('jwt', {session: false}), upload.single('image'), controller.create);
router.patch('/:id', passport.authenticate('jwt', {session: false}), upload.single('image'), controller.update);
router.patch('/update-status/:id', passport.authenticate('jwt', {session: false}), upload.single('image'), controller.updateStatus);
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.delete);

module.exports = router;