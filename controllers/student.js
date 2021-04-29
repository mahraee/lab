const jo = require('joi');
var students = require('../models/student');

const { body,validationResult } = require("express-validator");

function studentValidation(student){
    
    const schema = jo.object({
        name: jo.string().pattern(new RegExp("^[a-zA-Z'-]+$")).required(),
        code: jo.string().pattern(new RegExp('^[0-9a-zA-Z]{7}$')).required()
    });
    return schema.validate(student);
}

function studentVUpdate(student){
    
    const schema = jo.object({
        name: jo.string().pattern(new RegExp("^[a-zA-Z'-]+$")),
        code: jo.string().pattern(new RegExp('^[0-9a-zA-Z]{7}$'))
    });
    return schema.validate(student);
}

const createSForm = (req, res, next)=> {
    res.render('student_form', { title: 'Create student' });
};

const printStudents = (req, res, next)=> {
    students.find()
    .exec(function (err, list_students) {
        if (err) { return next(err); }
        // Successful, so render.
        res.send(list_students);
    })
};

const createNewStudent = [

    // Validate and sanitize fields.
    body('name').trim().isLength({ min: 1 }).escape().withMessage('Name must be given.'),
    body('code').trim().isLength({ min: 7 }).escape(),
    
(req, res, next)=> {
    const {name, code} = req.body;

    const {error} = studentValidation(req.body);
    const errors = validationResult(req);

    var student = new students ({
        name,
        code
    });

    if (error) {
        // There are errors. Render form again with sanitized values/errors messages.
        res.render('student_form', { title: 'Create student', student: student, errors: error.details[0].message });
        return;
    }
    else{
    student.save(function (err) {
        if (err) { return next(err); }
        res.send(student);
    });
}
}
];

const showStudent = (req,res)=> {
    students.findById(req.params.id, function (err, student) {
        if (err) { res.status(404).send('This student not found'); }
        if (student == null) { 
            var err = new Error('This student not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.send(student)});
};


const updatestudent = (req, res, next)=> {
    const {name, code} = req.body;
    const {error} = studentVUpdate(req.body);
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }
    students.findById(req.params.id, function (err, student) {
        if (err) { 
            res.status(404).send('This student not found');
         }
         if(name) student.name = name;
         if(code) student.code = code;
         
         student.save(function (err) {
            if (err) { return next(err); }
            // Successful - redirect to new author record.
            res.send(student);
        });
        
        });
         
};

const deleteStudent = (req,res)=> {
   
    students.findByIdAndRemove(req.params.id, function deleteStudent(err) {
        if (err) {res.status(404).send('This student not found'); }
       
        res.send('Deleted');
    })

};

module.exports = {
    createNewStudent,
    showStudent,
    updatestudent,
    deleteStudent,
    printStudents,
    createSForm
    };