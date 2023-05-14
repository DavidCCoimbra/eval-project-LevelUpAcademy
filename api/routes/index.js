var express = require('express');
var router = express.Router();
const FormController = require('../controllers/FormController');

/* GET home page. */

router.post("/validate", FormController.validateCardDetails);

module.exports = router;
