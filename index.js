const express = require('express');
const Joi = require('joi');
const app = express();
app.use(express.json());

const courses = [
    {id:1, name: 'course1'},
    {id:2, name: 'course2'},
    {id:3, name: 'course3'}
];

app.get('/',(req,res) => {
    res.send('yeyeyeyyeyyeyeye');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req,res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course){ // 404
        res.status(404).send('The course with the given id is not found');
    }else {
        res.send(course);
    }
});

app.get('/api/posts/:year/:month',(req, res) => {
    res.send(req.query);
})

app.post('api/courses', (req,res) => {
    const {error} = validateCourse(req.body); // This is equal to result.error
    if (error){
        // 400 bad request
        res.status(400).send(error.details[0].message);
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id',(req,res) => {
    //Look up the course
    const course = courses.find(c => c.id === parseInt(req.params.id));
    // if not existing, return 404
    if (!course) {
        res.status(404).send('The course with the given id is not found');
    }

    const {error} = validateCourse(req.body); // This is equal to result.error

    if (error){
        // 400 bad request
        res.status(400).send(error.details.message);
        return;
    }
    // update course
    course.name = req.body.name;
    // return the updated course
    res.send(course);
})

// PORT
const PORT = process.env.PORT || 3000;// we use PORT as port. Otherwise we use 3000.
app.listen(PORT,() => {
    console.log(`listening on port ${PORT} ...`);
});

function validateCourse(course){
    // validate
    // if invalid, return 400, bad request
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.valid(course,schema);
}