var express = require('express');
var router = express.Router();

var axios = require('axios');

var axiosInstance = axios.create({
  baseURL: 'https://zccufl6640.zendesk.com/api/v2',
  headers: { Authorization: 'Bearer 9e28527ec963cad8582f7adabe4a09fb338af9f5ec6c6aa5e8b128b15d0ddfc4' },
  responseType: 'json',
  responseEncoding: 'utf8'
})

router.get('/', (req, res) => {
  var page = req.query.page
  axiosInstance.get(`/tickets.json?per_page=25&page=${page}`)
    .then(response => {
      res.send(response.data.tickets)
    })
    .catch(error => {
      res.send(JSON.stringify(error))
    })
})

router.get('/count', (req, res) => {
  axiosInstance.get(`/tickets/count`)
    .then(response => {
      res.send(response.data.count)
    })
    .catch(error => {
      res.send(JSON.stringify(error))
    })
})

module.exports = router
