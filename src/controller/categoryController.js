const Category = require('../models/Category');
const createError  = require('../utils/errorHandling'); // Assuming you have an error handling utility
const createSuccess = require('../utils/successHandling');

const createCategory = async (req, res) => {
    try {
        //Grabing data 
        const { name, image, description, taxApplicability, tax = null, taxType = null } = req.body;
        console.log(req.body)
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
        res.status(200).json(createSuccess(savedCategory));     
    } catch (error) {
        // Handle any errors that occur
        console.error("Error creating category:", error);
        res.status(500).json(createError("Failed to create category"));
    }
};


const getAllCategory= async(req, res) =>{
   try{
    const categories = await Category.find({});
    return res.status(200).json(createSuccess(categories));
   }catch(error){
    console.error("Error  getting category",error);
    res.status(500).json(createError("Failed to create category"));
   }
}


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

        res.status(200).json(createSuccess(category));
    } catch (error) {
        console.error("Error getting category", error);
        return res.status(500).json(createError("Failed to get category"));
    }
};


module.exports = { createCategory, getAllCategory, getCategory };
