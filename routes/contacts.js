const express = require('express');
const router = express.Router();

const contactController = require('../controllers/contactController')

/* GET contacts listing. */
router.get('/', contactController.contacts);

// contact-supplied Data
// req.params
router.get('/:id', contactController.contact);

// request.body
router.post('/', contactController.createcontact)

// update contact
router.put("/:id",contactController.putcontact)

router.delete('/:id', contactController.deletecontact)


module.exports = router;
