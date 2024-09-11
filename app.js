const express = require('express');
const fs = require('fs');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');

const path = require('path');
const pdf = require('html-pdf');
const ejs = require('ejs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
// const {router} = require('./routes/allApis');
const {router: botRouter} = require('./routes/botApi');
const { downloadPDF } = require('./controllers/ticket');

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




app.get('/ticket', (req, res) => {
  // Retrieve the query parameters (data sent from POST request)
  const data = req.query;

  // Render an HTML template with the data
  res.render("ticket", { data }, (err, html) => {
    if (err) {
      console.error(err);
      return res.status(500).send("An error occurred while rendering the ticket.");
    }
    res.send(html);
  });
});

app.get('/generatepdf',downloadPDF)


app.use("/api", botRouter);



server.listen(8000, ()=> console.log("Server Stared!"));









 



// app.post('/ticket', (req, res) => {

//   // const cssContent = fs.readFileSync(path.join(__dirname, 'public', 'styles', 'ticket.css'), 'utf8');
//   console.log(req.body);
//   const data = {
//     name: "Lokmanya Tilak Museum",
//     address: "737/3A, Laxmi Road, Pune, Maharashtra 411002",
//     price: "Adults: INR 10, Children: INR 5",
//     openingTime: "10:00 AM",
//     closingTime: "5:00 PM",
//     description: "The Lokmanya Tilak Museum is a tribute to the renowned Indian nationalist and social reformer Bal Gangadhar Tilak. Established in 1962, the museum houses a vast collection of artifacts and memorabilia related to Tilak's life and work.",
//     city: "Pune",
//     email: "example@example.com",
//     members: ["Member 1: John Doe", "Member 2: Jane Doe"]
//   };
//   const queryParams = new URLSearchParams(data).toString();

//   // Redirect to /ticket with query params
//   res.redirect(`/ticket?${queryParams}`);
// });