const router = require('express').Router();
const rp = require('request-promise-native');
const sqlite3 = require('sqlite3').verbose();
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

//Full Equipment details in one go:
router.get('/GetFullEquipment/:membershipType/:destinyMembershipId/:characterId', authCheck, async (req, res) => {
  console.time('Full Inventory Request');
  const ItemLocationTable = ["Unknown", "Inventory", "Vault", "Vendor", "Postmaster"]; //Bungie api enum.
  let db = new sqlite3.Database('./database.sqlite3', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
    }
  });

  const sortInventory = inv => {
    console.time('Sort');
    let sortedInventory = {};
    inv.forEach(item => {
      if (item.bucketDetails.displayProperties.name) {
        sortedInventory[item.bucketDetails.displayProperties.name] ?
          sortedInventory[item.bucketDetails.displayProperties.name].push(item) :
          sortedInventory[item.bucketDetails.displayProperties.name] = [item];
      }
    });
    console.timeEnd('Sort');
    return sortedInventory;
  }

  //Get equipped items (205) and inventory data (201) for character from Bungie: 
  const dataFromAPI = await rp({
    url: `https://www.bungie.net/Platform/Destiny2/${req.params.membershipType}/Profile/${req.params.destinyMembershipId}/Character/${req.params.characterId}/?components=201,205`,
    headers: {
      "X-API-KEY": API_KEY
    }
  }).catch((err, res, body) => {
    if (err) {
      console.log('Error in GetFullEquipment, getting equipment from Bungie');
      console.log(body);
      console.log(keys(err));
      console.log(err.options);
      res.send(err)
    }
  });

  // Parse JSON and trim off some object layers from API response
  const equipmentArray = await JSON.parse(dataFromAPI).Response.equipment.data.items;
  const fullInventoryArray = await JSON.parse(dataFromAPI).Response.inventory.data.items;

  // Get static and instanced item information:
  const equipmentWithDetails = await Promise.all(equipmentArray.map(async item => {
    // Get item instance information from Bungie
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

    //Trim some layers off the response from bungie and parse the JSON:
    const instanceDetails = await JSON.parse(data).Response.instance.data;

    // Get static details from the sqlite database
    const staticDetails = await new Promise(resolve => {
      db.get(`SELECT json FROM DestinyInventoryItemDefinition WHERE id = ${convertHash(item.itemHash)}`, (err, row) => {
        if (err) {
          return console.error(err.message);
        }
        resolve(JSON.parse(row.json));
      });
    });

    // Attach details to the item object:
    item.staticDetails = staticDetails;
    item.instanceDetails = instanceDetails;



    return item;
  }));

  const fullInventoryWithDetails = await Promise.all(fullInventoryArray.map(async item => {
    const staticDetails = await new Promise(resolve => {
      db.get(`SELECT json FROM DestinyInventoryItemDefinition WHERE id = ${convertHash(item.itemHash)}`, (err, row) => {
        if (err) {
          return console.error(err.message);
        }
        resolve(JSON.parse(row.json));
      });
    });

    const bucketDetails = await new Promise(resolve => {
      db.get(`SELECT json FROM DestinyInventoryBucketDefinition WHERE id = ${convertHash(item.bucketHash)}`, (err, row) => {
        if (err) {
          return console.error(err.message);
        }
        resolve(JSON.parse(row.json));
      })
    });
    item.staticDetails = staticDetails;
    item.bucketDetails = bucketDetails;
    return item;
  }));

  const sortedInventoryArray = sortInventory(fullInventoryWithDetails);

  let payload = {
    equipment: equipmentWithDetails,
    inventory: sortedInventoryArray
  }

  const dataToSend = JSON.stringify(payload);
  console.timeEnd('Full Inventory Request');
  res.send(dataToSend);
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
  });
})

//Test Transfer Item Request API
// For multiple items at a time, bungie.net.../TransferItems
router.get('/Item/TransferItem?itemReferenceHash&stackSize&transferToVault&itemId&characterId&membershipType', async (req, res, next) => {
  console.log('Item Transfer');
  const { itemReferenceHash, stackSize, transferToVault, itemId, characterId, membershipType } = req.query;
  rp({
    method: 'POST',
    url: `https://www.bungie.net/Platform/Destiny2/Actions/Items/TransferItem/`,
    headers: {
      "X-API-KEY": API_KEY
    },
    body: {
      itemReferenceHash, // Number or string?: regular item id
      stackSize, // Number: number of items to transfer. Always 1 unless you're moving consumables, which... who'd do it?
      transferToVault, // Boolean: True = to the vault, I think false = from the vault
      itemId, // Number: instanceItemId
      characterId, // Number: characterId
      membershipType // Number: Xbox = 1, etc..
    }
  }).catch((err, res, body) => {
    if (err) {
      console.log(body);
      console.log(keys(err));
      console.log(err.options);
      err.send(err.response.body);
    }
  });
  console.log(data);
  res.send(data);
})


// Get Current User Data
router.get('/Profile/getCurrentUser', authCheck, async (req, res, next) => {
  console.log('Getting Current User Data');
  const { isLoggedIn, userId, userProfile } = req.session;
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
  res.send(dataToSend);
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