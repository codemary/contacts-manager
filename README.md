## app.js

```js
+ app.use(express.static(path.join(__dirname, 'client/build')));


app.post('/signup', userController.signupUser);
app.post('/login', userController.loginUser);

app.use(jwt({secret: config.secret}))

app.use('/contacts', contactsRouter);
app.use('/users', usersRouter);

// Handles any requests that don't match the ones above
+ app.get('*', (req,res) =>{
+  res.sendFile(path.join(__dirname+'/client/build/index.html'));
+ });
```

## config.js

```json
const prodConfig = {
  db: env.MONGO_URI,
  secret: env.JWT_SECRET
};

```

## package.json

```json
"scripts": {
    "dev-server": "nodemon --ignore db.json ./bin/www",
    "start": "./bin/www",
+   "heroku-postbuild": "cd client && npm install --only=dev && npm install && npm run build"
  },

```

## Heroku Deploy

1. Install heroku cli and setup: https://dashboard.heroku.com/apps/<myproject-name>/deploy/heroku-git
2. heroku config:set MONGO_URI="mongodb+srv://username:password@myproject.mongodb.net/contacts-manager?retryWrites=true"
3. heroku config:set JWT_SECRET=<your-secret>

4. Deploy to Heroku

```bash
$ git add .
$ git commit -am "make it better"
$ git push heroku master
```