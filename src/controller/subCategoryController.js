const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const createError = require('../utils/errorHandling');
const createSuccess = require('../utils/successHandling');

// Function to create a new sub-category under a specified category
const createSubCategory = async (req, res) => {
    try {
        const { name, image, description, taxApplicability, tax = null, taxType = null, parentCategory } = req.body;


        if (!name || !image || !description || typeof taxApplicability !== "boolean") {
            return res.status(400).json(createError("All required fields must be provided and taxApplicability must be a boolean."));
        }


        if (taxApplicability && (tax === null || taxType === null)) {
            return res.status(400).json(createError("Tax and taxType must be provided when taxApplicability is true."));
        }
        

        const category = await Category.findById(parentCategory);
        if (!category) {
            return res.status(404).json(createError("Parent category not found."));
        }


        const newSubCategory = new SubCategory({
            name,
            image,
            description,
            taxApplicability,
            tax: taxApplicability ? tax : null,
            taxType: taxApplicability ? taxType : null,
            parentCategory
        });


        const savedSubCategory = await newSubCategory.save();


        category.subCategories.push(savedSubCategory._id);
        await category.save();


        return res.status(200).json(createSuccess(savedSubCategory));
    } catch (error) {
        console.error("Error creating sub-category:", error);
        return res.status(500).json(createError("Failed to create sub-category"));
    }
};

// Function to retrieve all sub-categories
const getAllSubCategory = async (req, res) => {
    try {
        const categories = await SubCategory.find({});
        return res.status(200).json(createSuccess(categories));
    } catch (error) {
        console.error("Error getting Sub-categories:", error);
        return res.status(500).json(createError("Failed to get Sub-categories"));
    }
};

// Function to retrieve sub-categories by their parent category
const getSubCategoriesByParentCategory = async (req, res) => {
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

        const subCategories = await SubCategory.find({
            parentCategory: String(category._id),
        });

        if (!subCategories || subCategories.length === 0) {
            return res.status(200).json(createSuccess("No Sub Category Found"));
        }

        return res.status(200).json(createSuccess(subCategories));
    } catch (error) {
        console.error("Error getting Sub-categories:", error);
        return res.status(500).json(createError("Failed to get Sub-categories"));
    }
};

// Function to retrieve a sub-category by its ID or name
const getSubCategory = async (req, res) => {
    try {
        const search = {};
        const { name = null, id = null } = req.query;

        if (!name && !id) {
            return res.status(400).json(createError("One of ID or Name is required"));
        }

        if (name) search["name"] = name;
        if (id) search["_id"] = id;

        const subCategory = await SubCategory.findOne(search);

        if (!subCategory) {
            return res.status(404).json(createError("Sub-Category not found!"));
        }

        return res.status(200).json(createSuccess(subCategory));
    } catch (error) {
        console.error("Error getting Sub-category:", error);
        return res.status(500).json(createError("Failed to get Sub-category"));
    }
};

// Function to update an existing sub-category by its ID
const updateSubCategory = async (req, res) => {
    try {    
        const _id = req.params.id;
        const body = req.body;

        let subCategory = await SubCategory.findById(_id);
        if (!subCategory) {
            return res.status(404).json(createError("Sub-category not found!"));
        }

        subCategory = await SubCategory.findByIdAndUpdate(_id, body, { new: true });

        return res.status(200).json(createSuccess({ message: "Sub-category update successful", subCategory }));
    } catch (error) {
        console.error("Error updating Sub-category:", error);
        return res.status(500).json(createError("Failed to update Sub-category"));
    }
};

module.exports = {
    createSubCategory, 
    getAllSubCategory, 
    getSubCategory, 
    getSubCategoriesByParentCategory, 
    updateSubCategory
};
