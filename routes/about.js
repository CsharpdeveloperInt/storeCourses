const {Router} = require('express')
const router = Router()
const nodemailer = require("nodemailer")

/* const sendmail = require('sendmail')()
 */

router.get('/',async (req,res)=>{

    let testAccount = await nodemailer.createTestAccount();

/*     let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
        user: 'besia.int@gmail.com', // generated ethereal user
        //pass: '****', // generated ethereal password
        },
    }); */


    const transporter = nodemailer.createTransport({
        //host: 'mail.veter-it.com',
        host: 'smtp.yandex.ru',
        port: 465, 
        secure: true,
        auth: {
            user: 'o.popykin@veter-it.com',
            pass: 'cjnNX66x'
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Oleg Popykin 👻" <o.popykin@veter-it.com>', // sender address
        to: "csharpdeveloper@list.ru,alexandr@veter-it.com,besia.int@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);

    
    /* sendmail({
        from: 'test@yourdomain.com',
        to: 'csharpdeveloper@list.ru',
        replyTo: 'alexandr@veter-it.com',
        subject: 'MailComposer sendmail',
        html: 'Mail of test sendmail'
      }, function (err, reply) {
        console.log(err && err.stack)
        console.dir(reply)
      }) */

    res.render('about',{
        title: 'О нас',
        isAbout: true
    })
})

module.exports = router