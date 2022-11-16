const axios = require('axios');
const URL = require('../src/index');

exports.addToCart = (productId,quantity,jwt) => {
    const data = {
        product_id: String(productId),
        qty: parseInt(quantity)
    }
    return axios.post(URL.API_BASE_URL+"/cart",data,{headers:{'Content-Type': 'application/json','Authorization': 'Bearer '+jwt}})
}

exports.getCart = (jwt) => {
    return axios.get(URL.API_BASE_URL+"/cart",{headers:{'Content-Type': 'application/json','Authorization': 'Bearer '+jwt}})
}
exports.updateCart = (productId,quantity,jwt) => {
    const data = {
        product_id: String(productId),
        qty: parseInt(quantity)
    }
    return axios.put(URL.API_BASE_URL+"/cart",data,{headers:{'Content-Type': 'application/json','Authorization': 'Bearer '+jwt}})
}

exports.deleteCart = (productId,jwt) => {

    return axios.delete(URL.API_BASE_URL+"/cart",{headers:{'Content-Type': 'application/json','Authorization': 'Bearer '+jwt},data:{product_id:productId}})
}
exports.checkoutCart = (jwt) => {
    return axios.post(URL.API_BASE_URL+"/cart/checkout",{}, {headers:{'Content-Type': 'application/json','Authorization': 'Bearer '+jwt}})
}