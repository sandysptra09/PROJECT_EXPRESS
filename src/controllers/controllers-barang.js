const config = require('../configs/database');
const mysql = require('mysql');
const session = require('express-session');
const express = require('express');
const { application } = require('express');
const connection = mysql.createConnection(config);
connection.connect();

const app = express();

// tahap 1 middleware
app.use(session({
    secret : 'mysecret',
    resave : true,
    saveUninitialized : true,
}));

// menampilkan semua data Barang
const ambilDataBarang = async (req, res) => {
    try{
        const data = await new Promise((resolve, reject) => {
            connection.query('SELECT * FROM barang', function (error, rows ) {
                    if (rows) {
                        resolve(rows);
                    } else {
                        reject([]);
                    }
            });
        });
        if (req.session.loggedin) {
            res.send({
                    success : true,
                    message : 'Berhasil ambil data',
                    data : data
            });
        } else {
            res.send({
                success : true,
                message : 'Silahkan Login Terlebih Dahulu'
            });
        }
    }
        catch (error) {
            console.log(error);
            res.send({
                    success : false,
                    message2: 'gagal',
                    
            });
        }
}

// menambah data Barang
const tambahDataBarang = async(req, res) => {
    try{
        let total = req.body.harga * req.body.jumlah

    // jika user membeli dengan harga ...
    if (total > 500000 ) {
         potongan = 100000;
    } else {
         potongan = 0;
    }

    // total harga
    let total_harga = total - potongan;

    let data = {
        nama_barang: req.body.nama_barang,
        harga: req.body.harga,
        jumlah: req.body.jumlah,
        potongan :  potongan,
        total_harga: total_harga
    }
    const result = await new Promise((resolve, reject) => {
        connection.query('INSERT INTO barang SET ?;', [data], function(error, rows) {
            if (rows) {
                resolve(true);
            } else {
                reject(false);
            }
        });

    });

        res.send({
            success:true,
            message: 'Berhasil menambahkan data!'
        });
    
    } catch (error) {
        res.send({
            success: false,
            message: 'gagal',
        });
    }
}

// mengubah data Barang
const ubahDataBarang = async(req, res) => {
    let kode_barang = req.params.kode_barang;

    let total = req.body.harga * req.body.jumlah

    // jika user membeli dengan harga ...
    if (total > 500000 ) {
         potongan = 100000;
    } else {
         potongan = 0;
    }

    // total harga
    let total_harga = total - potongan;

    let dataEdit = {
        nama_barang: req.body.nama_barang,
        harga: req.body.harga,
        jumlah: req.body.jumlah,
        potongan :  potongan,
        total_harga: total_harga
    }

    const result = await new Promise((resolve, reject) => {
        connection.query('UPDATE barang SET ? WHERE kode_barang = ?;', [dataEdit, kode_barang], function(error, rows) {
            if (rows) {
                resolve(true);
            } else {
                reject(false);
            }
        });
    });

    if (result) {
        res.send({
            success : true,
            message : 'Berhasil edit data!'
        });
    } else {
        res.send({
            success : false,
            message : "Gagal edit data!"
        });
    }

}

// // menghapus data Barang
const hapusDataBarang = async(req, res) => {
    let kode_barang = req.params.kode_barang;

    const result = await new Promise((resolve, reject) => {
        connection.query('DELETE FROM barang WHERE kode_barang = ?;', [kode_barang], function(error, rows) {
            if (rows) {
                resolve(true);
            } else {
                reject(false);
            }
        });
    });

    if (result) {
        res.send({
            success : true,
            message : 'Berhasil hapus data!'
        });
    } else {
        res.send({
            success : false,
            message : 'Gagal hapus data!'
        });
    }

}

module.exports = {
   ambilDataBarang,
   tambahDataBarang,
   ubahDataBarang,
   hapusDataBarang
    
    
}