const router = require('express').Router();
const passport = require('passport');
const Oauth2Strategy = require('passport-oauth2');
const rp = require('request-promise-native');
require('dotenv').config();
const { client_id, client_secret, API_KEY } = process.env;
const ROOT_PATH = process.env.ROOT_PATH || 'http://localhost:3000';
const User = require('../models/user-models.js');


//cookies
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  })
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
        console.log('Existing User Logged In');
        console.log(currentUser);
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
          console.log('Created New User');
          console.log(newUser);
          done(null, newUser);
        });
      }
    });

}));

router.get('/login', passport.authenticate('oauth2'));

router.get('/logout', (req, res) => {
  // Handle logout with passport
  req.logout();
  res.redirect(`${ROOT_PATH}/`);
});

router.get('/failure', (req, res) => {
  res.send('Failure');
});

router.get('/success', (req, res) => {
  res.send('Success');
});

router.get('/redirect', passport.authenticate('oauth2', {}),
  (req, res) => {
    if (req.user) {
      console.log('logged in');
    }
    // Successful authentication, redirect home.
    // const reqKeys = Array.from(Object.keys(req));
    // console.log(reqKeys);
    console.log(req.query.code);
    res.redirect(`${ROOT_PATH}/`);
  });



module.exports = router;