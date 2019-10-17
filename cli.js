let args = process.argv.slice(2);
let runSeedCmd = false;
let runCreateCmd = false;
let runDeleteCmd = false;

const help = `
Usage: node cli.js <command> <options>

    commands:
        seed
        create <name> <username> <password>
        delete <username>
`;

function usage(){
    console.log(help)
    process.exit(1);
}

if (args.length === 0 ){
  usage();
}

if (args[0] !== 'seed' && args[0] !== 'create' && args[0] !== 'delete'){
  usage();
}

if (args[0] === 'seed') {
    runSeedCmd = true;
}

if (args[0] === 'create') {
    if (args.length !== 4){
        usage();
    }

    runCreateCmd = true;
}

if (args[0] === 'delete') {
    if (args.length !== 2) {
        usage();
    }

    runDeleteCmd = true;
}

const faker = require('faker');
const config = require('./config');
const mongoose = require('mongoose');
const Contact = require('./models/contact');


// Database
mongoose.connect(config.db, {
  useNewUrlParser: true,
  useCreateIndex: true
});

const db = mongoose.connection;
db.on('error',function(){
    process.exit(1); // exit wth non-zero(error) code
});

db.once('open', function() {
  if (runSeedCmd) {
    console.log("inserting docs...");
    seed();
    return
  }

  if (runCreateCmd) {
    console.log("creating contact...");
    createContact(...args.slice(1)); // drop the "create", first arg.
    return
  }

  if (runDeleteCmd) {
    console.log("deleting contact...");
    deleteContact(...args.slice(1)); // drop the "create", first arg.
    return
  }
  
});

function seed(){

    let rawContacts = [];
    for (let i = 0; i < 20; i++) {
        let rawContact = {
            username: faker.internet.userName(),
            user: {
                name: faker.name.findName(),
                password: faker.internet.password()
            },
            address: {
                street: {
                    name: faker.address.streetName(),
                    num: faker.random.number() 
                },
                city: faker.address.city(),
                state: faker.address.state(),
                country: faker.address.country(),
                post_code: faker.address.zipCode()
            },
            phone_numbers: [faker.phone.phoneNumber()],
            emails: [faker.internet.email()],
            birth_date: faker.date.past()
        }
        rawContacts.push(rawContact)
    }

    Contact.insertMany(rawContacts, function(err, docs) {
        if (err){console.log(err);process.exit(1)}
        // console.log(`${docs.length} docs inserted!`)
        // console.log(docs[0].fullAddress)
        process.exit(0)
    });

}

function createContact(name, username, password) {
    let rawContact = {
        username: username,
        user: {
            name: name,
            password: password
        }
    }
    
    Contact.init().then((event) => {
        console.log(event);
        Contact.create(rawContact, function(err, docs) {
            if (err){console.log(err);process.exit(1)}
            console.log(docs);
            process.exit(0);
        });
    })
}

function deleteContact(username) {
    Contact.deleteOne({ username: username }, function (err, docs) {
        if (err){console.log(err);process.exit(1)}
            console.log(docs);
            process.exit(0);
    });
    console.log(username);
    
}

