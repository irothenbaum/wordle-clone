const fs = require('fs')
const path = require('path')

const words5 = []
const words6 = []
const words7 = []
const words8 = []

let raw = fs.readFileSync(path.join(__dirname, 'allWords.txt'), 'utf-8')
const lettersReg = /^[a-z]+$/i

raw.split(/\r?\n/).forEach(w => {
  const test = lettersReg.test(w)
  if (!test) {
    return
  }

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

console.log(`RESULTS:
5 - ${words5.length}
6 - ${words6.length}
7 - ${words7.length}
8 - ${words8.length}`)

fs.writeFileSync(path.join(__dirname, 'src', 'lib', 'dictionaries', 'words5.json'), JSON.stringify(words5), 'utf-8')
fs.writeFileSync(path.join(__dirname, 'src', 'lib', 'dictionaries', 'words6.json'), JSON.stringify(words6), 'utf-8')
fs.writeFileSync(path.join(__dirname, 'src', 'lib', 'dictionaries', 'words7.json'), JSON.stringify(words7), 'utf-8')
fs.writeFileSync(path.join(__dirname, 'src', 'lib', 'dictionaries', 'words8.json'), JSON.stringify(words8), 'utf-8')
