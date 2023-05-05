const router = require('express').Router();
const routeBarang = require('./barang');

// GET localhost:8080/barang => Ambil semua data barang
router.use('/barang', routeBarang);

module.exports = router;