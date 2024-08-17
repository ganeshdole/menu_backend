const Category = require('../models/Category');
const createError  = require('../utils/errorHandling'); // Utility for handling errors
const createSuccess = require('../utils/successHandling'); // Utility for handling success responses

// Function to create a new category
const createCategory = async (req, res) => {
    try {
        // Extracting data from request body
        const { name, image, description, taxApplicability, tax = null, taxType = null } = req.body;
        console.log(req.body);

        // Validate required fields
        if (!name || !image || !description || typeof taxApplicability !== 'boolean') {
            return res.status(400).json(createError("All required fields must be provided"));
        }

        // Create new category object
        const newCategory = new Category({
            name,
            image,
            description,
            taxApplicability,
            tax: taxApplicability ? tax : null,
            taxType: taxApplicability ? taxType : null,
        });

        // Save category to the database
        const savedCategory = await newCategory.save();

        // Respond with the created category
        return res.status(200).json(createSuccess(savedCategory));     
    } catch (error) {
        // Handle any errors that occur
        console.error("Error creating category:", error);
        return res.status(500).json(createError("Failed to create category"));
    }
};

// Function to retrieve all categories
const getAllCategory = async (req, res) => {
   try {
        const categories = await Category.find({});
        return res.status(200).json(createSuccess(categories));
   } catch (error) {
        console.error("Error getting category", error);
        return res.status(500).json(createError("Failed to retrieve categories"));
   }
};

// Function to retrieve a specific category by name or ID
const getCategory = async (req, res) => {
    try {
        const search = {};
        const { name = null, id = null } = req.query;
        if (!name && !id) {
            return res.status(400).json(createError("One of ID or Name is required"));
        }

        if (name) search["name"] = name;
        if (id) search["_id"] = id;

        const category = await Category.findOne(search);

        if (!category) {
            return res.status(404).json(createError("Category not found!"));
        }

        return res.status(200).json(createSuccess(category));
    } catch (error) {
        console.error("Error getting category", error);
        return res.status(500).json(createError("Failed to get category"));
    }
};

// Function to update an existing category by ID
const updateCategory = async (req, res) => {
    try {    
        const _id = req.params.id;
        const body = req.body;

        // Check if category exists
        let category = await Category.findById(_id);
        if (!category) {
            return res.status(404).json(createError("Category not found!"));
        }

        // Update the category
        category = await Category.findByIdAndUpdate(_id, body, { new: true });

        return res.status(200).json(createSuccess({ message: "Category update successful", category }));
    } catch (error) {
        console.error("Error updating category", error);
        return res.status(500).json(createError("Failed to update category"));
    }
}

module.exports = { createCategory, getAllCategory, getCategory, updateCategory };
