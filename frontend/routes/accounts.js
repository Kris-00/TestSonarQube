const { body, validationResult } = require('express-validator');
const { response } = require('express');
const express = require('express');
require('dotenv').config();
const axios = require('axios');
const router = express.Router();
const account = require('../controllers/accountsController');
const accountRepo = require('../repository/accountRepository');
const moment = require('moment');
const { route } = require('./product');
const auth = require('../utils/auth');

router.get('/', (req, res) => {
    if (req.cookies['jwt']) {
        accountRepo.accountDetails(req.cookies['jwt']).then(response => {
            if (response.status == 200) {
                res.render('accountdetails', {
                    email: response.data.email,
                    firstName: response.data.first_name,
                    lastName: response.data.last_name,
                    dob: moment(response.data.dob).format('YYYY-MM-DD'),
                    login: true
                });
            } else {
                res.send('Error');
            }

        }).catch(error => {
            res.send(error);
        })
    } else {
        res.redirect('/accounts/login');
    }
});

router.get('/login', (req, res) => {
    if (req.cookies['jwt']) {
        res.redirect('/');
    } else {
        res.render('login', { errors: false });
    }
});
router.post('/login', account.validateLoginInput(), (req, res) => {
    const secret = process.env.V2SECRETKEY;
    const errors = validationResult(req);
    console.log(req.body.data);
    // console.log(errors);
    if (!errors.isEmpty()) {
        res.render('login', { errors: "true", message: errors.array() });
        console.log(errors.array());
    } else {

        data = 'secret=' + secret + '&response=' + req.body['g-recaptcha-response'];
        url = "https://www.google.com/recaptcha/api/siteverify"
        axios.post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(response => {
            // console.log(response.data);

            if (response.data.success == true) {
                accountRepo.login(req.body.email, req.body.password).then(response => {
                    // Authroised User
                    const jwt = response.headers['set-cookie'][0].split(';')[0].split('=')[1];
                    res.cookie('jwt', jwt, { httpOnly: true });
                    accountRepo.accountDetails(jwt).then(response => {
                        if (response.status == 200) {
                            const userInfo = {
                                email: response.data.email,
                                firstName: response.data.first_name,
                                lastName: response.data.last_name,
                                dob: moment(response.data.dob).format('YYYY-MM-DD'),
                            }
                            res.cookie('email', userInfo.email, { httpOnly: true });
                            res.cookie('firstName', userInfo.firstName, { httpOnly: true });
                            res.cookie('lastName', userInfo.lastName, { httpOnly: true });
                            res.cookie('dob', userInfo.dob, { httpOnly: true });
                            res.redirect('/');
                        } else {
                            res.send('Error');
                        }
                    }).catch(error => {
                        console.log("error");
                    })



                }).catch(error => {
                    console.log(error);
                    res.render('login', { errors: "true", message: "Incorrect email or password" });
                });
            } else if (response.data.success == false) {
                res.render('login', { errors: "true", message: "Captcha failed" });
            }
        });

    }
});

router.get('/register', (req, res) => {

    res.render('register', { errors: false });
});
router.post('/register', account.validateRegisterInput(), (req, res) => {

    console.log(req.body)
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        var errorString = ""
        for (i = 0; i < errors.array().length; i++) {
            errorString += errors.array()[i].msg + ", ";
        }
        res.render('register', { errors: "true", message: errorString });
    } else {
        const dob = moment.utc(req.body.dob).format('YYYY-MM-DD');
        accountRepo.register(req.body.firstName, req.body.lastName, req.body.email, req.body.password, dob).then(response => {
            console.log(response.data);
            if (response.data == "Successfully created the account.") {
                res.redirect('/accounts/login');
            } else {
                res.render('register', { errors: true, message: "Failed to register the account" });
            }
        }).catch(error => {
            res.render('register', { errors: true, message: "Failed to register the account" });
        });
    }
});

router.get('/reset', (req, res) => {
    res.render('resetPassword', { errors: false });
});
router.post('/reset', (req, res) => {
    const errors = validationResult(req);
    console.log(req.body.email)
    if (!errors.isEmpty()) {
        res.render('resetPassword', { errors: "false", message: errors.array() });
    } else {
        accountRepo.resetAccount(req.body.email).then(response => {
            res.redirect('/accounts/changepassword');
        }).catch(error => {
            res.render('resetPassword', { errors: "true", message: "Failed to reset the password" });
        });
    }
})
router.get('/changepassword', (req, res) => {
    res.render('resetPasswordSuccess', { success: true, message: "Verification code has been sent to your email account to reset password." });
});
router.post('/changepassword', account.ValidateEmailPassworrdCode(), (req, res) => {
    const email = req.body.email;
    const code = req.body.verification;
    const password = req.body.password;
    const errors = validationResult(req);
    console.log(req.body.email)
    console.log(req.body.verification)
    console.log(password)
    console.log(errors)
    if (!errors.isEmpty()) {
        res.render('resetPasswordSuccess', { success: "false", message: errors.array() });
    } else {
        console.log(code)
        console.log(password)
        accountRepo.changePassword(email, code, password).then(response => {
            console.log(response.data)
            res.redirect('/accounts/login');

        }).catch(error => {
            res.render('resetPasswordSuccess', { success: "false", message: "Failed to change the password" });
        });
    }
});
module.exports = router;