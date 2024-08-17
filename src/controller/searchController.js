const Item = require("../models/Item");
const createError = require("../utils/errorHandling");
const createSuccess = require("../utils/successHandling");

// Function to search for an item by name
const Search = async (req, res) => {
    try {
        const { name } = req.query;

        // Check if the name query parameter is provided
        if (!name) {
            return res.status(404).json(createError("Item Name Required"));
        }

        // Search for the item by its name in the database
        const item = await Item.findOne({ name });

        // If the item is not found, return a success message indicating no results
        if (!item) {
            return res.status(200).json(createSuccess("Item does not exist!"));
        }

        // If the item is found, return it in the response
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
