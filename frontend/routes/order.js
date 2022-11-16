const express = require('express');
const orderRepository = require('../repository/orderRepository');
const moment = require('moment');
const router = express.Router();
const order = require('../controllers/orderController');
//get order of vendor/current user depending on the role
router.get('/', (req, res) => {
    if (req.cookies['jwt']) {
        orderRepository.getOrders(req.cookies['jwt']).then((response) => {
            if (response.status == 200) {
                var orders = response.data.result;
                orders.forEach(order => {
                    order.payment_date = moment(order.payment_date).format('YYYY-MM-DD-HH:mm:ss');
                });

                res.render('order', { login: true, email: req.cookies['email'], orders: orders });

            } else {
                res.send(err);
            }
        }).catch((err) => {
            res.send(err)
        });
    } else {
        res.redirect('/accounts/login');
    }
});

//get specific order id 
router.get("/:id", (req, res) => {
    id = parseInt(req.params.id);

    if (req.cookies['jwt']) {
        orderRepository.getSingleOrder(req.params.id, req.cookies['jwt']).then((response) => {
            if (response.status == 200) {
                var orderItems = response.data.order_items;
                console.log(orderItems);
                res.render('orderdetails', { login: true, email: req.cookies['email'], orderItems: orderItems, orderId: id });
                // res.render('orderDetail',{login:true,email:req.cookies['email'],order:order});
            } else {
                res.send(err);
            }
        }).catch((err) => {
            res.send(err)
        });
    } else {
        res.redirect('/accounts/login');
    }

});


//create order
router.post("/", (req, res) => {});
//update order details
router.put("/", (req, res) => {});

//delete order
router.delete("/", (req, res) => {});
module.exports = router;