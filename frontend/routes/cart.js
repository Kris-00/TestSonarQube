const express = require('express');
const {body,validationResult} = require('express-validator');

const router = express.Router();

const cart = require('../controllers/cartController');
const cartRepo = require('../repository/cartRepository');

//get cart page of the user
router.get('/', (req, res) => {
    if (req.cookies['jwt']) {
        cartRepo.getCart(req.cookies['jwt']).then((response) => {
            if (response.status == 200) {
            const cartItems = response.data.result;
            console.log("cartItems:"+cartItems)
            res.render('cart',{login:true,email:req.cookies['email'],cartItems:cartItems});
            }else{
                res.send("error");
            }
        }).catch((err) => {
            console.log(err);
        });
    }
    else{
        res.redirect('/accounts/login');
    }

});

//create a new cart for the user
router.post('/', cart.validateIdQuantity(),(req, res) => {
    if(req.cookies['jwt']){
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({
                errors: error.array()
            });
        }else{
             cartRepo.addToCart(req.body.product_id,req.body.quantity,req.cookies['jwt']).then((response) => {
                res.redirect('/cart');
            }).catch((err) => {
              
                res.redirect('/');
            }); 
        }
    }else{
        res.redirect('/accounts/login');
    }
});

router.get('/edit', (req, res) => {
    if(req.cookies['jwt']){
        cartRepo.getCart(req.cookies['jwt']).then((response) => {
            if (response.status == 200) {
                const cartItems = response.data.result;
                console.log(cartItems)
                res.render('cartEdit',{login:true,email:req.cookies['email'],cartItems:cartItems});
            }else{
                res.send("error");
            }
    });
    }
    else{
        res.redirect('/accounts/login');
    }
});
router.post('/edit',cart.validateIdQuantity(), (req, res) => {
    if(req.cookies['jwt']){
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({
                errors: error.array()
            });
        }else{
            console.log(req.body);
        cartRepo.updateCart(req.body.product_id,req.body.quantity,req.cookies['jwt']).then((response) => {
            if(response.status == 200){
                res.redirect('/cart');
            }else{
                res.send("failed to update cart");
            }
        }).catch((err) => {
            res.send("error404");
        });
    }
    }
    else{
        res.redirect('/accounts/login');
    }
});
router.post('/delete', cart.validateId() ,(req, res) => {

    if(req.cookies['jwt']){
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({
                errors: error.array()
            });
        }else{
            console.log(req.body.product_id);
            cartRepo.deleteCart(req.body.product_id,req.cookies['jwt']).then((response) => {
                if(response.status == 200){
                    res.redirect('/cart/edit');
                }else{
                    res.send("failed to delete cart");
                }
            }).catch((err) => {
                res.send(err);
            });
        }
    }else{
        res.redirect('/accounts/login');
    }
});

router.post('/checkout', (req, res) => {
    if(req.cookies['jwt']){
        cartRepo.checkoutCart(req.cookies['jwt']).then((response) => {
            if(response.status == 200){
                res.redirect('/order')
            }else{
                res.send("failed to checkout cart");
            }
        }).catch((err) => {
            res.send("error404");
        });
    }else{
        res.redirect('/accounts/login');
    }
});

router.put('/', (req, res) => {
});

module.exports = router;