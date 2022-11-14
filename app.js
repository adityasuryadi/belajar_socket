var express = require('express');
var path = require('path');
const cors = require('cors')
var dotenv = require('dotenv')
var app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));



var http = require("http");

var server = http.createServer(app);
var port = process.env.PORT ||"3100";
app.set("port", port);
app.use(cors())
server.listen(port, () => console.log(`Server on porst ${port}`));

const io = require("socket.io")(server, {
    cors: {
      origin: "http://papua.merchant.test:8089",
      credentials: true,
      transports: ['websocket', 'polling'],
      methods: ["GET", "POST"]
    },
    allowEIO3: true,
  });
  
//   io.on("connection", (client) => {
//     console.log("user is connected with id: " + client.id);
//     client.on("SEND_MESSAGE", function (data) {
//       io.emit("kirim_data", "Get you right back...");
//       console.log(data);
//     });
//     client.on("event", (data) => {
//       console.log("data masuk", data);
//     });
//     client.on("disconnect", () => {
//       console.log("disconnected");
//     });
//   });
  

app.get('/test',function(req,res,next){
    io.emit(`vote`, {
        queue_no: "A15",
        counter:"3"
      });
      res.send("success").status(200);  
})

app.post('/queue',function(req,res,next){
  console.log(req.body)
  io.emit(`vote`, {
    queue_no: req.body.queue_no,
    counter:req.body.counter,
    sisa:(typeof req.sisa === 'undefined') ? 0 : req.sisa
  });
  res.send(req.body).status(200); 
})

app.post('/queue/sisa',function(req,res,next){
  console.log(req.body)
  io.emit(`sisa`, {
    queue_no: req.body.queue_no,
    counter:req.body.counter,
    sisa:(typeof req.body.sisa === 'undefined') ? 0 : req.body.sisa
  });
  res.send(req.body).status(200); 
})

  module.exports = app;
  