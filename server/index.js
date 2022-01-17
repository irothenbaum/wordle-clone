const express = require('express')
const path = require('path')

const PORT = process.env.PORT || 3001

const app = express()

app.use('/static', express.static(path.join(__dirname, '..', 'public')))

// load our routes
app.use(require('./routes'))

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})
