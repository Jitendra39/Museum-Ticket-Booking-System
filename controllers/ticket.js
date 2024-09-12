const path = require('path');
const pdf = require('html-pdf');
const ejs = require('ejs');
const fs = require('fs');
const { console } = require('inspector');

const downloadPDF = (req, res) => {
  console.log("download", req.query);
  const data = {
    name: req.query.name,
    address: "737/3A, Laxmi Road, Pune, Maharashtra 411002",
    price: "Adults: INR 10, Children: INR 5",
    openingTime: req.query.openingTime,
    closingTime: req.query.closingTime,
    description: "The Lokmanya Tilak Museum is a tribute to the renowned Indian nationalist and social reformer Bal Gangadhar Tilak. Established in 1962, the museum houses a vast collection of artifacts and memorabilia related to Tilak's life and work.",
    city: "Pune",
    email: "example@example.com",
    members: req.query.members ? req.query.members.split(',') : ["Member 1: John Doe", "Member 2: Jane Doe"],
    date: req.query.date // Example date
  };

  const cssPath = path.join(__dirname, '..', 'public', 'stylesheets', 'ticketToDownload.css');
  let cssContent = '';
  if (fs.existsSync(cssPath)) {
    cssContent = fs.readFileSync(cssPath, 'utf8');
  } else {
    console.warn(`CSS file not found at ${cssPath}`);
  }

  // Generate HTML for each member
  let combinedHtml = '';
  data.members.forEach((member, index) => {
    const memberData = { ...data, name: member.trim() };
    ejs.renderFile(path.join(__dirname, '..', 'views', 'ticketToDownload.ejs'), { data: memberData, cssContent }, (err, html) => {
      if (err) {
        console.error('Error rendering EJS:', err);
        return res.status(500).send('Error generating PDF');
      }
      combinedHtml += html + '<div style="page-break-after: always;"></div>'; // Add page break after each ticket
      // Check if it's the last member
      if (index === data.members.length - 1) {
        // Generate PDF from combined HTML
        const options = { format: 'A4' };
        pdf.create(combinedHtml, options).toFile('museum_ticket.pdf', (err, result) => {
          if (err) {
            console.error('Error generating PDF:', err);
            return res.status(500).send('Error generating PDF');
          }
          res.sendFile(path.resolve(result.filename));
        });
      }
    });
  });
};

module.exports = {
  downloadPDF
};
 