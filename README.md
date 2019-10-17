## Heroku Deploy
1. Install heroku cli and setup: https://dashboard.heroku.com/apps/<myproject-name>/deploy/heroku-git
2. heroku config:set MONGO_URI=mongodb+srv://username:password@myproject.mongodb.net/contacts-manager?retryWrites=true
3.  $ git add .
    $ git commit -am "make it better"
    $ git push heroku master