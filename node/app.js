const express = require('express');
const cors = require("cors");

const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());

// Import the NhaXuatBan router
const nhaxuatbanRouter = require("./app/routes/nhaxuatban.route");

// Use the NhaXuatBan router
app.use("/api/nhaxuatban", nhaxuatbanRouter);

// Import the Sach router
const sachRouter = require("./app/routes/sach.route");

// Use the Sach router
app.use("/api/sach", sachRouter);

// Import the DocGia router
const docgiaRouter = require("./app/routes/docgia.route");

// Use the DocGia router
app.use("/api/docgia", docgiaRouter);

// Import the NhanVien router
const nhanvienRouter = require("./app/routes/nhanvien.route");

// Use the NhanVien router
app.use("/api/nhanvien", nhanvienRouter);

// Import the TheoGioiMuonSach router
const theogioimuonsachRouter = require("./app/routes/theogioimuonsach.route");

// Use the TheoGioiMuonSach router
app.use("/api/theogioimuonsach", theogioimuonsachRouter);

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
    res.json({ message: "Welcome to publisher book application." });
});

module.exports = app;
