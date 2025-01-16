const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.use(express.static('./dist'))
app.get('/api/email', (req, res) => {
  console.log(req.query)
  res.send('ok')
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
