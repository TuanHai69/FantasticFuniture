const express = require('express');
const cors = require("cors");
// const helmet = require('helmet'); // Thêm dòng này cho vnpay 
const ApiError = require("./app/api-error");

const app = express();

const axios = require('axios').default; // npm install axios
const CryptoJS = require('crypto-js'); // npm install crypto-js
const moment = require('moment'); // npm install moment
const qs = require('qs');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Tăng giới hạn kích thước payload cho URL-encoded

// Sử dụng Helmet để thiết lập CSP
// app.use(helmet.contentSecurityPolicy({
//     directives: {
//         defaultSrc: ["'self'"],
//         styleSrc: ["'self'", "'unsafe-inline'"],
//         scriptSrc: ["'self'", "'unsafe-inline'"],
//         imgSrc: ["'self'"] // Thêm dòng này
//     }
// }));

// APP INFO
const config = {
    app_id: "2553",
    key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
    key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
    endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};

app.post("/payment", async (req, res) => {
    const embed_data = {
        redirecturl: "http://localhost:3001/home"
    };

    const items = [{}];
    const transID = Math.floor(Math.random() * 1000000);
    const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`, 
        app_user: "user123",
        app_time: Date.now(), // miliseconds
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: 50000,
        description: `Lazada - Payment for the order #${transID}`,
        bank_code: "",
        callback_url: "https://d5a0-115-76-173-102.ngrok-free.app/callback"
    };

    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
        const result = await axios.post(config.endpoint, null, { params: order });
        return res.status(200).json(result.data);
    } catch (error) {
        console.log(error.message);
    }

})

app.post("/callback", (req, res) => {
    let result = {};

    try {
        let dataStr = req.body.data;
        let reqMac = req.body.mac;

        let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
        console.log("mac =", mac);


        // kiểm tra callback hợp lệ (đến từ ZaloPay server)
        if (reqMac !== mac) {
            // callback không hợp lệ
            result.return_code = -1;
            result.return_message = "mac not equal";
        }
        else {
            // thanh toán thành công
            // merchant cập nhật trạng thái cho đơn hàng
            let dataJson = JSON.parse(dataStr, config.key2);
            console.log("update order's status = success where app_trans_id =", dataJson["app_trans_id"]);

            result.return_code = 1;
            result.return_message = "success";
        }
    } catch (ex) {
        result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
        result.return_message = ex.message;
    }

    // thông báo kết quả cho ZaloPay server
    res.json(result);
});

app.post("/order-status/:app_trans_id", async (req, res) => {
    const app_trans_id = req.params.app_trans_id;

    let postData = {
        app_id: config.app_id,
        app_trans_id: app_trans_id, // Input your app_trans_id
    }

    let data = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1; // appid|app_trans_id|key1
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();


    let postConfig = {
        method: 'post',
        url: 'https://sb-openapi.zalopay.vn/v2/query',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(postData)
    };

    try {
        const result = await axios(postConfig);
        return res.status(200).json(result.data);
    } catch (error) {
        console.log(error.message);
    }

})

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

// Import the Price router
const priceRouter = require("./app/routes/price.route");

// Use the Price router
app.use("/api/price", priceRouter);

// Import VNPay router
const vnpayRouter = require("./app/routes/vnpay.route");

// Use VNPay router
app.use("/api/vnpay", vnpayRouter);

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
