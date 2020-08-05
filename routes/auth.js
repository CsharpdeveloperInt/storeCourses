const {Router} = require('express')
const router = Router()
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const User = require('../models/user')
const e = require('express')
const {validationResult} = require('express-validator/check')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const config = require('../config/key')
const registerEmail = require('../template/registration_email')
const resetEmail = require('../template/reset_email')
const {registerValidator} = require('../helpers/validators')


const transporter = nodemailer.createTransport(sendgrid({
    auth: {api_key: config.EMAIL_KEY}
}))

router.get('/login',async (req,res)=>{
    res.render('auth/login',{
        title: 'Авторизация',
        isLogin: true,
        LoginError: req.flash('LoginError'),
        RegisterError: req.flash('RegisterError')
    })
})


router.post('/login', async(req,res)=>{

    try{
        const {email,password} = req.body
        const condidate = await User.findOne({email}) 

        if(condidate){

            const Same = await bcrypt.compare(password,condidate.password)
            if(Same){
                
                req.session.user = condidate
                req.session.isAuthenticated = true
            
                req.session.save((err)=>{
                    if(err){
                        throw err
                    }
                    res.redirect('/')
                })
            }
            else{
                req.flash('LoginError','Пароли не совпадают')
                res.redirect('/auth/login')
            }

            
        }
        else
        {
            req.flash('LoginError','Пользователь с таким email не существует')
            res.redirect('/auth/login')
        }
    }
    catch(r){
        console.log(r)
    }


    
})

router.get('/logout',async(req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/auth/login')
    })
})


router.post('/register',registerValidator,   async(req,res)=>{
    try{
        const {email,password,confirm,name} = req.body

        const validErrors = validationResult(req)
        if(!validErrors.isEmpty()){
            req.flash('RegisterError',validErrors.array()[0].msg)
            return res.status(422).redirect('/auth/login#register')
        }


            passHash = await bcrypt.hash(password,10)
            const user = new User({
              
                email,name,password: passHash,cart: {items: []}
            })
            await user.save()
            res.redirect('/auth/login')
            await transporter.sendMail(registerEmail(email))
    }
    catch(r)
    {
        console.log(r)
    }
})


router.post('/reset',(req,res)=>{
    try{
        crypto.randomBytes(32,async (err,buffer)=>{
            if (err){
                req.flash('errorReset','Что-то пошло не так, повторите попытку позже')
                return res.redirect('/auth/reset')
            }
           
            const token = buffer.toString('hex')
            const candidate = await User.findOne({email: req.body.email})

            if(candidate){
                candidate.resetToken = token
                candidate.resetTokenExp = Date.now() + 60 * 60 * 1000
                await candidate.save()
                await transporter.sendMail(resetEmail(candidate.email,token))
                res.redirect('/auth/login')
            }
            else
            {
                req.flash('errorReset','Такого email нет')
                req.redirect('/auth/reset')
            }
        })
    }
    catch(e){
        console.log(e)
    }
})


router.get('/password/:token',async(req,res)=>{
    if (!req.params.token){
        return res.redirect('/auth/login')
    }

    try{
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExp: {$gt: Date.now()}
        })

        if(!user){
            return res.redirect('auth/login')
        }
        else{
            res.render('auth/password',{
                title: 'Восстановить пароль',
                error: req.flash('errorPassword'),
                userId: user._id.toString(),
                token: req.params.token
            })
        }
    }
    catch(e){
        console.log(e)
    }
})

router.get('/reset',(req,res)=>{
    res.render('auth/reset',{
        title: 'Забыли пароль?',
        errorReset: req.flash('errorReset')
    })
})

router.post('/password',async(req,res)=>{
    try
    {
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: {$gt: Date.now()}
        })

        if(user){
            user.password = await bcrypt.hash(req.body.password,10)
            user.resetToken = undefined
            user.resetTokenExp = undefined
            await user.save()
            res.redirect('/auth/login')
        }
        else{
            req.flash('loginError','Время жизни токена истекло')
            req.redirect('/auth/login')
        }
    }
    catch(r)
    {
        console.log(r)
    }
})




module.exports = router