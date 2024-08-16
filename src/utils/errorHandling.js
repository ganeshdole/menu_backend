function createError(error){
    return {
        status : "error",
        error
    }
}
module.exports = createError;