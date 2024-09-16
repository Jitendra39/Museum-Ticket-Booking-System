// import { v4 as uuidv4 } from "uuid";
const { v4 : uuidv4 } = require("uuid");

 const generateTicketId = () => {
  let ticketId = uuidv4();
  return ticketId;

};

module.exports = { generateTicketId };