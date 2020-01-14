const router = require('express').Router();
const rp = require('request-promise-native');
require('dotenv').config();
const API_KEY = process.env.API_KEY;
let ROOT_PATH;
process.env.DEV_MODE ? ROOT_PATH = 'https://localhost:3000/' : ROOT_PATH = '/';

//Helpful little debugging function
const keys = (object) => console.log(Array.from(Object.keys(object)));


// Trim Response off the response from Bungie, then convert back to string to send.
const trimResponse = (data) => {
  return JSON.stringify(JSON.parse(data).Response);
}

//Middleware
const authCheck = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({
      isLoggedIn: false,
      message: "user has not been authenticated"
    });
  } else {
    next();
  }
};


// Get Current User Data
router.get('/Profile/getCurrentUser', authCheck, async (req, res, next) => {
  console.log('Getting Current User Data');
  const { isLoggedIn, userId, userProfile } = req.session;
  keys(req.session);
  console.log('Session');
  res.send({
    isLoggedIn,
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
  }).catch((err, res, body) => {
    if (err) {
      console.log(body);
      console.log(keys(err));
      console.log(err.options);
      err.send(err.response.body);
    }
  });

  const dataToSend = JSON.stringify(JSON.parse(data).Response);
  console.log(dataToSend);
  console.log(data);
  res.send(data);
});

// Handle Character List Request
router.get('/GetCharacterList/:membershipType/:destinyMembershipId', async (req, res, next) => {
  console.log('Character List Request');
  const data = await rp({
    url: `https://www.bungie.net/Platform/Destiny2/${req.params.membershipType}/Profile/${req.params.destinyMembershipId}/?components=200,100`,
    headers: {
      "X-API-KEY": API_KEY
    }
  }).catch((err, res, body) => {
    if (err) {
      console.log(body);
      console.log(keys(err));
      console.log(err.options);
      err.send(err.response.body);
    }
  });
  const dataToSend = trimResponse(data);
  res.send(dataToSend);
});

// Handle Individual Item Request 
router.get('/getInstancedItemDetails/:membershipType/:destinyMembershipId/:itemInstanceId', async (req, res, next) => {
  const data = await rp({
    url: `https://www.bungie.net/Platform/Destiny2/${req.params.membershipType}/Profile/${req.params.destinyMembershipId}/Item/${req.params.itemInstanceId}/?components=300,302`,
    headers: {
      "X-API-KEY": API_KEY
    }
  }).catch((err, res, body) => {
    if (err) {
      console.log(body);
      console.log(keys(err));
      console.log(err.options);
      err.send(err.response.body);
    }
  });
  const dataToSend = trimResponse(data);
  res.send(dataToSend);
});


// Handle Individual Character Inventory Request
router.get('/getCharacterInventory/:membershipType/:destinyMembershipId/:characterId', async (req, res, next) => {
  console.log('Character Inventory Request');
  const data = await rp({
    url: `https://www.bungie.net/Platform/Destiny2/${req.params.membershipType}/Profile/${req.params.destinyMembershipId}/Character/${req.params.characterId}/?components=201,205`,
    headers: {
      "X-API-KEY": API_KEY
    }
  }).catch((err, res, body) => {
    if (err) {
      console.log(body);
      console.log(keys(err));
      console.log(err.options);
      err.send(err.response.body);
    }
  });
  const dataToSend = trimResponse(data);
  res.send(dataToSend);
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