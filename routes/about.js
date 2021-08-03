const {Router} = require('express')
const router = Router()
const nodemailer = require("nodemailer")

/* const sendmail = require('sendmail')()
 */

router.get('/',async (req,res)=>{
    res.render('about',{
        title: 'О нас',
        isAbout: true
    })
})

module.exports = router