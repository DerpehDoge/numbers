require("dotenv").config();
let express = require("express");
let app = express();
let path = require("path");
let http = require("http").createServer(app);
let io = require("socket.io")(http);
let PORT = process.env.PORT || 3000;
let nSM = require("node-sass-middleware")

app.use(nSM({
  src: __dirname,
  dest: path.join(__dirname, "public")
}))

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/views/index.html")
})

app.get('/test', (req, res) => {
  res.sendFile(__dirname + "/views/test.html")
})


app.use(express.static('public'))

io.on('connection', socket => {
  console.log("connection established.")
})

http.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})