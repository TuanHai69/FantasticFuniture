const crypto = require('crypto');

class VNPayService {
    constructor(terminalId, secretKey) {
        this.terminalId = terminalId;
        this.secretKey = secretKey;
    }

    createSignature(params) {
        const sortedParams = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
        return crypto.createHmac('sha512', this.secretKey).update(sortedParams).digest('hex');
    }

    formatDate(date) {
        const yyyy = date.getFullYear().toString();
        const MM = (date.getMonth() + 1).toString().padStart(2, '0');
        const dd = date.getDate().toString().padStart(2, '0');
        const HH = date.getHours().toString().padStart(2, '0');
        const mm = date.getMinutes().toString().padStart(2, '0');
        const ss = date.getSeconds().toString().padStart(2, '0');
        return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
    }

    createPaymentRequest(amount, orderInfo, returnUrl, ipAddr, bankCode, orderType, locale = 'vn') {
        const params = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: this.terminalId,
            vnp_Amount: amount * 100,
            vnp_CurrCode: 'VND',
            vnp_TxnRef: Date.now().toString(),
            vnp_OrderInfo: orderInfo,
            vnp_OrderType: orderType,
            vnp_Locale: locale,
            vnp_ReturnUrl: returnUrl,
            vnp_IpAddr: ipAddr,
            vnp_CreateDate: this.formatDate(new Date())
        };

        if (bankCode) {
            params.vnp_BankCode = bankCode;
        }

        params.vnp_SecureHash = this.createSignature(params);

        const queryString = Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join('&');
        const paymentUrl = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?${queryString}`;

        return paymentUrl;
    }

    verifyPayment(query) {
        const secureHash = query.vnp_SecureHash;
        delete query.vnp_SecureHash;
        delete query.vnp_SecureHashType;

        const generatedSignature = this.createSignature(query);
        return secureHash === generatedSignature;
    }
}

module.exports = VNPayService;