const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  members:[
    {name:{
      type: String,
      required: true
    }
  }
  ],
  date: {
    type: Date,
    default: Date.now
  },
  openingTime: {
    type: String
  },
  closingTime: {
    type: String
  },
  price: {
    type: String
  },
  museumName:{
    type: String,
    required: true
  },
  city:{
     type: String,
     required: true
  }


})


module.exports = mongoose.model('Ticket', ticketSchema);