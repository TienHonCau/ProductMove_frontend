const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
    {
        idFrom: {
            type: String,
            require: true,
        },
        roleFrom: {
            type: String,
            require: true,
        },
        idTo: {
            type: String,
            require: true,
        },
        roleTo: {
            type: String,
            require: true,
        },
        code: {
            type: String,
            require: true,
        },
        quantity: {
            type: Number,
            require: true,
        },
        status: {
            type: String,
            default:"Đang vận chuyển",
        },
        

    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Deliveries", deliverySchema);
