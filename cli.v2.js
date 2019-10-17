#! /usr/bin/env node
let args = process.argv.slice(2);
let minimist = require('minimist')

// declare the following options as string
let inputArgs = minimist(args,{
    string: ['username','name','password',"phone","birthdate","email"],
})

// help string if command is incorrect
const help = `
Usage: node cli.js <command> <options>

    commands:
        seed
        create --name <name> --username <username> --password <password> (all required)
        delete --username <username> (required)
        update --username <username> (required)
            (atleast one)
            --phone <phone> 
            --email <email>
            --birthdate <dd/mm/yyyy>
        read --username <username> (required)
`;

function usage(){
    console.log(help)
    process.exit(1);
}

// atleast one command is required
if (inputArgs["_"].length === 0 ){
  usage();
}


// declare the supported commands
const seedCmd = 'seed';
const createCmd = 'create';
const updateCmd = 'update'
const deleteCmd = 'delete';
const readCmd = 'read';
let cmds = [seedCmd,createCmd, updateCmd, deleteCmd, readCmd]

const cmd = inputArgs["_"][0] // the command to be run
if (!cmds.includes(cmd)){
    usage();
}

// Database code starts here
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
     // switch which validates the options and runs the commands
    switch (cmd) {
        case seedCmd: 
            console.log("inserting docs...");
            seed();
            break;

        case createCmd:
            if (!inputArgs.username && !inputArgs.name && !inputArgs.password) {
                usage()
            }
            console.log("creating contact...");
            createContact(inputArgs.name,inputArgs.username,inputArgs.password);
            break;

        case deleteCmd:
            if (!inputArgs.username) {
                usage()
            }
            console.log("deleting contact...");
            deleteContact(inputArgs.username);
            break;

        case updateCmd:
            if (!inputArgs.username){
                usage()
            }
        
            if (!inputArgs.phone && !inputArgs.email &&!inputArgs.birthdate) {
                usage() // atleast one
            }
            console.log("update contact...");
            updateContact(inputArgs);
            break;
        case readCmd:
            if (!inputArgs.username) {
                usage()
            }
            console.log("reading contact...");
            readContact(inputArgs.username);
    
        default:
            break;
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
        console.log(`${docs.length} docs inserted!`)
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

function updateContact(args){
    //console.log(args)
    const username = args.username;
    let phones = [];
    if (args.phone){
        if (Array.isArray(args.phone)){
           phones = args.phone;
        } else{
            phones.push(args.phone);
        }
    }

    let emails = [];
    if (args.email){
        if (Array.isArray(args.email)){
            emails = args.email;
        } else{
            emails.push(args.email);
        }
    }

    const birthdate = args.birthdate;

    Contact.findOne({username: username}, function(err, contact) {
        if(!err) {
            if(!contact) {
                console.log("Contact not found ", err)
                process.exit(0)
                return
            }

            phones.forEach(phone => !contact.phone_numbers.includes(phone) && contact.phone_numbers.push(phone));
            emails.forEach(email => !contact.emails.includes(email) && contact.emails.push(email));

            if (birthdate){
                contact.birth_date = birthdate;
            }

            contact.save(function(err,doc) {
                if (err){console.log(err);process.exit(1)}
                console.log(doc);
                process.exit(0);
            });
        }
    });
}

function readContact(username){
    Contact.findOne({username: username}, function(err, contact) {
        if (err){console.log(err);process.exit(1)}
        console.log(contact);
        process.exit(0);
    });
}

