const QRCode = require('qrcode');
const Ticket = require('../models/ticket');

async function ticketCreated(req) {
  const data = req.query;
  const members = data.members.split(',').map(member => ({ name: member.trim() }));

  try {
    const storage = await Ticket.create({
      members: members,
      date: data.date,
      openingTime: data.openingTime,
      closingTime: data.closingTime,
      price: data.price,
      museumName: data.museumName,
      city: data.city, 
    });

    const ticket = storage;
    let allTicketQr = [];
    let ticketId = ticket.members.map(member => member._id).join(',');
    data.ids = ticketId;
let i = 0;
    const qrCodes = await Promise.all(ticket.members.map(async member => {
      const queryParams = new URLSearchParams({
        dbId: ticket._id,
        id: member._id,
      }).toString();
      const url = `http://localhost:8000/api/verify?${queryParams}`;

      const qrCode = await QRCode.toDataURL(url);
      allTicketQr.push(qrCode);
      return qrCode;
    }));

    data.Qrs = allTicketQr.join(' | ');
    return data;
  } catch (err) {
    console.error(err);
    throw new Error('Error generating QR code or saving ticket');
  }
}

module.exports = { ticketCreated };