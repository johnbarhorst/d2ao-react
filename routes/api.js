const router = require('express').Router();
const rp = require('request-promise-native');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();
const API_KEY = process.env.API_KEY;
let ROOT_PATH;
process.env.DEV_MODE ? ROOT_PATH = 'https://localhost:3000/' : ROOT_PATH = '/';

//Helpful little debugging function
const keys = (object) => console.log(Array.from(Object.keys(object)));

// Bungie enums:
const itemStateEnum = {
  0: 'none',
  1: 'locked item',
  2: 'tracked item',
  4: 'masterwork item'
};

const transferStatusEnum = {
  0: 'Can Transfer',
  1: 'Item is equipped',
  2: 'Non-transferrable item',
  4: 'No room in transfer destination'
};

const flagEnum = (state, value) => !!(state & value);
const itemStateEnumFlag = {
  none: state => flagEnum(state, 0),
  locked: state => flagEnum(state, 1),
  tracked: state => flagEnum(state, 2),
  masterwork: state => flagEnum(state, 4),
  lockedAndMasterwork: state => flagEnum(state, 5)
};

// Trim Response off the response object from Bungie, then convert back to string to send.
const trimResponse = (data) => {
  return JSON.stringify(JSON.parse(data).Response);
}

// Hash converter for sqlite look ups
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

const handleRPError = (err) => {
  const error = JSON.parse(err.error);
  throw new Error(err.error);
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
  const ItemLocationEnum = ["Unknown", "Inventory", "Vault", "Vendor", "Postmaster"]; //Bungie api enum.
  let db = new sqlite3.Database('./database.sqlite3', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
    }
  });

  const sortInventory = inv => {
    console.time('Sort');
    const toCamelCase = (str) => {
      return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    }
    let sortedInventory = {};
    inv.forEach(item => {
      if (item.bucketDetails.displayProperties.name) {
        sortedInventory[toCamelCase(item.bucketDetails.displayProperties.name)] ?
          sortedInventory[toCamelCase(item.bucketDetails.displayProperties.name)].push(item) :
          sortedInventory[toCamelCase(item.bucketDetails.displayProperties.name)] = [item];
      }
    });
    console.timeEnd('Sort');
    return sortedInventory;
  }

  const getFromDB = async (hash, table) => {
    return await new Promise(resolve => {
      db.get(`SELECT json FROM ${table} WHERE id = ${convertHash(hash)}`, (err, row) => {
        if (err) {
          console.log(err);
          return console.error(err.message);
        }
        resolve(JSON.parse(row.json));
      })
    })
  }

  //Get equipped items (205) and inventory (201) data for character from Bungie: 
  const dataFromAPI = await rp({
    url: `https://www.bungie.net/Platform/Destiny2/${req.params.membershipType}/Profile/${req.params.destinyMembershipId}/Character/${req.params.characterId}/?components=201,205,300,302,304,305`,
    headers: {
      "X-API-KEY": API_KEY
    }
  }).catch((err) => handleRPError(err));

  // Parse JSON and trim off some object layers from API response
  const equipmentArray = await JSON.parse(dataFromAPI).Response.equipment.data.items;
  const fullInventoryArray = await JSON.parse(dataFromAPI).Response.inventory.data.items;
  const itemComponents = await JSON.parse(dataFromAPI).Response.itemComponents.instances.data;
  keys(JSON.parse(dataFromAPI).Response);


  // Get instanced and static item information for equipped items:
  const equipmentWithDetails = await Promise.all(equipmentArray.map(async (item, index) => {
    // Get item instance information from Bungie
    const data = await rp({
      url: `https://www.bungie.net/Platform/Destiny2/${req.params.membershipType}/Profile/${req.params.destinyMembershipId}/Item/${item.itemInstanceId}/?components=300,302,304,305`,
      headers: {
        "X-API-KEY": API_KEY
      }
    }).catch((err) => handleRPError(err));

    //Trim some layers off the response from bungie and parse the JSON:
    item.instanceDetails = await JSON.parse(data).Response.instance.data || {};
    // If item has no stat object, add an empty one to avoid bugs
    // Then get each stats definition from the DB, and tack it on to the stat object.
    console.time(`DB ${index}`);
    item.stats = await Promise.all(Array.from(Object.values((await JSON.parse(data).Response.stats.data || { stats: {} }).stats).map(async stat => {
      return {
        ...stat,
        statDefinitions: await getFromDB(stat.statHash, 'DestinyStatDefinition')
      }
    })));
    item.sockets = await Promise.all(((await JSON.parse(data).Response.sockets.data || { sockets: [] }).sockets).map(async socket => {
      return {
        ...socket,
        plugDefinitions: socket.plugHash ? await getFromDB(socket.plugHash, 'DestinyInventoryItemDefinition') : {}
      }
    }));
    item.perks = await Promise.all(((await JSON.parse(data).Response.perks.data || { perks: [] }).perks).map(async perk => {
      return {
        ...perk,
        perkDefinitions: await getFromDB(perk.perkHash, 'DestinySandboxPerkDefinition')
      }
    }));
    item.bucket = await getFromDB(item.bucketHash, 'DestinyInventoryBucketDefinition');


    // Get static details from the sqlite database
    item.staticDetails = await getFromDB(item.itemHash, 'DestinyInventoryItemDefinition');
    console.timeEnd(`DB ${index}`);
    return item;
  }));

  // Get static and instanced item information for inventory items
  const fullInventoryWithDetails = await Promise.all(fullInventoryArray.map(async item => {
    // Get static details from the sqlite database
    item.staticDetails = await getFromDB(item.itemHash, 'DestinyInventoryItemDefinition');

    // Get bucket definitions details from the sqlite database
    item.bucketDetails = await getFromDB(item.bucketHash, 'DestinyInventoryBucketDefinition');

    return item;
  }));

  // Sort the inventory items by bucket, and change hashes to the display name for easy reading
  const sortedInventoryArray = sortInventory(fullInventoryWithDetails);

  let payload = {
    equipment: equipmentWithDetails,
    inventory: sortedInventoryArray,
    itemComponents
  }

  const dataToSend = JSON.stringify(payload);
  console.timeEnd('Full Inventory Request');
  res.status(200).send(dataToSend);
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
  }).catch((err) => handleRPError(err));
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
  }).catch((err) => handleRPError(err));

  const dataToSend = JSON.stringify(JSON.parse(data).Response);
  res.send(dataToSend);
});

