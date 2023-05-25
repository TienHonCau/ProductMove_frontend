const mongoose = require("mongoose");

const productCustomerSchema = new mongoose.Schema(
    {
        idAgency: {
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
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Product-Customers", productCustomerSchema);
