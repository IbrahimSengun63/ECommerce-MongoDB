const { Decimal128 } = require('bson');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const ProductSchema = new Schema({
    productName:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    stock:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    category:{
        type:String,
        required:true,
        trim:true
    },
    shop:{
        type:String,
        required:true,
        trim:true
    },
    price:{
        type:Decimal128,
        required:true,
        trim:true
    },
    discount:{
        type:Decimal128,
        trim:true
    },
    netPrice:{
        type:Decimal128,
        required:true,
        trim:true
    },
    image:{
        type:String,
        default:"asdasd"
    }
}, { collection: 'products', timestamps: true });








module.exports = {ProductSchema};





