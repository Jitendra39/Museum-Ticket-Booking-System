const express = require('express');
const fs = require('fs');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
require('dotenv').config();
const path = require('path');
 
const { generateTicketId } = require("./utils");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
 
const {router: botRouter} = require('./routes/botApi');
const { downloadPDF } = require('./controllers/ticket');
const { default: mongoose } = require('mongoose');
const { ticketCreated } = require('./controllers/ticketIdAdder');

// mongoose.set('debug', true);

mongoose.connect(process.env.MONGO_URL, {
  connectTimeoutMS: 60000,
  socketTimeoutMS: 45000
}).then(() => {
  console.log("MongoDB is connected");
}).catch(err => {
  console.error("Error connecting to MongoDB:", err);
});

app.set("view engine", "ejs")
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

 

app.get('/', (req,res) => {
    res.render('home')
})
app.get('/register', (req,res) => {
    res.render('register');
  })
  
app.get('/bot', (req,res) => {
    res.render("bot")
})

app.get('/about', (req,res) => {
  res.render('about')
})


app.get('/ticket', async(req, res) => {
  try {
    const data = await ticketCreated(req);
    console.log(data);

    // Render an HTML template with the data
    res.render("ticket", { data }, (err, html) => {
      if (err) {
        console.error(err);
        return res.status(500).send("An error occurred while rendering the ticket.");
      }
      res.send(html);
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while processing the ticket.");
  }
});

app.get('/generatepdf',downloadPDF)


app.use("/api", botRouter);



server.listen(8000, ()=> console.log("Server Stared!"));
 