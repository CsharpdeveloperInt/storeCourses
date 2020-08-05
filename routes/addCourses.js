const {Router} = require('express')
const router = Router()
const {validationResult} = require('express-validator/check')
const auth = require('../middleware/auth')
const  {courseValidator} = require('../helpers/validators')
const CourseModel = require('../models/course')

router.get('/',auth,(req,res)=>{
    res.render('addCourses',{
        title: 'Добавить курс',
        isAddCourse: true
    })
})

router.post('/',auth, courseValidator, async (req,res) =>{

    const errorsValidCourse = validationResult(req)

    if (!errorsValidCourse.isEmpty()){
        return res.status(422).render('addCourses',{
            title: 'Добавить курс',
            isAdd: true,
            errorsValidCourse: errorsValidCourse.array()[0].msg,
            data: {
                title: req.body.title,
                price: req.body.price,
                img: req.body.img
            }
        })
    }


    const course = new CourseModel({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        userId: req.user
    })
    try{
        await course.save()
        res.redirect('/courses')
    }
    catch(e){
        console.log(e)
    }
   
})

module.exports = router