const {Router} = require('express')
const Order = require('../models/order')
const router = Router()
const auth = require('../middleware/auth')


router.get('/',auth,async(req,res)=>{
    try
    {
    const orders = await Order.find({'user.userId': req.user._id}).populate('user.userId')


 
    const newOrders = orders.map(o=>{
        return {
            ...o._doc,
            price: o.courses.reduce((total,c)=>{
                return total += c.count * c.course.price
            },0)
        }
    }) 


    res.render('orders',{
        isOrders: true,
        title: 'Заказы',
        userName: orders[0].user.userId.name,
        userEmail: orders[0].user.userId.email,
        orders: newOrders,
        allowProtoMethodsByDefault: true,
        allowProtoPropertiesByDefault: true,
        allowedProtoMethods: true,
        allowedProtoProperties: true
  

    })
    } catch (e){
        console.log(e)
    }
})

router.post('/',auth,async(req,res)=>{
    try{
        const user = await req.user.populate('cart.items.courseId').execPopulate()
        const courses = user.cart.items.map(i => ({
            count: i.count,
            course: {...i.courseId._doc}
        }))
        
        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            courses: courses
        })

        await order.save()
        await req.user.clearCart()

        res.redirect('/orders')
    } 
    catch(e)
    {
        console.log(e)
    }
        
    })

module.exports = router