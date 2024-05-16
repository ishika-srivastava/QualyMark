const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const { createProduct, verifyProduct } = require('../controller/product.controller');

router.use(requireAuth);
router.post('/create', createProduct);
router.post('/verify', verifyProduct);

module.exports = router;