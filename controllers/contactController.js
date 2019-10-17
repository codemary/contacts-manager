const Contact = require('../models/contact');
const Address = require('../models/address');
const validator = require('validator');
const createError = require('http-errors');

function contacts(req, res) {
    try {
        Contact.find({user: req.user._id}).populate("addresses").exec(function (err, contacts) {
            res.send(contacts || []);
        })
    } catch(err){
        console.log(err)
        next(createError(500,err))
    }
}

// get
function contact(req, res,next) {
    const id = req.params.id;
    Contact.findOne({ _id: id}).populate("addresses").exec(function (err, result) {
        if (err || !result) {
            next(createError(400, `resource ${id} not found`))
            return;
        }
        res.send(result);
    });
}

// post
function createcontact(req, res,next) {
    let contact = req.body; // body is json object due to express.json() middleware
    console.log(contact)
    let rawContact = {
        user: req.user._id, // for the authenticated user
        name: contact.name,
        addresses: contact.addresses,
        phone_numbers: contact.phone_numbers,
        emails: contact.emails,
        birth_date: contact.birth_date  
    }

    if (!rawContact.name) {
        next(createError(400, "missing required name!"))
        return;
    }

    if (rawContact.name < 3) {
        next(createError(400, "name should be atleast 3 characters"))
        return;
    }

    if (rawContact.emails) {
        rawContact.emails.forEach(
            email => {
                if (!validator.isEmail(email)) {
                    throw createError(400, `Error: Invalid email ${email}`);
                }
            });
    }

    if (rawContact.phone_numbers) {
        rawContact.phone_numbers.forEach(
            phone => {
                if (!validator.isMobilePhone(phone)) {
                    throw createError(400, `Error: Invalid phone number ${phone}`);
                }
            });
    }

    Contact.create(rawContact, function (err, doc) {
        if (err) {
            console.log(err)
            next(createError(500, "unexpected error!"))
            return;
        }

        try {
            contact.addresses && contact.addresses.forEach(address => {
                address.contact = doc._id; // link address to current contact
                Address.create(address, function (err) {
                    if (err) {
                        throw err
                    }
                })
            })
        } catch (err) {
            console.log(err)
            next(createError(500, "unexpected error!"))
            return;
        }

        res.send(doc);
    });
}

// delete contact
function deletecontact(req, res,next) {
    const id = req.params.id;


    Contact.deleteOne({
        _id: id
    }, function (err, result) {
        if (err) {
            next(createError(400, `resource ${id} not found`))
            return;
        }
        res.send(result);
    })
}

// update contact
function putcontact(req, res, next) {
    const id = req.params.id;
    let updateContact = req.body;
    try {
    
        if (updateContact.emails) {
            updateContact.emails.forEach(
                email => {
                    if (!validator.isEmail(email)) {
                        throw createError(400, `Error: Invalid email ${email}`);
                    }
                });
        }

        if (updateContact.phone_numbers) {
            updateContact.phone_numbers.forEach(
                phone => {
                    if (!validator.isMobilePhone(phone)) {
                        throw createError(400, `Error: Invalid phone number ${phone}`);
                    }
                });
        }
    } catch (e) {
        console.log(e)
        next(createError(500,e))
        return;
    }

    Contact.findOne({
        _id: id
    }, function (err, contact) {
        if (err || !contact) {
            next(createError(500, "unexpected error: finding user"))
            return;
        }

        if (updateContact.phone_numbers) {
            updateContact.phone_numbers.forEach(
                phone => !contact.phone_numbers.includes(phone) && contact.phone_numbers.push(phone));
        }

        if (updateContact.emails) {
            updateContact.emails.forEach(
                email => !contact.emails.includes(email) && contact.emails.push(email));
        }

        if (updateContact.birthdate) {
            contact.birth_date = updateContact.birthdate;
        }

        if (updateContact.name) {
            contact.name = updateContact.name
        }

        // in put
        contact.save(function (err, result) {
            if (err) {
                next(createError(500, "unexpected error: saving user"))
                return;
            }

            try {
                updateContact.addresses &&  updateContact.addresses.forEach(address => {
                    address.contact = result._id; // link address to current contact
                    Address.create(address, function (err) {
                        if (err) {
                            throw err
                        }
                    })
                })
            } catch (err) {
                next(createError(500, "unexpected error: saving address"))
                return;
            }

            res.send(result)
        });
    });
}

module.exports = {
    contacts: contacts,
    contact: contact,
    createcontact: createcontact,
    deletecontact: deletecontact,
    putcontact: putcontact
}