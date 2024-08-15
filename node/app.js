const express = require('express');
const cors = require("cors");

const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());


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

// Import the NhanVien router
const nhanvienRouter = require("./app/routes/nhanvien.route");

// Use the NhanVien router
app.use("/api/nhanvien", nhanvienRouter);


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
