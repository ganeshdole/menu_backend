const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const Item = require('../models/Item');
const createError = require('../utils/errorHandling');
const createSuccess = require('../utils/successHandling');

const createItem = async (req, res) => {
    try {
        const {
            name, image, description, taxApplicability, tax = null,
            baseAmount, discount = 0, parentCategory, parentSubCategory = null
        } = req.body;

        // Validate required fields
        if (!name || !image || !description || !baseAmount || typeof taxApplicability !== 'boolean') {
            return res.status(400).json(createError("All required fields must be provided and taxApplicability must be a boolean."));
        }

        // Calculate total amount
        const totalAmount = baseAmount - discount;

        // Check if the parent category exists
        const category = await Category.findById(parentCategory);
        if (!category) {
            return res.status(404).json(createError("Parent category not found."));
        }

        // Check if the parent sub-category exists, if provided
        if (parentSubCategory) {
            const subCategory = await SubCategory.findById(parentSubCategory);
            if (!subCategory) {
                return res.status(404).json(createError("Parent sub-category not found."));
            }
        }

        // Create the item
        const newItem = new Item({
            name,
            image,
            description,
            taxApplicability,
            tax: taxApplicability ? tax : null,
            baseAmount,
            discount,
            totalAmount,
            parentCategory,
            parentSubCategory
        });

        // Save the item to the database
        const savedItem = await newItem.save();

        // Add the item to the corresponding category or sub-category
        if (parentSubCategory) {
            await SubCategory.findByIdAndUpdate(
                parentSubCategory,
                { $push: { items: savedItem._id } }
            );
        } else {
            await Category.findByIdAndUpdate(
                parentCategory,
                { $push: { items: savedItem._id } }
            );
        }

        return res.status(201).json(createSuccess(savedItem));
    } catch (error) {
        console.error("Error creating item:", error);
        res.status(500).json(createError("Failed to create item"));
    }
};

module.exports = {
    createItem
};
