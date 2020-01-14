const router = require('express').Router();
const rp = require('request-promise-native');
require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./database.sqlite3', sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log(('Connected to sqlite db'));
});

const API_KEY = process.env.API_KEY;
let ROOT_PATH;
process.env.DEV_MODE ? ROOT_PATH = 'https://localhost:3000/' : ROOT_PATH = '/';

const trimResponse = (data) => {
  return JSON.stringify(JSON.parse(data).Response);
}

const convertHash = hash => {
  let x = parseInt(hash);
  if (x > 0xFFFFFFFF) {
    console.error('Too big, must have a wrong number');

  }
  if (x > 0x7FFFFFFF) {
    x = 0x100000000 - x;
    if (x < 2147483648) {
      return -x
    }
    else {
      return -2147483648
    }
  }
  return x;
}

const keys = (object) => console.log(Array.from(Object.keys(object)));

// Get Manifest:
router.get('/ManifestPaths', async (req, res, next) => {
  const MANIFEST_PATH = await rp({
    url: `https://www.bungie.net/Platform/Destiny2/Manifest`,
    headers: {
      "X-API-KEY": API_KEY
    }
  }).catch((err, res, body) => {
    if (err) {
      console.log(body);
      console.log(keys(err));
      console.log(err.options);
      res.send(err);
    }
  });
  res.send(MANIFEST_PATH);
})

router.get('/GetItemDetails/:itemHash', async (req, res, next) => {
  db.get(`SELECT json FROM DestinyInventoryItemDefinition WHERE id = ${convertHash(req.params.itemHash)}`, (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    res.send(row.json);
  });
});

//TEST full Equipment details in one go:
router.get('/GetFullEquipment/:membershipType/:destinyMembershipId/:characterId', async (req, res) => {
  const equipmentFromAPI = await rp({
    url: `https://www.bungie.net/Platform/Destiny2/${req.params.membershipType}/Profile/${req.params.destinyMembershipId}/Character/${req.params.characterId}/?components=205`,
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
  const equipmentJson = await JSON.parse(equipmentFromAPI).Response.equipment.data.items;
  const addItemInstances = await Promise.all(equipmentJson.map(async item => {
    const data = await rp({
      url: `https://www.bungie.net/Platform/Destiny2/${req.params.membershipType}/Profile/${req.params.destinyMembershipId}/Item/${item.itemInstanceId}/?components=300`,
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
    const instanceDetails = await JSON.parse(data).Response.instance.data;
    item.instanceDetails = instanceDetails;
    return item;
  }));
  // const addStaticDetails = addItemInstances.map(item => {
  //   db.get(`SELECT json FROM DestinyInventoryItemDefinition WHERE id = ${convertHash(item.itemHash)}`, (err, row) => {
  //     if (err) {
  //       item.staticDetails = null;
  //       return item;
  //     }
  //     const staticDetails = JSON.parse(row.json);
  //     item.staticDetails = staticDetails;
  //     return item;
  //   });
  // });
  const toSend = JSON.stringify(addItemInstances);
  console.log(typeof toSend);
  res.send(toSend);
})


// db.close((err) => {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log('closing sqlite db');
// })

module.exports = router;