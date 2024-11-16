const VNPayService = require('../services/vnpay.service');
const ApiError = require('../api-error');

const terminalId = 'G02VNTDP';
const secretKey = 'TZUUD2L1F9974IS64TGQ73TD5FGQ1MQV';
const returnUrl = 'https://4905-115-76-173-102.ngrok-free.app/api/vnpay/callback'; 

const vnpayService = new VNPayService(terminalId, secretKey);

exports.createPayment = (req, res, next) => {
    const { amount, orderInfo } = req.body;

    if (!amount || !orderInfo) {
        return next(new ApiError(400, "Amount and order information are required"));
    }

    try {
        const paymentUrl = vnpayService.createPaymentRequest(amount, orderInfo, returnUrl);
        return res.send({ paymentUrl });
    } catch (error) {
        console.error("Error creating payment request:", error);
        return next(new ApiError(500, "Error creating payment request"));
    }
};

exports.verifyPayment = (req, res, next) => {
    const query = req.query;

    try {
        const isValid = vnpayService.verifyPayment(query);
        if (isValid) {
            return res.send({ message: "Payment verified successfully", data: query });
        } else {
            return next(new ApiError(400, "Invalid payment verification"));
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        return next(new ApiError(500, "Error verifying payment"));
    }
};
