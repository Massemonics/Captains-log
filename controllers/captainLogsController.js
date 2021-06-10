const express = require('express')
const logs = express.Router()
const captainLogs = require('../models/log.js')

logs.get('/', (req, res) => {
  const query = req.query

  if (req.url === '/') {
    res.json(captainLogs)
  } else {
    if (query.order === 'asc') {
      let sorted = captainLogs.sort((a, b) =>
        a.title > b.title ? 1 : b.title > a.title ? -1 : 0
      )
      res.status(200).json(sorted)
    } else if (query.order === 'desc') {
      let sorted = captainLogs.sort((a, b) =>
        b.title > a.title ? 1 : a.title > b.title ? -1 : 0
      )
      res.status(200).json(sorted)
    }

    if (query.mistakes === 'true') {
      let filtered = captainLogs.filter(
        log => log.mistakesWereMadeToday === true
      )
      res.status(200).json(filtered)
    } else if (query.mistakes === 'false') {
      let filtered = captainLogs.filter(
        log => log.mistakesWereMadeToday === false
      )
      res.status(200).json(filtered)
    }
    let crisis = 0
    switch (query.lastCrisis) {
      case 'gt10':
        crisis = captainLogs.filter(log => log.daysSinceLastCrisis > 10)
        res.status(200).json(crisis)
        break
      case 'gte20':
        crisis = captainLogs.filter(log => log.daysSinceLastCrisis >= 20)
        res.status(200).json(crisis)
        break
      case 'gte5':
        crisis = captainLogs.filter(log => log.daysSinceLastCrisis <= 5)
        res.status(200).json(crisis)
        break
      default:
        res.status(404).send('Not Fund.!')
        break
    }
  }
})

logs.get('/:index', (req, res) => {
  const { index } = req.params
  if (captainLogs[index]) {
    res.status(200).json(captainLogs[index])
  } else {
    res.redirect('/9001')
  }
})

logs.post('/', (req, res) => {
  captainLogs.push(req.body)
  res.status(200).json(captainLogs[captainLogs.length - 1])
})

logs.delete('/:index', (req, res) => {
  const { index } = req.params
  if (index > captainLogs.length-1){ 
    res.send(400).send("Bad Request.!!")
   }
   let logsCopy = [...captainLogs]
  let delElem = []
  logsCopy.forEach((log, idx) => {
    if (idx === parseInt(index)) {
      console.log('yes')
      captainLogs.splice(idx,1)
      delElem.push(log)
      return 
    }
  })
  
  res.status(303).json(captainLogs)
})

module.exports = logs
