const mongoose = require("mongoose");

const orderGuaranteeSchema = new mongoose.Schema(
    {
        idAgency: {
            type: String,
            require: true,
        },
        idGuarantee: {
            type: String,
            require: true,
        },
        idCustomer: {
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
        description: {
            type: String,
            require: true,
        }

    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order-Guarantees", orderGuaranteeSchema);
