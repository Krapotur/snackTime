const express = require('express');
const passport = require('passport');

const controller = require('../controllers/user')
const upload = require("../middleware/upload");

const router = express.Router();

router.get('/', passport.authenticate('jwt', {session: false}), controller.getAll);
router.get('/:id', passport.authenticate('jwt', {session: false}), controller.getById);
router.post('/', passport.authenticate('jwt', {session: false}),upload.single('image'), controller.create);
router.patch('/:id', passport.authenticate('jwt', {session: false}),upload.single('image'), controller.update);
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.delete);

module.exports = router;