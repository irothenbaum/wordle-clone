const fs = require('fs')
const path = require('path')

const words5 = []
const words6 = []
const words7 = []
const words8 = []

let possibleRaw = fs.readFileSync(path.join(__dirname, 'possibleWords.txt'), 'utf-8')
let allRaw = fs.readFileSync(path.join(__dirname, 'allWords.txt'), 'utf-8')
const lettersReg = /^[a-z]+$/i

const allWords = allRaw
  .split(/\r?\n/)
  .filter(w => !!lettersReg.test(w))
  .map(w => w.toLowerCase())

possibleRaw.split(/\r?\n/).forEach(w => {
  const test = lettersReg.test(w)
  if (!test) {
    return
  }

  const lower = w.toLowerCase()
  if (w.length === 5) {
    words5.push(lower)
  } else if (w.length === 6) {
    words6.push(lower)
  } else if (w.length === 7) {
    words7.push(lower)
  } else if (w.length === 8) {
    words8.push(lower)
  }
})

console.log(`RESULTS:
5 - ${words5.length}
6 - ${words6.length}
7 - ${words7.length}
8 - ${words8.length}
ALL - ${allWords.length}`)

fs.writeFileSync(
  path.join(__dirname, 'src', 'lib', 'dictionaries', 'all-words.json'),
  JSON.stringify(allWords),
  'utf-8',
)
fs.writeFileSync(path.join(__dirname, 'src', 'lib', 'dictionaries', 'words5.json'), JSON.stringify(words5), 'utf-8')
fs.writeFileSync(path.join(__dirname, 'src', 'lib', 'dictionaries', 'words6.json'), JSON.stringify(words6), 'utf-8')
fs.writeFileSync(path.join(__dirname, 'src', 'lib', 'dictionaries', 'words7.json'), JSON.stringify(words7), 'utf-8')
fs.writeFileSync(path.join(__dirname, 'src', 'lib', 'dictionaries', 'words8.json'), JSON.stringify(words8), 'utf-8')
