const axios = require('axios');
const URL = require('../src/index');

exports.getOrders = (jwt) => {
    return axios.get(URL.API_BASE_URL+"/order",{headers:{'Content-Type': 'application/json','Authorization': 'Bearer '+jwt}})
}
exports.getSingleOrder = (id,jwt) => {
    id = parseInt(id);
    return axios.get(URL.API_BASE_URL+"/order/"+id,{headers:{'Content-Type': 'application/json','Authorization': 'Bearer '+jwt}})
}