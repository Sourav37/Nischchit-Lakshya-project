const crypto = require("crypto");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const EXPECTED_AMOUNT = 36900; // ₹369
const EXPECTED_CURRENCY = "INR";

module.exports = async (req, res) => {

    // Only POST requests are allowed
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method not allowed"
        });
    }

    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body || {};

        // -----------------------------------------
        // 1. Validate required Razorpay parameters
        // -----------------------------------------

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                verified: false,
                message: "Payment verification data is incomplete."
            });
        }

        // -----------------------------------------
        // 2. Generate Razorpay signature
        // -----------------------------------------

        const generatedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                `${razorpay_order_id}|${razorpay_payment_id}`
            )
            .digest("hex");

        // -----------------------------------------
        // 3. Compare signatures securely
        // -----------------------------------------

        const receivedSignatureBuffer = Buffer.from(
            razorpay_signature,
            "hex"
        );

        const generatedSignatureBuffer = Buffer.from(
            generatedSignature,
            "hex"
        );

        if (
            receivedSignatureBuffer.length !==
            generatedSignatureBuffer.length
        ) {
            return res.status(400).json({
                success: false,
                verified: false,
                message: "Invalid payment signature."
            });
        }

        const signatureValid = crypto.timingSafeEqual(
            receivedSignatureBuffer,
            generatedSignatureBuffer
        );

        if (!signatureValid) {
            return res.status(400).json({
                success: false,
                verified: false,
                message: "Payment signature verification failed."
            });
        }

        // -----------------------------------------
        // 4. Fetch payment directly from Razorpay
        // -----------------------------------------

        const payment = await razorpay.payments.fetch(
            razorpay_payment_id
        );

        if (!payment) {
            return res.status(400).json({
                success: false,
                verified: false,
                message: "Payment could not be found."
            });
        }

        // -----------------------------------------
        // 5. Verify payment belongs to this order
        // -----------------------------------------

        if (payment.order_id !== razorpay_order_id) {
            return res.status(400).json({
                success: false,
                verified: false,
                message: "Payment does not belong to this order."
            });
        }

        // -----------------------------------------
        // 6. Verify amount
        // -----------------------------------------

        if (Number(payment.amount) !== EXPECTED_AMOUNT) {
            return res.status(400).json({
                success: false,
                verified: false,
                message: "Invalid payment amount."
            });
        }

        // -----------------------------------------
        // 7. Verify currency
        // -----------------------------------------

        if (payment.currency !== EXPECTED_CURRENCY) {
            return res.status(400).json({
                success: false,
                verified: false,
                message: "Invalid payment currency."
            });
        }

        // -----------------------------------------
        // 8. Verify payment status
        // -----------------------------------------

        if (
            payment.status !== "captured" &&
            payment.status !== "authorized"
        ) {
            return res.status(400).json({
                success: false,
                verified: false,
                status: payment.status,
                message: `Payment is not in a valid state. Current status: ${payment.status}`
            });
        }

        // -----------------------------------------
        // 9. Everything verified successfully
        // -----------------------------------------

        return res.status(200).json({
            success: true,
            verified: true,

            message: "Payment verified successfully.",

            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,

            amount: payment.amount,
            currency: payment.currency,
            status: payment.status
        });

    } catch (error) {

        console.error(
            "Razorpay payment verification error:",
            error
        );

        return res.status(500).json({
            success: false,
            verified: false,
            message: "Unable to verify payment."
        });
    }
};