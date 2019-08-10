const lounge = require('lounge');
const { baseSchema } = require('./base.schema');

const profileSchema = lounge.schema({
  id: {
    type: String,
    generate: false
  },
  firstName: String,
  lastName: String
});

// make user schema extend the base schema
profileSchema.extend(baseSchema);
const Profile = lounge.model('Profile', profileSchema);

Profile.on('save', function(doc, options) {
  console.log('saved Profile document: ' + doc.id);
});

Profile.on('remove', function(doc, options) {
  console.log('removed Profile document: ' + doc.id);
});

module.exports = {
  Profile
};
