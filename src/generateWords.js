const words = require('./allwords.json')
const fs = require('fs')

const words5 = []
const words6 = []
const words7 = []
const words8 = []
words.forEach(w => {
  if (w.length === 5) {
    words5.push(w.toLowerCase())
  } else if (w.length === 6) {
    words6.push(w.toLowerCase())
  } else if (w.length === 7) {
    words7.push(w.toLowerCase())
  } else if (w.length === 8) {
    words8.push(w.toLowerCase())
  }
})

fs.writeFileSync('./words5.json', JSON.stringify(words5), 'utf-8')
fs.writeFileSync('./words6.json', JSON.stringify(words6), 'utf-8')
fs.writeFileSync('./words7.json', JSON.stringify(words7), 'utf-8')
fs.writeFileSync('./words8.json', JSON.stringify(words8), 'utf-8')
