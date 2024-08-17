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

        // Validate required fields
        if (taxApplicability && (tax === null || taxType === null)) {
            return res.status(400).json(createError("Tax and taxType must be provided when taxApplicability is true."));
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


const getAllSubCategory= async(req, res) =>{
    try{
     const categories = await SubCategory.find({});
     return res.status(200).json(createSuccess(categories));
    }catch(error){
     console.error("Error getting Sub-categories",error);
     res.status(500).json(createError("Failed to getting Sub-categories"));
    }
 }
const getSubCategoriesByParentCategory = async(req, res) =>{
    try{
        const search = {};
        const { name = null, id = null } = req.query;
        if (!name && !id) {
            return res.status(400).json(createError("One of ID or Name is required"));
        }

        if (name) search["name"] = name;
        if (id) search["_id"] = id;
        console.log(search)
        const category = await Category.findOne(search);

        if (!category) {
            return res.status(404).json(createError("Category not found!"));
        }

        const subCategories = await SubCategory.find({
            parentCategory : String(category._id),
        })
        if(!subCategories){
            res.status(200).json(createSuccess("No Sub Category Found"));
        }
        res.status(200).json(createSuccess(subCategories));
    }catch(error){
        console.error("Error getting Sub-categories",error);
        res.status(500).json(createError("Failed to getting Sub-categories"));
    }
}

const getSubCategory = async (req, res)=>{
    try{
        const search = {};

        const { name = null, id = null } = req.query;
       
        if (!name && !id) {
            return res.status(400).json(createError("One of ID or Name is required"));
        }

        if (name) search["name"] = name;
        if (id) search["_id"] = id;

        const category = await SubCategory.findOne(search);

        if (!category) {
            return res.status(404).json(createError("Sub-Category not found!"));
        }

        res.status(200).json(createSuccess(category));
    }catch(error){
        console.error("Error getting Sub-category",error);
        res.status(500).json(createError("Failed to get Sub-category"));
    }
}

module.exports = {
    createSubCategory, getAllSubCategory, getSubCategory,getSubCategoriesByParentCategory
};
