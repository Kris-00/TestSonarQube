const express = require('express')
const path = require('path')
const cors = require('cors')
const ejs = require('ejs');
const helmet = require('helmet')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const request = require('request');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const expresfileupload = require('express-fileupload');
const axios = require('axios');
const API_BASE_URL = `${process.env.API_BASE_URL}`;
exports.API_BASE_URL = API_BASE_URL;
const auth = require("../utils/auth");
const app = express()
const port = 4000
    //app.use(helmet())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(expresfileupload());

app.set('view engine', 'ejs');
app.use(cors());
app.use(express.static(path.join(__dirname, '..', '/assets/css')));
console.log(path.join(__dirname, '..', '/assets/images'));
app.use(express.static(path.join(__dirname, '..', '/assets/images')));
app.use(express.static(path.join(__dirname, '..', '/assets/js')));
app.use(express.static(path.join(__dirname, '..', '/assets/fonts')));
app.use(cookieParser());




// set the view engine to ejs
// Add routes here
app.get('/', (req, res) => {
    try {
        const result = axios.get(`${API_BASE_URL}/catalog`, { current_page: 1, display_count: 12 })
            .then((response) => {
                if (req.cookies['jwt']) {
                    if (auth.verifyVendor(req.cookies['jwt'])) {
                        res.redirect('/vendor');
                    } else if (auth.verifyAdmin(req.cookies['jwt'])) {
                        res.redirect('/admin/vendor')
                    } else {
                        res.render('landingpage', { login: true, email: req.cookies['email'], products: response.data.result, page: 1 });
                    }
                } else {
                    res.render('landingpage', { login: false, products: response.data.result, page: 1 });
                }
            })
            .catch((err) => {
                console.log(err)
            })
    } catch (err) {
        console.log("Something went wrong when loading the landing page", err)
    }
});



app.get('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.clearCookie('email');
    res.clearCookie('firstName');
    res.clearCookie('lastName');
    res.clearCookie('dob');
    res.redirect('/');
});
//adding in account route
var loginRoute = require('../routes/accounts');
const { config } = require('dotenv');
app.use('/accounts', loginRoute);
app.use('/cart', require('../routes/cart'));
app.use('/product', require('../routes/product'));
app.use('/order', require('../routes/order'));
app.use('/vendor', require('../routes/vendor'));
app.use('/admin', require('../routes/admin'));

// app.get('*', function(req, res) {
//     res.redirect("ERROR404");
// });

app.listen(port, "0.0.0.0", () => console.log(`Running on http://localhost:${port}`))