const path = require('path');
const pdf = require('html-pdf');
const ejs = require('ejs');
const fs = require('fs');

const downloadPDF = async (req, res) => {
  console.log('req.query', req.query);
  const data = {
    name: '',
    address: "737/3A, Laxmi Road, Pune, Maharashtra 411002",
    price: "Adults: INR 10, Children: INR 5",
    id: '',
    openingTime: req.query.openingTime,
    closingTime: req.query.closingTime,
    city: "Pune",
    email: "example@example.com",
    members: req.query.members ? req.query.members.split(',') : ["Member 1: John Doe", "Member 2: Jane Doe"],
    date: req.query.date,
    Qr: '',
    members2: '',
    ids: req.query.ids || '',
    Qrs: req.query.Qrs || ''
  };

  const cssPath = path.join(__dirname, '..', 'public', 'stylesheets', 'ticketToDownload.css');
  let cssContent = '';
  if (fs.existsSync(cssPath)) {
    cssContent = fs.readFileSync(cssPath, 'utf8');
  } else {
    console.warn(`CSS file not found at ${cssPath}`);
  }

  // Generate HTML for each member
  // Generate HTML for each member
// Generate HTML for each member
let combinedHtml = '';
let indexs = 0;
for (let index = 0; index < data.members.length; index++) {
  const member = data.members[index];
  const idsArray = data.ids ? data.ids.split(',') : [];
  const qrsArray = data.Qrs ? data.Qrs.split(' | ') : [];


  const memberData = { 
    ...data, 
    id: (idsArray[index] || '').trim(), 
    name: member.trim(), 
    Qr: qrsArray[indexs]
  };
  indexs++;


  try {
    const html = await ejs.renderFile(path.join(__dirname, '..', 'views', 'ticketToDownload.ejs'), { data: memberData, cssContent }, { async: true });
    combinedHtml += html + '<div style="page-break-after: always;"></div>'; // Add page break after each ticket
  } catch (err) {
    console.error('Error rendering EJS:', err);
    return res.status(500).send('Error generating PDF');
  }
}

  // Generate PDF from combined HTML
  const options = { format: 'A4' };
  pdf.create(combinedHtml, options).toFile('museum_ticket.pdf', (err, result) => {
    if (err) {
      console.error('Error generating PDF:', err);
      return res.status(500).send('Error generating PDF');
    }
    res.sendFile(path.resolve(result.filename));
  });
};

module.exports = {
  downloadPDF
};


// const path = require('path');
// const pdf = require('html-pdf');
// const ejs = require('ejs');
// const fs = require('fs');
// const { console } = require('inspector');

// const downloadPDF = (req, res) => {
//   const data = {
//     name: '',
//     address: "737/3A, Laxmi Road, Pune, Maharashtra 411002",
//     price: "Adults: INR 10, Children: INR 5",
//     id: '',
//     openingTime: req.query.openingTime,
//     closingTime: req.query.closingTime,
//     city: "Pune",
//     email: "example@example.com",
//     members: req.query.members ? req.query.members.split(',') : ["Member 1: John Doe", "Member 2: Jane Doe"],
//     date: req.query.date,
//     Qr: '' ,
//     members2: '' 
//   };

//   const cssPath = path.join(__dirname, '..', 'public', 'stylesheets', 'ticketToDownload.css');
//   let cssContent = '';
//   if (fs.existsSync(cssPath)) {
//     cssContent = fs.readFileSync(cssPath, 'utf8');
//   } else {
//     console.warn(`CSS file not found at ${cssPath}`);
//   }

//   // Generate HTML for each member
//   let combinedHtml = '';
//   data.split(',').forEach((member, index) => {
//     const memberData = { ...data,id: member.ids.trim(), name: member.members.trim(), Qr: member.Qrs.trim() };
//     ejs.renderFile(path.join(__dirname, '..', 'views', 'ticketToDownload.ejs'), { data: memberData, cssContent }, (err, html) => {
//       if (err) {
//         console.error('Error rendering EJS:', err);
//         return res.status(500).send('Error generating PDF');
//       }
//       combinedHtml += html + '<div style="page-break-after: always;"></div>'; // Add page break after each ticket
//       // Check if it's the last member
//       if (index === data.members.length - 1) {
//         // Generate PDF from combined HTML
//         const options = { format: 'A4' };
//         pdf.create(combinedHtml, options).toFile('museum_ticket.pdf', (err, result) => {
//           if (err) {
//             console.error('Error generating PDF:', err);
//             return res.status(500).send('Error generating PDF');
//           }
//           res.sendFile(path.resolve(result.filename));
//         });
//       }
//     });
//   });
// };

// module.exports = {
//   downloadPDF
// };
 