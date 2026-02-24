const mongoose = require('mongoose');
// Schema for listing ....
const userSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: {
        url: String,
        filename: String
    },
    price: Number,
    location: String,
    country: String,
    category: {
        type: String,
        enum: ["Trending", "Rooms", "Iconic Cities", "Mountains", "Castles", "Beaches", "Camping", "Farms", "Arctic"]
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "review"
        }
    ],
    owner:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }

});
const lstDatas = mongoose.model("lstData", userSchema);//
module.exports = lstDatas;