// Handle Character List Request
router.get('/GetCharacterList/:membershipType/:destinyMembershipId', async (req, res, next) => {
  console.log('Character List Request');
  const classTypeRef = ["Titan", "Hunter", "Warlock"];
  const genderTypeRef = ["Male", "Female"];
  const raceTypeRef = ["Human", "Awoken", "Exo"];
  let db = new sqlite3.Database('./database.sqlite3', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
    }
  });

  const getFromDB = async (hash, table) => {
    return await new Promise(resolve => {
      db.get(`SELECT json FROM ${table} WHERE id = ${convertHash(hash)}`, (err, row) => {
        if (err) {
          console.log(err);
          return console.error(err.message);
        }
        resolve(JSON.parse(row.json));
      })
    })
  }
  const data = await rp({
    url: `https://www.bungie.net/Platform/Destiny2/${req.params.membershipType}/Profile/${req.params.destinyMembershipId}/?components=100,102,103,200,201,205,300,304,305`,
    headers: {
      "X-API-KEY": API_KEY
    }
  }).catch((err) => handleRPError(err));
  const testData = await JSON.parse(data).Response;
  const profile = await JSON.parse(data).Response.profile.data;
  const characters = await JSON.parse(data).Response.characters;
  const guardians = Array.from(Object.values(characters.data));
  const guardiansWithData = await Promise.all(guardians.map(async guardian => {
    guardian.stats = await Promise.all((Array.from(Object.keys(guardian.stats))).map(async stat => {
      const details = await getFromDB(convertHash(stat), 'DestinyStatDefinition')
      return {
        ...details,
        value: guardian.stats[stat]
      }
    }))
    return {
      ...guardian,
      race: raceTypeRef[guardian.raceType],
      gender: genderTypeRef[guardian.genderType],
      guardianClass: classTypeRef[guardian.classType],
    }
  }));
  const payload = {
    profile: profile,
    characters: guardiansWithData,
    testData
  }
  const dataToSend = JSON.stringify(payload);
  res.status(200).send(dataToSend);
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
  });
});

// Handle Individual Item Request 
router.get('/getInstancedItemDetails/:membershipType/:destinyMembershipId/:itemInstanceId', async (req, res, next) => {
  const data = await rp({
    url: `https://www.bungie.net/Platform/Destiny2/${req.params.membershipType}/Profile/${req.params.destinyMembershipId}/Item/${req.params.itemInstanceId}/?components=300,302`,
    headers: {
      "X-API-KEY": API_KEY
    }
  }).catch((err) => handleRPError(err));
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
  }).catch((err) => handleRPError(err));
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

router.get('/db/:table/:hash', async (req, res, next) => {
  let db = new sqlite3.Database('./database.sqlite3', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
    }
  });
  const getFromDB = async (hash, table) => {
    return await new Promise(resolve => {
      db.get(`SELECT json FROM ${table} WHERE id = ${convertHash(hash)}`, (err, row) => {
        if (!row) {
          return resolve({ response: 'Not found, perhaps wrong table?' })
        }
        if (err) {
          console.log(err);
          return console.error(err.message);
        }
        resolve(JSON.parse(row.json));
      })
    })
  }
  const { table, hash } = req.params;
  const data = await getFromDB(hash, table);
  const json = JSON.stringify(data);
  res.send(json);
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
  });
});

router.get('/tables', async (req, res, next) => {
  let db = new sqlite3.Database('./database.sqlite3', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
    }
  });
  const tables = await new Promise(resolve => (db.all(`SELECT name FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%'`, (err, row) => {
    if (err) {
      console.log(err);
      return console.error(err.message);
    }
    resolve(row);
  })));
  const data = JSON.stringify(tables.map(table => table.name));
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
  });
  res.send(data);
})

module.exports = router;