const {Router} = require('express')
const coursesModel = require('../models/course')
const Course = require('../models/course')
const router = Router()
const auth = require('../middleware/auth')


function isOwner(course,req){
    return course.userId.toString() == req.user._id.toString()
}



//Получение всех курсов GET
router.get('/',async (req,res)=>{
    try{
    const courses = await coursesModel.find().lean()

    console.log(await coursesModel.find().populate('userId','email name'))

    res.render('courses',{
        title: 'Курсы',
        isCourses: true,
        userId: req.user ? req.user.id.toString() : null,
        courses
    })
    }
    catch(r){
        console.log(r)
    }
})


//Получение курса на редактирование GET
router.get('/:id/edit', auth,async(req,res) =>{
    try
    {
        if (!req.query.allow){
        return res.redirect('/courses')
        }

        const course = await Course.findById(req.params.id).lean()
        if (!isOwner(course,req)){
            return res.redirect('/courses')
        }
        //console.log(course)
        res.render('editCourses',{title: `Редактировать ${course.title}`,course})
    }
    catch(e){
        console.log(e)
    }
})


//Редактирование курса POST
router.post('/edit', auth,async (req, res) => {
    try{
    const {id} = req.body
    delete req.body.id

    const course = await Course.findById(id)
    if (!isOwner(course,req)){
        return res.redirect('/courses')
    }

    Object.assign(course,req.body)
    await course.save()
    res.redirect('/courses')
    }
    catch(e){
        console.log(e)
    }
  })


//Удаление курса POST  
router.post('/remove',auth,async(req,res)=>{
    try{
        await Course.deleteOne({_id: req.body.id,userId: req.user._id})
        res.redirect('/courses')
    }
    catch(e)
    {
        console.log(e)
    }
})


//Отображение курса GET
router.get('/:id', async (req,res) => {
    try{
    const course = await Course.findById(req.params.id).lean()
    res.render('course',{
        layout: 'empty',
        title: `Курс ${course.title}`,
        course
    })
    }
    catch(e){
        console.log(e)
    }
})

module.exports = router