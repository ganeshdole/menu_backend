const Item = require("../models/Item");
const createError = require("../utils/errorHandling");
const createSuccess = require("../utils/successHandling");

// Function to search for an item by name
const Search = async (req, res) => {
    try {
        const { name } = req.query;

        // Check if name query parameter is provided
        if (!name) {
            return res.status(404).json(createError("Item Name Required"));
        }

        // Search for the item by name
        const item = await Item.findOne({ name });

        // If item not found, return a success message with no results
        if (!item) {
            return res.status(200).json(createSuccess("Item does not exist!"));
        }

        // Return the found item
        return res.status(200).json(createSuccess({
            message: "Search Result",
            item
        }));
    } catch (error) {
        console.log("Error in Search");
        return res.status(500).json(createError("Failed to Search, Try again"));
    }
};

module.exports = Search;
