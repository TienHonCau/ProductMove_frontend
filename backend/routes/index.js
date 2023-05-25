const adminRouter = require("./adminRouter");
const factoryRouter = require("./factoryRouter");
const agencyRouter = require("./agencyRouter");
const guaranteeRouter = require("./guaranteeRouter");
const productRouter = require("./productRouter");
const deliveryRouter = require("./deliveryRouter");
const userRouter = require("./userRouter");

function route(app) {
    app.use("/admin", adminRouter);
    app.use("/factory", factoryRouter);
    app.use("/agency", agencyRouter);
    app.use("/guarantee", guaranteeRouter);
    app.use("/product", productRouter);
    app.use("/delivery", deliveryRouter);
    app.use("/user", userRouter);
}

module.exports = route;
