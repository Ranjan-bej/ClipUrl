import mongoose from "mongoose"

const urlSchema = new mongoose.Schema({
    originalUrl: String,
    shortCode:String
})

const urlModel = mongoose.model('URL',urlSchema);
export default urlModel;