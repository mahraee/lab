var express = require('express');
const studentController = require('../controllers/student');

var router = express.Router();

router.put('/:id', studentController.updatestudent);
router.get('/:id', studentController.showStudent);
router.delete('/:id', studentController.deleteStudent);
router.post('/create', studentController.createNewStudent);
router.get('/', studentController.printStudents);
router.get('/create', studentController.createSForm);

module.exports = router;
