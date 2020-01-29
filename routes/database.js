const router = require('express').Router();
const rp = require('request-promise-native');
require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();

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
  let db = new sqlite3.Database('./database.sqlite3', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
    }
  });
  db.get(`SELECT json FROM DestinyInventoryItemDefinition WHERE id = ${convertHash(req.params.itemHash)}`, (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    res.send(row.json);
  });
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
  });
});



module.exports = router;