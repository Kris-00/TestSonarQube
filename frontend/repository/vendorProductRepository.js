const axios = require('axios');
const URL = require('../src/index');
const moment = require('moment');
exports.addProducts = (jwt,product_name,category,product_price,image,stock) => {
    var data = {
        "product_name": product_name,
        "category": category,
        "product_price": product_price,
        "product_image": image,
        "product_stock": stock
        
    }
    return axios.post(URL.API_BASE_URL+"/product",data,{headers:{'Content-Type': 'application/json','Authorization': 'Bearer '+jwt}})
}

exports.getProducts = (jwt) => {
   return axios.get(URL.API_BASE_URL+"/product",{headers:{'Content-Type': 'application/json/json','Authorization': 'Bearer '+jwt}})
}

exports.getProductId = (jwt,id) => {
    return axios.get(URL.API_BASE_URL+"/product/"+id,{headers:{'Content-Type': 'application/json','Authorization': 'Bearer '+jwt}})
}

exports.updateProduct = (jwt,id,product_name,category,product_price,image,stock,updated) => {
    var data = {
        "updated_at": updated,
        "product_name": product_name,
        "category": category,
        "product_price": product_price,
        "product_image": image,
        "product_stock": stock
        
    }
    
    console.log(URL.API_BASE_URL+"/product/"+id)
    console.log(data)
    // put request axios
    return axios.put(URL.API_BASE_URL+"/product/"+id,data,{headers:{'Content-Type': 'application/json','Authorization': 'Bearer '+jwt}});
}
