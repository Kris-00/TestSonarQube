const axios = require('axios');
const URL = require('../src/index');

exports.createVendor = (jwt, data) => {
    return axios.post(URL.API_BASE_URL + "/admin/vendor", data, { headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + jwt } })
}