const lounge = require('lounge');
const { baseSchema } = require('./base.schema');
const { Profile } = require('./profile.schema');

const ticketSchema = lounge.schema({
  id: {
    type: String,
    generate: false
  },
  confirmationCode: { type: String, index: true },
  profileId: Profile,
  profile: Object
});

ticketSchema.extend(baseSchema);
const Ticket = lounge.model('Ticket', ticketSchema);

Ticket.on('save', function(doc, options) {
  console.log('saved Ticket document: ' + doc.id);
});

Ticket.on('remove', function(doc, options) {
  console.log('removed Ticket document: ' + doc.id);
});

module.exports = {
  Ticket
};
