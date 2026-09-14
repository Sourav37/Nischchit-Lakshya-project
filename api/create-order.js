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


        /*
         * Server-side validation
         */

        if (
            !fullName ||
            !email ||
            !phone ||
            !tradingExperience ||
            !learningGoal ||
            !consent
        ) {

            return res.status(400).json({
                success: false,
                message:
                    'Required registration information is missing.'
            });
        }


        /*
         * IMPORTANT
         *
         * ₹369 = 36900 paise
         *
         * Amount is controlled by SERVER.
         */

        const amount = 36900;


        /*
         * Unique receipt
         */

        const receipt =
            `NL-${Date.now()}`;


        /*
         * Create Razorpay Order
         */

        const order =
            await razorpay.orders.create({

                amount: amount,

                currency: 'INR',

                receipt: receipt,

                notes: {

                    fullName:
                        String(fullName).substring(0, 100),

                    email:
                        String(email).substring(0, 100),

                    phone:
                        String(phone).substring(0, 20),

                    tradingExperience:
                        String(tradingExperience).substring(0, 50),

                    learningGoal:
                        String(learningGoal).substring(0, 100),

                    contactMethod:
                        String(contactMethod || 'WhatsApp')
                            .substring(0, 30)
                }
            });


        /*
         * Send only public information
         * back to browser.
         */

        return res.status(200).json({

            success: true,

            keyId:
                process.env.RAZORPAY_KEY_ID,

            order: {

                id:
                    order.id,

                amount:
                    order.amount,

                currency:
                    order.currency
            }
        });


    } catch (error) {

        console.error(
            'Razorpay order creation error:',
            error
        );

        return res.status(500).json({

            success: false,

            message:
                'Unable to create payment order.'
        });
    }
};