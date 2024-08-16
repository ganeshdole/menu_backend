const SubCategory = require('../models/SubCategory'); // Corrected to capitalize the model name
const createError = require('../utils/errorHandling');
const createSuccess = require('../utils/successHandling');

const createSubCategory = async (req, res) => {
    try {
        //Grabing data 
        const { name, image, description, taxApplicability, tax = null, taxType = null, parentCategory } = req.body;

        // Validate required fields
        if (!name || !image || !description || typeof taxApplicability !== "boolean") {
            return res.status(400).json(createError("All required fields must be provided and taxApplicability must be a boolean."));
        }

        // Create new Sub category object
        const newSubCategory = new SubCategory({
            name,
            image,
            description,
            taxApplicability,
            tax: taxApplicability ? tax : null,
            taxType: taxApplicability ? taxType : null,
            parentCategory
        });
        
        //Saving sub category to database
        const savedSubCategory = await newSubCategory.save();
        return res.status(200).json(createSuccess(savedSubCategory));
    } catch (error) {
        console.error("Error creating sub-category:", error);
        res.status(500).json(createError("Failed to create sub-category"));
    }
};

module.exports = {
    createSubCategory
};
