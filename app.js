const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// tahap 1 tambahkan mysql & session
const mysql = require('mysql');
const session = require('express-session');

// tahap 2 tambahkan koneksi ke database
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'project'
});

// tahap 3 session
app.use(session({
    secret : 'mysecret',
    resave : false,
    saveUninitialized : true,
    cookie : { secure : false }
}));

// definisi enviroment secara global (.env)
require('dotenv').config();

// convert data ke json
app.use(bodyParser.urlencoded({ extended : false }))
app.use(bodyParser.json())

// memanggil route barang
const appRoute = require('./src/routes');
app.use('/', appRoute);

// tahap 4 membuat route dan proses login
app.post('/login', function(req, res) {

    let username = req.body.username;
    let password = req.body.password;

    if (username && password ) {

        connection.query('SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password], function(error, result, fields) { 

            if (error) throw error;

            if (result.length > 0 ){

                req.session.loggedin = true;
                req.session.username = username;
                req.session.password = password;

            
                res.send({
                    succes : true,
                    message : 'Login Berhasil !'
                });
            } else {
                res.send({
                    succes : false,
                    message : 'Login Gagal !'
                });
            }
            res.end();
        });

    } else {
        res.send({
            succes : true,
            message : 'Please enter Username and Password !'
        });
        res.end();
    }
});

// menjalankan server sesuai dengan port yang terdaftar di .env (8080)
app.listen(process.env.APP_PORT, () => {
    console.log(`Server Berjalan http://localhost:${process.env.APP_PORT}`);
});
