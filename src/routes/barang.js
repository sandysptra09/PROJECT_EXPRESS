const router = require('express').Router();
const { barang } = require('../controllers');

// GET localhost:8080/barang => Ambil semua data barang
router.get('/', barang.ambilDataBarang);

// POST localhost:8080/barang/add => Menambah data barang ke database
router.post('/add', barang.tambahDataBarang);

// PUT localhost:8080/barang/edit => Mengubah data barang
router.put('/edit/:kode_barang', barang.ubahDataBarang);

// // POST localhost:8080/barang/delete => Menghapus data barang
router.delete('/delete/:kode_barang', barang.hapusDataBarang)

module.exports = router;