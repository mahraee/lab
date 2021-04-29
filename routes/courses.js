var express = require('express');
const courseController = require('../controllers/course');

var router = express.Router();
router.get('/create', courseController.createCForm);
router.delete('/:id', courseController.deleteCourse);
router.put('/:id', courseController.updateCourse);
router.get('/:id', courseController.readAvailbleCourse);
router.get('/', courseController.printCourses);
router.post('/create', courseController.createNewCourse);

module.exports = router;
