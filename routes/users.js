const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController')

/* GET users listing. */
// router.get('/', userController.users);

// user-supplied Data
// req.params
router.get('/:id', userController.user);

// // request.body
// router.post('/', userController.createuser)

// update user
router.put("/",userController.putuser)

router.delete('/', userController.deleteuser)


module.exports = router;
