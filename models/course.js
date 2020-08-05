const {Schema,model} = require('mongoose')

const course = new Schema({
     title: {
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    img: {
        type: String
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

course.method('toClient',function(){
    const course = this.toObject()

    course.id = course._id
    delete course._id
    return course
})

module.exports = model('Course',course)








/*

const {v4 : uuid} = require('uuid')
const fs = require('fs')
const path = require('path')

class Course{
    constructor(title,price,img){
        this.title = title
        this.price = price
        this.img = img
        this.id = uuid()
    }

    toJSON_MY(){
        return {
            title: this.title,
            price: this.price,
            img: this.img,
            id: this.id
        }
    }

    async save(){
        const courses = await Course.getAll() 
        courses.push(this.toJSON_MY())

        return new Promise((resolve,reject) => {
            fs.writeFile(
                path.join(__dirname,'..','data','courses.json'),
                JSON.stringify(courses),
                (err) => {
                    if (err){
                        reject(err)
                    }
                    else{
                        resolve()
                    }
                }
            )
        })
    }

    static getAll(){
        return new Promise((resolve,reject) => {
            fs.readFile(
                path.join(__dirname,'..','data','courses.json'),
                'utf-8',
                (err,content) => {
                if (err) 
                {
                    reject(err)
                }
                else
                {
                    resolve(JSON.parse(content))
                }
            }
            )
    
        })
    }

    static async getByID(id){
        const courses = await Course.getAll()
        return courses.find(c => c.id === id)
    }


    static async update(course){ 
        const courses = await Course.getAll()

        const index = courses.findIndex(c=> c.id === course.id)
        courses[index] = course

    
   
            return new Promise((resolve,reject) => {
                fs.writeFile(
                    path.join(__dirname,'..','data','courses.json'),
                    JSON.stringify(courses),
                    (err) => {
                        if (err){
                            reject(err)
                        }
                        else{
                            resolve()
                        }
                    }
                )
            })

    }

}

module.exports = Course*/