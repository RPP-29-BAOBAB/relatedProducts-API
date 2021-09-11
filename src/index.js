
const express = require('express')
const app = express()
const port = 3000;
const csvtojson = require('csvtojson');

const shell = require('shelljs');
const axios = require('axios');
const config = require('../config');

axios.defaults.baseURL = config.API;

axios.defaults.headers.common['Authorization'] = config.GITHUB_TOKEN;


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

//seed our database
shell.exec('mongoimport --type csv -d relatedProducts -c products --headerline --drop related.csv')

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

  fwd: (req, callback) => {
    console.log('api fwd')
    if (req.method === 'GET') {
      console.log('API query:\n', req.url, req.query);

      //now go into your mongodb and return the data
      //grab the input before the question mark
      let input = req.url.split('?')[0];
      console.log('input', input)
      //if we are looking for a random current product
      if (input === '/products') {

        let page = req.query.page;
        let count = req.query.count;
           return axios.get(req.url)
        .then(response => {
          callback(null, response.data);
        })
        .catch(err => {
          callback(err, null);
        });
      
      }
      //if we are looking for a product by ID
      input = req.url.split('/')[1];
      if (input === 'products') {
        let id = req.url.split('/')[2];
        console.log('id', id)
      }

      // return axios.get(req.url)
      //   .then(response => {
      //     callback(null, response.data);
      //   })
      //   .catch(err => {
      //     callback(err, null);
      //   });
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


