const Jo = require('Joi');
var Courses = require('../models/course');

const { body,validationResult } = require("express-validator");

function validatecourse(course){
    
    const schema = Jo.object({
        name: Jo.string().min(5).required(),
        code: Jo.string().pattern(new RegExp('^[a-zA-Z]{3}[0-9]{3}$')).required(),
        description: Jo.string().max(200).allow('')
    });
    return schema.validate(course);
}

function validateCUpdate(course){
    
    const schema = Jo.object({
        name: Jo.string().min(5),
        code: Jo.string().pattern(new RegExp('^[a-zA-Z]{3}[0-9]{3}$')),
        description: Jo.string().max(200)
    });
    return schema.validate(course);
}

const createCForm = (req, res, next)=> {
    res.render('course_form', { title: 'Create course' });
};


const printCourses = (req, res, next)=> {
    Courses.find()
    .exec(function (err, list_courses) {
        if (err) { return next(err); }
        // Successful, so render.
        res.send(list_courses);
    })
};

const createNewCourse = [

    // Validate and sanitize fields.
    body('name').trim().isLength({ min: 5 }).escape().withMessage('Name must be given.')
        ,
    body('code').trim().isLength({ min: 1 }).escape().withMessage('Code must be given.')
        .isAlphanumeric(),
    body('description').optional({ checkFalsy: true }).trim().isLength({ max: 200 }),
    
(req, res, next)=> {
    const {name, code, description} = req.body;

    const {error} = validatecourse(req.body);
    const errors = validationResult(req);

    var course = new Courses ({
        name,
        code,
        description
    });
    if (error) {
        // There are errors. Render form again with sanitized values/errors messages.
        res.render('course_form', { title: 'Create course', course: course, errors: error.details[0].message });
        return;
    }
    else{
    course.save(function (err) {
        if (err) { return next(err); }
        // Successful - redirect to new author record.
        res.send(course);
    });
}
}
];

const readAvailbleCourse = (req,res, next)=> {
    Courses.findById(req.params.id, function (err, course) {
        if (err) { res.status(404).send('This course not found'); }
        if (course == null) { // No results.
            var err = new Error('This course not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.send(course)});
    };


const updateCourse = (req, res)=> {
    const {name, code, description} = req.body;
    const {error} = validateCUpdate(req.body);
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }
    Courses.findById(req.params.id, function (err, course) {
        if (err) { 
            res.status(404).send('This course not found');
         }
         if(name) course.name = name;
         if(code) course.code = code;
         if(description) course.description = description;
         
         course.save(function (err) {
            if (err) { return next(err); }
            // Successful - redirect to new author record.
            res.send(course);
        });
        
        });
        
  
};

const deleteCourse = (req,res)=> {

    Courses.findByIdAndRemove(req.params.id, function deleteCourse(err) {
        if (err) {res.status(404).send('This course not found'); }
       
        res.send('Course Deleted');
    })

};

module.exports = {
    createNewCourse,
    readAvailbleCourse,
    updateCourse,
    deleteCourse,
    printCourses,
    createCForm
    };