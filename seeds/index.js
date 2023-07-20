const mongoose = require('mongoose')
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')
const campGround = require('../models/campground')
mongoose.set('strictQuery', true)
mongoose.connect('mongodb://127.0.0.1:27017/shivir')
.then(()=>{
    console.log('Database connected!')
})
.catch(err =>{
    console.log(err)
})
const sample = array=> array[Math.floor(Math.random()*array.length)]
const seedDB = async()=>{
    await campGround.deleteMany({})
    for(let i = 0;i<50;i++){
        const random100 = Math.floor(Math.random()*100)
        const randomprice = Math.floor(Math.random()*5000)+1
        const camp = new campGround({
            author:'64b3ca989d413e7da3d8a2c0',
            title:`${sample(places)} ${sample(descriptors)}`,
            location: `${cities[random100].city}, ${cities[random100].state}`,
            image:  [
                {
                  url: 'https://res.cloudinary.com/ddoual2rm/image/upload/v1689666396/hotels/rzfd3mpbvzso5nad3uz8.png',
                  filename: 'hotels/rzfd3mpbvzso5nad3uz8',
                },
                {
                  url: 'https://res.cloudinary.com/ddoual2rm/image/upload/v1689666396/hotels/usinr4srl5bvpqhpglsa.png',
                  filename: 'hotels/usinr4srl5bvpqhpglsa',
                }
              ],
            description: 'should be something good',
            price: randomprice,
            geometry:{
                type: "Point",
                coordinates: [
                    cities[random100].longitude,
                    cities[random100].latitude
                ]
            }
        })
        await camp.save()
    }
}
seedDB().then(()=>{
    mongoose.connection.close()
})