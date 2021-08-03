const express = require('express')
const path = require('path')
const expreshbs = require('express-handlebars')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const homeRouter = require('./routes/home')
const addCoursesRouter = require('./routes/addCourses')
const coursesRouter = require('./routes/courses')
const cardRouter = require('./routes/card')
const aboutRouter = require('./routes/about')
const ordersRouter = require('./routes/orders')
const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const csurf = require('csurf')
const flash = require('connect-flash')
const config = require('./config/key')
const errorHandler = require('./middleware/errors')
const fileMiddleware = require('./middleware/file')
const helmet = require('helmet')
const compression = require('compression')

const app = express()

const hbs = expreshbs.create({
    defaultLayout : 'main',
    extname: 'hbs',
    helpers: require('./helpers/hbs-helpers')
})

const store = new MongoStore({
  collection: 'sessions',
  uri: config.MONGO_URL,
})

app.engine('hbs',hbs.engine)
app.set('view engine','hbs')
app.set('views','views')
app.use(express.static(path.join(__dirname,'public')))
app.use('/images', express.static(path.join(__dirname,'images')))
app.use(express.urlencoded({extended: true}))

app.use(session({
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store
}))

app.use(fileMiddleware.single('avatar'))
app.use(helmet({
  contentSecurityPolicy: false,
}))
app.use(compression())
app.use(csurf())
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/',homeRouter)
app.use('/addCourse',addCoursesRouter) 
app.use('/courses',coursesRouter) 
app.use('/about',aboutRouter) 
app.use('/card',cardRouter) 
app.use('/orders',ordersRouter) 
app.use('/auth',authRouter) 

app.use('/profile',profileRouter)

app.use(errorHandler)


const PORT = process.env.PORT || 3000
//const PASS = "GfiSZztHUS0YsNmT"

async function start(){
  try
  {
 
    await mongoose.connect(config.MONGO_URL,{useUnifiedTopology: true,useNewUrlParser:true,useFindAndModify: false})

    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`)
    })  
  } catch(e)
  {
      console.log(e)
  }
}

start()