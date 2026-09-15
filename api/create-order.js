const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

module.exports = async (req, res) => {

    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    try {

        const {
            fullName,
            email,
            phone,
            tradingExperience,
            learningGoal,
            contactMethod,
            consent
        } = req.body || {};

        /* -------------------------------------------------------------
           Basic server-side validation
           ------------------------------------------------------------- */

        if (
            !fullName ||
            !email ||
            !phone ||
            !tradingExperience ||
            !learningGoal ||
            (consent !== true && consent !== 'true')
        ) {
            return res.status(400).json({
                success: false,
                message: 'Required registration information is missing.'
            });
        }

        /* -------------------------------------------------------------
           Workshop price
           ₹369 = 36900 paise
           ------------------------------------------------------------- */

        const amount = 36900;

        const receipt = `NL-${Date.now()}`;

        /* -------------------------------------------------------------
           Create Razorpay Order
           ------------------------------------------------------------- */

        const order = await razorpay.orders.create({
            amount,
            currency: 'INR',
            receipt,

            notes: {
                fullName: String(fullName).substring(0, 100),
                email: String(email).substring(0, 100),
                phone: String(phone).substring(0, 20),

                tradingExperience:
                    String(tradingExperience).substring(0, 50),

                learningGoal:
                    String(learningGoal).substring(0, 100),

                contactMethod:
                    String(contactMethod || 'WhatsApp')
                        .substring(0, 30)
            }
        });

        /* -------------------------------------------------------------
           Send only safe information to frontend
           ------------------------------------------------------------- */

        return res.status(200).json({
            success: true,

            keyId: process.env.RAZORPAY_KEY_ID,

            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency
            }
        });

    } catch (error) {

        console.error(
            'Razorpay order creation error:',
            error
        );

        return res.status(500).json({
            success: false,
            message: 'Unable to create payment order.'
        });
    }
};