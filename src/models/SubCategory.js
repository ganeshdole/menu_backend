const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
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
        default: false // Default to false if not specified
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
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    }]
});

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = SubCategory;
