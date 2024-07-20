const express = require('express');
const controller = require('../controllers/client')
const passport = require("passport");

const router = express.Router();

router.get('/', passport.authenticate('jwt', {session: false}), controller.getAll);
router.get('/:id', passport.authenticate('jwt', {session: false}), controller.getById);
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.delete);
router.post('/', controller.create);
router.patch('/:id', controller.update);

module.exports = router;