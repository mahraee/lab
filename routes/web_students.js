var express = require('express');
const student_controller = require('../controllers/student');

var router = express.Router();

router.get('/create', student_controller.createSForm);
router.post('/create', student_controller.createNewStudent);
module.exports = router;