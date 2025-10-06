const express = require ('express');
const router = express.Router();
const userVerbose = require ('../controllers/controle');



router.post('/api/users', userVerbose.userCreate);
router.delete('/api/users/delete',userVerbose.userDelete);
router.get('/api/users/username',userVerbose.userFindByUsername);
router.get('/api/users/email', userVerbose.userFindByEmail);
router.put('/api/users/update',userVerbose.userUpdate);




module.exports = router;

