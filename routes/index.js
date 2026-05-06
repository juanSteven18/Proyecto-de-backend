const express = require('express');
const router = express.Router();

const productosControl = require('../controladores/product_control');


router.get('/', productosControl.listar);

module.exports = router;