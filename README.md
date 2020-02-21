# Destiny 2 Armor Optimizer

A React Web App for viewing your equipment, saving and equipping load outs, and comparing armor stats.

## To run locally:

This project isn't well optimized for anyone to just pick it up and play. Mostly it's been a great excuse to learn a lot of different technologies for me. However, if you do want to try and get this going at home, you'll need to jump through a few hoops.

After cloning the repo, and installing the npm packages, you'll need to create a .env in the root directory. Within that .env file, you'll need the following variables, with descriptions below as to where I got mine.
```
PORT=3001 //You can set this to whatever you want, but be sure to change the proxy in /client/package.js to match.
API_KEY= Your api key from www.bungie.net
client_secret= Client secret from www.bungie.net
client_id= Client ID from www.bungie.net
Mongo_DB= Mongo DB connection.
cookieKey= A string. Can be mostly whatever you want, it's used as a key to encrypt and decrypt cookies
DEV_MODE=true Change this to false when running a 'build' version of your React app.
```
---

### API_KEY, client_secret, and client_id
First, you must have a bungie.net account. After registering with Bungie, go to [https://www.bungie.net/en/Application](https://www.bungie.net/en/Application), and Create New App.

-You can choose whatever name and url you'd like, or even leave the url blank for now. I used this repo.  
-Redirect URL: 'https://localhost:3001/auth/redirect' //This would need to be changed for a live site.  
-Scope: Be sure to check the boxes for:  
 'Read your Destiny 2 information Vault, Inventory, and Vendors, as well as Destiny 1 Vault and Inventory data.'  
 'Move or equip Destiny gear and other items.'  
-Origin Header: * //One would change this for a live site as an extra layer against ne'er-do-wells.  

Once you've registered your app, you'll be taken to a screen with the API Key, and client secret/id. Put those as strings in their respective variables in your .env file.


### Mongo_DB
You'll need your own MongoDB database. I'm currently using the free offering at [mongodb.com](http://www.mongodb.com)
Once you have a cluster, and an admin set up on that cluster, you can get the string to set Mongo_DB by clicking the 'Connect' button on your cluster view, and then 'Connect Your Application'.


## But wait, there's more!
Because Bungie requires https to be used when connecting to their API, you'll need a server.crt and server.key file in the root directory of this project. I got mine by following these instructions from [freeCodeCamp](https://www.freecodecamp.org/news/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec/).

### Getting the sqlite database from bungie:
Once you have the server.crt and server.key files in place, you should be able to fire up the Express server.  
In your command terminal, go to the root directory of this project, and npm start. Assuming all went well, open your browser to [https://localhost:3001/database/ManifestPaths](https://localhost:3001/database/ManifestPaths)

This should fetch you a json file, with the last halves of a lot of urls. Find the mobileWorldContentPaths object, and copy the path, without quotes, from en: .

Now paste the path you just copied after www.bungie.net in your browser . 
  example: www.bungie.net/common/destiny2_content/sqlite/en/world_sql_content_46cf9ce60af935fdb7103928794f1cd3.content  
A file should download.  
Go to your downloads and find that file. It is a zipped version of the current Destiny 2 sqlite database.  

#### More fun ensues!

I'm on a Mac, so your experience here may vary.  
My computer had no clue what to do with a .content file. So getting to this solution the first time was tricky.  
First, I rename the file to end with .zip instead of .content. Now my computer knows what to do with the file.  
Unzip the file, and then rename the decompressed file again, this time to 'database.sqlite3'.  
Finally, move database.sqlite3 to the root directory of this project.  


## I think that's it!

From here, you should be able to go into this-project/client and run npm start there as well.  
Remember that both the express server in the root directory, and the react server in the client directory need to be running for this to work.

That wasn't so bad, right?

Even after following this guide, your browser will probably still warn you about going to an unsecure site. You'll have to click through the warnings to get to the product.

I haven't tested this more than once just yet. So hopefully if you've followed this, everything has worked out for you. If not, let me know. I'd be interested to hear what sort of challenges pop up in a process such as this.
