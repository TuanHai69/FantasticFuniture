const express = require('express');
const cors = require("cors");

const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb'}));
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Tăng giới hạn kích thước payload cho URL-encoded

// Import the DocGia router
const docgiaRouter = require("./app/routes/docgia.route");

// Use the DocGia router
app.use("/api/docgia", docgiaRouter);

// Import the Accounts router
const accountsRouter = require("./app/routes/accounts.route");

// Use the Accounts router
app.use("/api/accounts", accountsRouter);

// Import the Store router
const storeRouter = require("./app/routes/store.route");

// Use the Store router
app.use("/api/store", storeRouter);

// Import the Branch router
const branchRouter = require("./app/routes/branch.route");

// Use the Branch router
app.use("/api/branch", branchRouter);

// Import the Type router
const typeRouter = require("./app/routes/type.route");

// Use the Type router
app.use("/api/type", typeRouter);

// Import the Product router
const productRouter = require("./app/routes/product.route");

// Use the Product router
app.use("/api/product", productRouter);

// Import the ProductType router
const producttypeRouter = require("./app/routes/producttype.route");

// Use the ProductType router
app.use("/api/producttype", producttypeRouter);

// Import the Cart router
const cartRouter = require("./app/routes/cart.route");

// Use the Cart router
app.use("/api/cart", cartRouter);

// Import the Order router
const orderRouter = require("./app/routes/order.route");

// Use the Order router
app.use("/api/order", orderRouter);

// Import the Orderdetail router
const orderdetailRouter = require("./app/routes/orderdetail.route");

// Use the Orderdetail router
app.use("/api/orderdetail", orderdetailRouter);

// Import the Comment router
const commentRouter = require("./app/routes/comment.route");

// Use the Comment router
app.use("/api/comment", commentRouter);

// Import the Coded router
const codedRouter = require("./app/routes/coded.route");

// Use the Coded router
app.use("/api/coded", codedRouter);

// Import the Codeuse router
const codeuseRouter = require("./app/routes/codeuse.route");

// Use the Codeuse router
app.use("/api/codeuse", codeuseRouter);

// Import the Commentstore router
const commentstoreRouter = require("./app/routes/commentstore.route");

// Use the Commentstore router
app.use("/api/commentstore", commentstoreRouter);

// handle 404 response
app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});

// define error-handling middleware last, after other app.use() and routes calls
app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

app.get("/", (req, res) => {
    res.json({ message: "Welcome to ff" });
});

module.exports = app;
