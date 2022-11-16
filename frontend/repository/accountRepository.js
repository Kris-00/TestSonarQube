const axios = require('axios');
const URL = require('../src/index');


// Post request to API end point of backend /account/login
exports.login = (email,password) => {
    var data = {
        email: email,
        password: password
    }
    return axios.post(URL.API_BASE_URL+"/account/login",data,{headers:{'Content-Type': 'application/json'}})

}

// Post request to API end point of backend /account/register
exports.register = (firstName,lastName,email,password,dob) => {
    var data = {
        first_name: firstName,
        last_name: lastName,
        dob: dob,
        email: email,
        password: password
       
    }
    return axios.post(URL.API_BASE_URL+"/account/register",data,{headers:{'Content-Type': 'application/json'}})
}

exports.accountDetails = (jwt) => {
    return axios.get(URL.API_BASE_URL+"/account",{headers:{'Content-Type': 'application/json','Authorization': 'Bearer '+jwt}})
}

exports.resetAccount = (email) => {
    return axios.post(URL.API_BASE_URL+"/account/reset",{email: email},{headers:{'Content-Type': 'application/json'}})
}
exports.changePassword = (email,code,password) => {
    var data = {
        "email": email,
        "token": code,
        "password": password,
    }
    console.log(data)
    return axios.put(URL.API_BASE_URL+"/account/reset",data,{headers:{'Content-Type': 'application/json'}});
}