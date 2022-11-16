const request = require('request');
const axios = require('axios');
const URL = require('../src/index');
exports.retrieveCatalog = (current_page,display_count) => {
    var data = {
        "current_page": current_page,
        "display_count":display_count,
    }
    //get requrest using https with body
    return request.get(URL.API_BASE_URL+"/catalog", {
        json: true,
        body: {
            "current_page": 1,
            "display_count":10,
        }
    }, (err, resp, body) => {
        if (err) {
            return err;
        }
        return body;
    });
}
exports.retrieveProduct = (id) => {
    return axios.get(URL.API_BASE_URL+"/catalog/"+id,{headers:{'Content-Type': 'application/json'}})
}
