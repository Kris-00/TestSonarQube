const express = require('express');
const request = require('request');
const productRepo = require('../repository/productRepository');
const router = express.Router();
const morgan = require('morgan');
const URL = require('../src/index');
const auth = require('../utils/auth');

//Product page route
router.get('/', morgan(':remote-addr'), (req, res) => {

    const catalog = request.get(URL.API_BASE_URL + "/catalog", {
        json: true,
        body: {
            "current_page": 1,
            "display_count": 12,
        }
    }, (err, resp, body) => {

        if (err) {
            res.send("error")
        }
        if (req.cookies['jwt']) {
            res.render('product', { login: true, email: req.cookies['email'], products: body.result, page: 1 });
        } else {
            res.render('product', { login: false, products: body.result, page: 1 });
        }

    });

    // res.render('product',{login:false});

});

//Product details page
router.get('/pages/:id', (req, res) => {

    const id = req.params.id;
    const search = req.query.search;
    var reqURL = ""
    if (!search) {
        reqURL = URL.API_BASE_URL + "/catalog"
    } else {
        reqURL = URL.API_BASE_URL + "/catalog?keyword=" + search;
    }

    console.log("search params=" + search);

    const catalog = request.get(reqURL, {
        json: true,
        body: {
            "current_page": id,
            "display_count": 12,
        }
    }, (err, resp, body) => {

        if (err) {
            res.send("error")
        }
        console.log(body.result);
        if (req.cookies['jwt']) {
            res.render('product', { login: true, email: req.cookies['email'], products: body.result, page: id });
        } else {
            res.render('product', { login: false, products: body.result, page: id });
        }

    });

});

//Get product details
router.get('/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    productRepo.retrieveProduct(id).then((response) => {
        const data = response.data;
        if (response.status == 200) {
            console.log(response.data);
            if (req.cookies['jwt']) {
                console.log(response.data);
                res.render('productdetails', { login: true, email: req.cookies['email'], productDetails: response.data, product_id: id ,error:false,message:""});
            } else {
                res.render('productdetails', { login: false, productDetails: data, productDetails: response.data, product_id: id,error:false,message:""});
            }
        } else {
            res.send("error")
        }
    }).catch((err) => {
        res.send(err);
    });

});




module.exports = router;