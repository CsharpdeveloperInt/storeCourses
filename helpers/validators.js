const {body} = require('express-validator/check')
const User = require('../models/user')


exports.registerValidator = [
    body('email').isEmail().withMessage('Введите корректный Email').custom(async(value,{req})=>{
        try{
            const cUser = await User.findOne({email : value})

            if(cUser){
                return Promise.reject('Такой email уже существует')
            }
        }
        catch(e){
            console.log(e)
        }
    }).normalizeEmail(),
    body('name').isLength({min: 3}).withMessage('Имя должно быть минимум 3 символа').trim(),
    body('password','Пароль должен быть минимум 6 символов').isLength({min: 6,max: 56}).isAlphanumeric().trim(),
    body('confirm').custom((value,{req})=>{
        if(value !== req.body.password){
            throw new Error('Пароли должны совпадать')
        }
        return true
    }).trim()
   
]

exports.courseValidator = [
    body('title').isLength({min: 3}).withMessage('Имя должно быть минимум 3 символа').trim(),
    body('price').isNumeric().withMessage('Введите корректную цену').trim(),
    body('img','Введите корректный URL картинки').isURL() 
]