const router = require('express').Router();
const passport = require('passport');
const Oauth2Strategy = require('passport-oauth2');
const rp = require('request-promise-native');
require('dotenv').config();
const { client_id, client_secret, API_KEY } = process.env;
const User = require('../models/user-models.js');
let ROOT_PATH;
process.env.DEV_MODE ? ROOT_PATH = 'https://localhost:3000/' : ROOT_PATH = '/';

const keys = (object) => console.log(Array.from(Object.keys(object)));

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

//cookies
passport.serializeUser((user, done) => {
  console.log('serialized');
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  })
});


router.use('/', (req, res, next) => {
  keys(req);
  keys(req.query);
  console.log('Code:', req.query.code);

  next();
});

//auth login

passport.use(new Oauth2Strategy({
  authorizationURL: 'https://www.bungie.net/en/oauth/authorize',
  tokenURL: 'https://www.bungie.net/platform/app/oauth/token/',
  clientID: client_id,
  clientSecret: client_secret,
  callBackURL: 'https://localhost:3001/auth/redirect'
}, async (accessToken, refreshToken, profile, done) => {
  const data = await rp({
    url: `https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/`,
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "X-API-KEY": API_KEY
    }
  }, err => err && console.log(err));
  const accountInfo = JSON.parse(data).Response;
  const destinyProfile = accountInfo.destinyMemberships;
  const bungieProfile = accountInfo.bungieNetUser;
  User.findOne({ bungieId: bungieProfile.membershipId })
    .then(currentUser => {
      if (currentUser) {
        done(null, currentUser);
      } else {
        new User({
          username: bungieProfile.displayName,
          bungieId: bungieProfile.membershipId,
          locale: bungieProfile.locale,
          platforms: destinyProfile.map(profile => {
            return {
              displayName: profile.displayName,
              membershipType: profile.membershipType,
              membershipId: profile.membershipId,
              crossSaveOverride: profile.crossSaveOverride,
              iconPath: profile.iconPath
            }
          })
        }).save().then(newUser => {
          done(null, newUser);
        });
      }
    });

}));

router.get('/login', passport.authenticate('oauth2'));

router.get('/logout', (req, res) => {
  // Handle logout with passport
  console.log('logged out');
  req.session.isLoggedIn = false;
  req.session.userId = null;
  req.session.userProfile = null;
  req.logout();
  res.redirect(ROOT_PATH);
});

router.get('/redirect', passport.authenticate('oauth2'), (req, res) => {
  console.log('redirect');
  keys(req);
  console.log('user:', req.user);
  req.session.userId = req.session.passport.user;
  req.session.isLoggedIn = true;
  req.session.userProfile = req.user;
  console.log('after');
  res.redirect(ROOT_PATH);
});


router.get('/checkAuth', authCheck, (req, res) => {
  res.send(req.session.isLoggedIn);
})

module.exports = router;