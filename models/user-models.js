const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const platformSchema = new Schema({
  displayName: String,
  membershipType: Number,
  membershipId: String,
  crossSaveOverride: Number,
  iconPath: String
})

const userSchema = new Schema({
  username: String,
  bungieId: String,
  locale: String,
  platforms: [platformSchema]
});



const User = mongoose.model('user', userSchema);

module.exports = User;