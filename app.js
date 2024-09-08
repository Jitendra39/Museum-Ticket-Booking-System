const express = require('express');
const fs = require('fs');
const http = require('http');
const socketIo = require('socket.io');

const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
// const {router} = require('./routes/allApis');
const {router: botRouter} = require('./routes/botApi');

app.set("view engine", "ejs")
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

app.get('/', (req,res) => {
    res.render("index")
})

app.get('/bot', (req,res) => {
    res.render("bot")
})
app.get('/test', (req,res) => {
    res.render("test")
})

app.use("/api", botRouter);
 
server.listen(8000, ()=> console.log("Server Stared!"));