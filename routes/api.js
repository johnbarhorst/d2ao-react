const router = require('express').Router();
let ROOT_PATH;
process.env.DEV_MODE ? ROOT_PATH = 'https://localhost:3000/' : ROOT_PATH = '/';

const keys = (object) => console.log(Array.from(Object.keys(object)));

// Get Current User Data
router.get('/Profile/getCurrentUser', async (req, res, next) => {
  console.log('Getting Current User Data');
  const { loggedIn, userId, userProfile } = req.session;
  keys(req.session);
  console.log('Session');
  res.send({
    loggedIn,
    userId,
    userProfile
  });
});

// Handle Item Instance Requests 
router.get('/Item/:membershipType/:destinyMembershipId/:itemInstanceId', async (req, res, next) => {
  console.log('Item Request');
  const data = await rp({
    url: `https://www.bungie.net/Platform/Destiny2/${req.params.membershipType}/Profile/${req.params.destinyMembershipId}/Item/${req.params.itemInstanceId}/?components=300`,
    headers: {
      "X-API-KEY": API_KEY
    }
  }, (err, res, body) => {
    if (err) { return console.log(err); }
  });
  console.log(JSON.parse(data).Response);
  res.send(data);
});

// Handle Character List Request
router.get('/Profile/:membershipType/:destinyMembershipId', async (req, res, next) => {
  console.log('Character List Request');
  console.log(req.params);
  const data = await rp({
    url: `https://www.bungie.net/Platform/Destiny2/${req.params.membershipType}/Profile/${req.params.destinyMembershipId}/?components=200,100`,
    headers: {
      "X-API-KEY": API_KEY
    }
  }, (err, res, body) => {
    if (err) { return console.log(err); }
  });
  console.log(JSON.parse(data).Response);
  res.send(data);
});

// Handle Individual Character Request
router.get('/Profile/:membershipType/:destinyMembershipId/:characterId', async (req, res, next) => {
  console.log('Character Request');
  const data = await rp({
    url: `https://www.bungie.net/Platform/Destiny2/${req.params.membershipType}/Profile/${req.params.destinyMembershipId}/Character/${req.params.characterId}/?components=201`,
    headers: {
      "X-API-KEY": API_KEY
    }
  }, (err, res, body) => {
    if (err) { return console.log(err); }
  });
  console.log(JSON.parse(data).Response);
  res.send(data);
});

//Handle Character Search Request
router.get('/search/:search', async (req, res, next) => {
  console.log('Search Character');
  const data = await rp({
    url: `https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/All/${req.params.search}/`,
    headers: {
      "X-API-KEY": API_KEY
    }
  }, (err, res, body) => {
    if (err) { return console.log(err); }
  });
  res.send(data);
});

module.exports = router;