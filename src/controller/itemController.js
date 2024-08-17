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

const getAllItem= async(req, res) =>{
    try{
     const categories = await Item.find({});
     return res.status(200).json(createSuccess(categories));
    }catch(error){
     console.error("Error  getting Item's",error);
     res.status(500).json(createError("Failed to All Item's"));
    }
 }

const getItemByParentCategory = async (req, res) =>{
    try{
        const search = {};
        const { name = null, id = null } = req.query;
        if (!name && !id) {
            return res.status(400).json(createError("One of ID or Name is required"));
        }

        if (name) search["name"] = name;
        if (id) search["_id"] = id;
        console.log(search)
        const category = await Category.findOne(search)

        if (!category) {
            return res.status(404).json(createError("Parent Category not found!"));
        }

        const Items = await Item.find({
            parentCategory : String(category._id)
        })

        if(!Items){
            return res.status(200).json(createSuccess("No Item Found"));
        }

        return res.status(200).json(createSuccess(Items));
    }catch(error){
        console.error("Error  getting Item's",error);
        res.status(500).json(createError("Failed to create Item's"));
    }
} 

const getItemByParentSubCategory = async(req, res) =>{
    try{
        const search = {};
        const { name = null, id = null } = req.query;
        if (!name && !id) {
            return res.status(400).json(createError("One of ID or Name is required"));
        }

        if (name) search["name"] = name;
        if (id) search["_id"] = id;
        const subCategory = await SubCategory.findOne(search)
        if (!subCategory) {
            return res.status(404).json(createError("Parent Category not found!"));
        }

        const Items = await Item.find({
            parentSubCategory : String(subCategory._id)
        })

        if(!Items){
            return res.status(200).json(createSuccess("No Item Found"));
        }

        return res.status(200).json(createSuccess(Items));
    }catch(error){
        console.error("Error  getting Item's",error);
        res.status(500).json(createError("Failed to Get Item's"));
    }
}

const getItem = async (req, res) =>{
    try{
        const search = {};

        const { name = null, id = null } = req.query;
        if (!name && !id) {
            return res.status(400).json(createError("One of ID or Name is required"));
        }

        if (name) search["name"] = name;
        if (id) search["_id"] = id;

        const item = await Item.findOne(search);

        if (!item) {
            return res.status(404).json(createError("Item not found!"));
        }

        res.status(200).json(createSuccess(item));
    }catch(error){
        console.error("Error  getting Item's",error);
        res.status(500).json(createError("Failed to Get Item's"));
    }
}
module.exports = {
    createItem,getAllItem,getItemByParentCategory, getItemByParentSubCategory,getItem
};
