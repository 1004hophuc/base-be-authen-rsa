const express = require('express');
const accessController = require('../controllers/access.controller');
const router = express.Router();

// router.get('/', (req, res, next) => {
//   return res.status(200).json({
//     message: 'Welcome to Shop Agricultural'
//   })
// });

router.use('/v1/api', accessController.signUp)

module.exports = router;