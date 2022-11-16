const express = require('express');
const request = require('request');
const router = express.Router();
const fs = require('fs');
const jwt = require('jsonwebtoken');
const auth = require('../utils/auth');
const vendorProductrepo = require('../repository/vendorProductRepository');
router.get('/', (req, res) => {
    var token = req.cookies['jwt'];
    if (token) {
    const isVendor = auth.verifyVendor(token);
    console.log(token)
    if (isVendor) {
        vendorProductrepo.getProducts(token).then((result) => {
            results = JSON.stringify(result.data.result);
            productList = JSON.parse(results);
            console.log(productList);
            res.render('vendorProducts', { login: true, email: req.cookies['email'], products: productList, page: 1, isVendor });
        }).catch((err) => {
            console.log(err);
        });
    } else {
        res.redirect('/');
        
    }
} else {
    res.redirect('/');
}
});

// vendor page route
router.get('/product/createProduct', (req, res) => {
    if (req.cookies['jwt']) {
        const isVendor = auth.verifyVendor(req.cookies['jwt']);
        if (isVendor) {
            res.render('createProduct',{login:true,email:req.cookies['email']});
        }else {
            res.redirect('/');
        }
    }
    else{
        res.redirect('/');
    }
});

router.post('/product/createProduct', (req, res) => {
    if (req.cookies['jwt']) {
        const isVendor = auth.verifyVendor(req.cookies['jwt']);
        if (isVendor) {
            console.log(req.files);
            console.log(req.body);
            const fileType = req.files.image.mimetype.split('/')[1];
            // check if fileType is an image
            if (fileType == 'jpeg' || fileType == 'png' || fileType == 'jpg') {
                const file = req.files.image;
            
                const price = parseFloat(req.body.product_price);
                const stock = parseInt(req.body.stock);
                // encode file to base 64 from buffer
                const encodedFile = file.data.toString('base64');
                vendorProductrepo.addProducts(req.cookies['jwt'],req.body.productName,req.body.category,price,encodedFile,stock).then(response => {
                    if (response.status == 200) {
                        res.redirect('/');
                    }else{
                        res.send("error");
                    }
                }).catch(error => {
                    // console.log(error);
                })

            }
            else {
                res.send('File type not supported');
            }


        }else{
            res.redirect('/');
        }
    }else{
        res.redirect('/');
    }
});


router.get('/:id', (req, res) => {
        var token = req.cookies['jwt'];
        if (token) {
                const isVendor = auth.verifyVendor(token);
                const id = req.params.id;
                if (isVendor) {
                    vendorProductrepo.getProductId(token, id).then( (result) => {
                        const product = result.data;
                        console.log(product);
                        res.render('vendorProductDetails', { login: true, email: req.cookies['email'], productDetails: product });
                }).catch((err) => {
                    console.log(err);
                });
            } else {    
                res.redirect('/');
                
            }
        } else {
            res.redirect('/');
        }
    
});

router.post('/edit', (req, res) => {
    var token = req.cookies['jwt'];
    if (token){
        const isVendor = auth.verifyVendor(token);
        if (isVendor) {
            const id = req.body.product_id;
            const name = req.body.product_name;
            const price = req.body.product_price;
            const image = req.body.product_image;
            const stock = parseInt(req.body.product_stock);
            const updated = parseInt(req.body.updated_at);
            const category = req.body.category;
            console.log("HITTT")
            vendorProductrepo.updateProduct(token, id, name, category,price, image, stock, updated).then((result) => {
                console.log(result);
                res.redirect('/vendor');
            }).catch((err) => {
                console.log(err);
            });
        } else {
            res.redirect('/');
        }
    }
});



module.exports = router;