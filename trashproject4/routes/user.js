const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/',userController.createUser);
router.get('/:id', userController.GetUserById);
router.put('/:id', userController.UpdateUser);
router.delete('/:id', userController.DeleteUser);





module.exports = router;