const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    taxApplicability: {
        type: Boolean,
        required: true
    },
    tax: {
        type: Number,
        required : function(){
            return this.taxApplicability;
        },
        default: null
    },
    taxType: {
        type: String,
        required : function(){
            return this.taxApplicability;
        },
        default: null,
        trim: true
    },
    subCategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory'
    }]
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
