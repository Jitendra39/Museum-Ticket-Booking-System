const path = require('path');
const pdf = require('html-pdf');
const ejs = require('ejs');
const fs = require('fs');
const { console } = require('inspector');

const downloadPDF = (req, res) => {
  console.log(req.query);
  const data = {
    name: "Lokmanya Tilak Museum",
    address: "737/3A, Laxmi Road, Pune, Maharashtra 411002",
    price: "Adults: INR 10, Children: INR 5",
    openingTime: "10:00 AM",
    closingTime: "5:00 PM",
    description: "The Lokmanya Tilak Museum is a tribute to the renowned Indian nationalist and social reformer Bal Gangadhar Tilak. Established in 1962, the museum houses a vast collection of artifacts and memorabilia related to Tilak's life and work.",
    city: "Pune",
    email: "example@example.com",
    members: ["Member 1: John Doe", "Member 2: Jane Doe"],
    date: new Date().toLocaleDateString() // Example date
  };

  const cssPath = path.join(__dirname, '..', 'public', 'stylesheets', 'ticketToDownload.css');
  let cssContent = '';
  if (fs.existsSync(cssPath)) {
    cssContent = fs.readFileSync(cssPath, 'utf8');
  } else {
    console.warn(`CSS file not found at ${cssPath}`);
  }

  ejs.renderFile(path.join(__dirname, '..', 'views', 'ticketToDownload.ejs'), { data, cssContent }, (err, html) => {
    if (err) {
      console.error('Error rendering EJS:', err);
      return res.status(500).send('Error generating PDF');
    }

    const options = { format: 'A4' };
    pdf.create(html, options).toFile('museum_ticket.pdf', (err, result) => {
      if (err) {
        console.error('Error generating PDF:', err);
        return res.status(500).send('Error generating PDF');
      }
      res.sendFile(path.resolve(result.filename));
    });
  });
};

module.exports = {
  downloadPDF
};




// const path = require('path');
// const pdf = require('html-pdf');
// const ejs = require('ejs');
// const fs = require('fs');

// const downloadPDF = (req, res) => {
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

//   // Correct the CSS file path
//   const cssPath = path.join(__dirname, '..', 'public', 'stylesheets', 'style.css');
//   let cssContent = '';
//   if (fs.existsSync(cssPath)) {
//     cssContent = fs.readFileSync(cssPath, 'utf8');
//   } else {
//     console.warn(`CSS file not found at ${cssPath}`);
//   }

//   ejs.renderFile(path.join(__dirname, '..', 'views', 'ticket.ejs'), { ...data, cssContent }, (err, html) => {
//     if (err) {
//       return res.status(500).send('Error generating PDF');
//     }

//     const options = { format: 'A4' };
//     pdf.create(html, options).toFile('museum_ticket.pdf', (err, result) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).send('Error generating PDF');
//       }
//       res.sendFile(result.filename);
//     });
//   });
// };

// module.exports = {
//   downloadPDF
// };
