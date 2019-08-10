const lounge = require('lounge');
require('dotenv').config({
  silent: true
});

const { Ticket } = require('./lib/ticket.schema');
const { Profile } = require('./lib/profile.schema');
const { getAllModeledDocs } = require('./lib/view.service');
// console.log(process.env);

lounge.connect({
  connectionString: process.env.COUCHBASE_CLUSTER,
  bucket: process.env.COUCHBASE_BUCKET,
  username: process.env.COUCHBASE_USER,
  password: process.env.COUCHBASE_PASSWORD,
  emitErrors: true
});

const main = async () => {
  const email = 'some@email.com';
  const user = new Profile({
    id: `profile:${email}`,
    firstName: 'First',
    lastName: 'Name',
    email
  });
  await user.save();

  '1234567890'.split('').map(i => {
    const ticket = new Ticket({
      id: 'ticket:BR54' + i,
      confirmationCode: 'BR54' + i,
      profileId: user.id
    });
    ticket.save();
  });

  Ticket.findById('ticket:BR549', {
    populate: { path: 'profileId', target: 'profile' }
  }).then(async res => {
    console.log(res.toObject());
    console.log(res.getDocumentKeyValue(true));

    const tickets = await getAllModeledDocs(Ticket, {
      populate: { path: 'profileId', target: 'profile' }
    });

    console.log(tickets.map(t => t.toObject()));

    setTimeout(async () => {
      const items = [user, ...tickets];
      for (const item of items) {
        item.remove();
      }
    }, 5000);
  });
};

setTimeout(main, 1000);
