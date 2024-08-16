const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const createError = require('../utils/errorHandling');
const createSuccess = require('../utils/successHandling');

const createSubCategory = async (req, res) => {
    try {
        const { name, image, description, taxApplicability, tax = null, taxType = null, parentCategory } = req.body;

        // Validate required fields
        if (!name || !image || !description || typeof taxApplicability !== "boolean") {
            return res.status(400).json(createError("All required fields must be provided and taxApplicability must be a boolean."));
        }

        // Check if the parent category exists
        const category = await Category.findById(parentCategory);
        if (!category) {
            return res.status(404).json(createError("Parent category not found."));
        }

        // Create new sub-category object
        const newSubCategory = new SubCategory({
            name,
            image,
            description,
            taxApplicability,
            tax: taxApplicability ? tax : null,
            taxType: taxApplicability ? taxType : null,
            parentCategory
        });

        // Save the sub-category
        const savedSubCategory = await newSubCategory.save();

        // Update the parent category to include the new sub-category
        category.subCategories.push(savedSubCategory._id);
        await category.save();

        return res.status(200).json(createSuccess(savedSubCategory));
    } catch (error) {
        console.error("Error creating sub-category:", error);
        res.status(500).json(createError("Failed to create sub-category"));
    }
};

module.exports = {
    createSubCategory
};
