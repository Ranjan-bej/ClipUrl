import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
const ConnectDB = () => {
    const url = process.env.DBURL;
    mongoose.connect(url).then(() => {
        console.log("Database connected...");

    }).catch(err => {
        console.error(err);
    })

}
export default ConnectDB;