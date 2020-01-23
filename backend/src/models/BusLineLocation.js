const mongoose = require('mongoose');
const PointSchema = require('./Utils/PointSchema');


const BusLineLocationSchema = new mongoose.Schema({
    user_id:{ type: String, index: true },   
    datetime: { type: Date, index: true }, 
    busline_code:String,
    busline_name:String,

    location: {
        type: PointSchema,
        index: '2dsphere',
    },
    
});

BusLineLocationSchema.index()

module.exports = mongoose.model('BusLineLocation',BusLineLocationSchema);