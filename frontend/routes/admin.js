const { body, validationResult } = require('express-validator');
const { response } = require('express');
const express = require('express');
require('dotenv').config();
const axios = require('axios');
const router = express.Router();
const account = require('../controllers/accountsController');
const adminnRepo = require('../repository/adminRepository');
const moment = require('moment');
const { route } = require('./product');
const auth = require('../utils/auth');

router.get('/', (req, res) => {
    if (req.cookies['jwt']) {
        const isAdmin = auth.verifyAdmin(req.cookies['jwt']);
        if (isAdmin)
            res.render('vendor-register', { errors: false, email: req.cookies['email'] });
        else
            res.redirect('/accounts/login');
    } else {
        res.redirect('accounts/login')
    }
})

router.get('/vendor', (req, res) => {
    if (req.cookies['jwt']) {
        const isAdmin = auth.verifyAdmin(req.cookies['jwt']);

        if (isAdmin)
            res.render('vendor-register', { errors: false, email: req.cookies['email'] });
        else
            res.redirect('/accounts/login');
    } else {
        res.redirect('/accounts/login');
    }
})

router.post('/vendor', (req, res) => {
    if (req.cookies['jwt']) {
        const data = {
            store_name: req.body.storeName,
            email: req.body.email,
            password: req.body.password
        }
        try {
            adminnRepo.createVendor(req.cookies['jwt'], data)
                .then(response => {
                    if (response.status == 201 || response.status == 200) {
                        console.log("success")
                        const message = "Successfully created vendor account!"
                        res.redirect(`/admin/vendor/created?msg=${encodeURI(message)}`);
                    } else {
                        const message = "Failed to create vendor account!"
                        res.redirect(`/admin/vendor/created?msg=${encodeURI(message)}`);
                    }

                }).catch(error => {
                    const message = "Failed to create vendor account!"
                    res.redirect(`/admin/vendor/created?msg=${encodeURI(message)}`);
                    console.log("Some erroer")
                })
        } catch (err) {
            console.log(err)
            const message = "Failed to create vendor account!"
            res.redirect(`admin/vendor/created?msg=${encodeURI(message)}`);
        }
    } else {
        res.redirect('/accounts/login');
    }
})

router.get('/vendor/created', (req, res) => {
    if (req.cookies['jwt']) {
        if (req.query.msg) {
            res.render('vendor-register-success', {
                msg: decodeURI(req.query.msg),
                email: req.cookies['email']
            });
        } else {
            console.log("redirect to error")
            res.send('Error');
        }
    } else {
        res.redirect('/accounts/login');
    }
})
module.exports = router;