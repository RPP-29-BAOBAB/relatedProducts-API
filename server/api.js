const axios = require('axios');
const config = require('../config.js');
const generateURL = require('./utils.js')
const mongo = require('../mongoDB-relatedProducts.js');

axios.defaults.baseURL = config.API;
axios.defaults.headers.common['Authorization'] = config.GITHUB_TOKEN;

module.exports = {
  fetchMultiple: (endpoint, ids) => {
    console.log(ids);
    return Promise.all(ids.map(id => (
      axios.get(`/products?product_id=${id}`)
        .then(res => {
          // console.log(res.data);
          return res.data;
        })
    )));
  },

  fwd: async (req, callback) => {
    const url = generateURL(req.url)
    console.log('url:', url)

    if (req.method === 'GET') {
      console.log('API query:\n', req.url, req.query);
      if(url.includes('related')) {
        let id = req.url.split('/')[2];
        console.log('id', id);
        let findRelated =  await mongo.mongo('findRelated', id);
        //now grab only the product ID
        let arrayOfRelatedID =[]
        for (let elem in findRelated) {
          arrayOfRelatedID.push(findRelated[elem].related_product_id);
        }
          
        console.log('array', arrayOfRelatedID)

        return callback(null,  arrayOfRelatedID);
        
      } else {
      return axios.get(req.url)
        .then(response => {
          // console.log('response!', response)
          callback(null, response.data);
        })
        .catch(err => {
          callback(err, null);
        });
      }
    }

    // More varied data attached to POST/PUT requests:
    console.log('API query:\n', req.url, req.params[0], req.query, req.body);
    
    if (req.method === 'POST') {
      return axios.post(req.url, req.body)
        .then(response => {
          callback(null, response.data);
        })
        .catch(err => {
          callback(err, null);
        });
    }

    return axios.put(req.url, req.body)
      .then(response => {
        callback(null, response.data);
      })
      .catch(err => {
        callback(err, null);
      });
  }
};
