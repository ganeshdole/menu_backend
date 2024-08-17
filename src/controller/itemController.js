const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const Item = require('../models/Item');
const createError = require('../utils/errorHandling');
const createSuccess = require('../utils/successHandling');

// Create a new item under a specified category or sub-category
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
       return res.status(500).json(createError("Failed to create item"));
    }
};

// Retrieve all items from the database
const getAllItem = async (req, res) => {
    try {
        const items = await Item.find({});
        return res.status(200).json(createSuccess(items));
    } catch (error) {
        console.error("Error getting items:", error);
        return res.status(500).json(createError("Failed to retrieve items"));
    }
};

// Retrieve items by parent category
const getItemByParentCategory = async (req, res) => {
    try {
        const search = {};
        const { name = null, id = null } = req.query;

        // Validate required fields for search
        if (!name && !id) {
            return res.status(400).json(createError("One of ID or Name is required"));
        }

        if (name) search["name"] = name;
        if (id) search["_id"] = id;

        // Find the category by name or ID
        const category = await Category.findOne(search);
        if (!category) {
            return res.status(404).json(createError("Parent Category not found!"));
        }

        // Retrieve items belonging to the category
        const items = await Item.find({ parentCategory: String(category._id) });

        if (items.length === 0) {
            return res.status(200).json(createSuccess("No items found"));
        }

        return res.status(200).json(createSuccess(items));
    } catch (error) {
        console.error("Error getting items by parent category:", error);
        return res.status(500).json(createError("Failed to retrieve items"));
    }
};

// Retrieve items by parent sub-category
const getItemByParentSubCategory = async (req, res) => {
    try {
        const search = {};
        const { name = null, id = null } = req.query;

        // Validate required fields for search
        if (!name && !id) {
            return res.status(400).json(createError("One of ID or Name is required"));
        }

        if (name) search["name"] = name;
        if (id) search["_id"] = id;

        // Find the sub-category by name or ID
        const subCategory = await SubCategory.findOne(search);
        if (!subCategory) {
            return res.status(404).json(createError("Parent Sub-Category not found!"));
        }

        // Retrieve items belonging to the sub-category
        const items = await Item.find({ parentSubCategory: String(subCategory._id) });

        if (items.length === 0) {
            return res.status(200).json(createSuccess("No items found"));
        }

        return res.status(200).json(createSuccess(items));
    } catch (error) {
        console.error("Error getting items by parent sub-category:", error);
        return res.status(500).json(createError("Failed to retrieve items"));
    }
};

// Retrieve an item by its ID or name
const getItem = async (req, res) => {
    try {
        const search = {};
        const { name = null, id = null } = req.query;

        // Validate required fields for search
        if (!name && !id) {
            return res.status(400).json(createError("One of ID or Name is required"));
        }

        if (name) search["name"] = name;
        if (id) search["_id"] = id;

        // Find the item by name or ID
        const item = await Item.findOne(search);
        if (!item) {
            return res.status(404).json(createError("Item not found!"));
        }

        return res.status(200).json(createSuccess(item));
    } catch (error) {
        console.error("Error getting item:", error);
        return res.status(500).json(createError("Failed to retrieve item"));
    }
};

// Update an existing item by its ID
const updateItem = async (req, res) => {
    try {
        const _id = req.params.id;
        const body = req.body;

        // Check if item exists
        let item = await Item.findById(_id);
        if (!item) {
            return res.status(404).json(createError("Item not found!"));
        }

        // Update the item
        item = await Item.findByIdAndUpdate(_id, body, { new: true });

        return res.status(200).json(createSuccess({ item, message: "Item update successful" }));
    } catch (error) {
        console.error("Error updating item:", error);
        return res.status(500).json(createError("Failed to update item"));
    }
};

module.exports = {
    createItem,
    getAllItem,
    getItemByParentCategory,
    getItemByParentSubCategory,
    getItem,
    updateItem
};
