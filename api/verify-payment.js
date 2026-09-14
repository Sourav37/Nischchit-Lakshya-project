const crypto = require('crypto');

module.exports = async (req, res) => {

    if (req.method !== 'POST') {

        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body || {};


        /*
         * Validate required fields
         */

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {

            return res.status(400).json({

                success: false,

                verified: false,

                message:
                    'Missing payment verification information.'
            });
        }


        /*
         * Generate expected signature
         */

        const generatedSignature =
            crypto
                .createHmac(
                    'sha256',
                    process.env.RAZORPAY_KEY_SECRET
                )
                .update(
                    `${razorpay_order_id}|${razorpay_payment_id}`
                )
                .digest('hex');


        /*
         * Timing-safe comparison
         */

        const isValid =
            generatedSignature.length ===
            razorpay_signature.length &&
            crypto.timingSafeEqual(
                Buffer.from(generatedSignature),
                Buffer.from(razorpay_signature)
            );


        if (!isValid) {

            return res.status(400).json({

                success: false,

                verified: false,

                message:
                    'Payment signature verification failed.'
            });
        }


        /*
         * Signature verified
         */

        return res.status(200).json({

            success: true,

            verified: true,

            orderId:
                razorpay_order_id,

            paymentId:
                razorpay_payment_id
        });


    } catch (error) {

        console.error(
            'Payment verification error:',
            error
        );

        return res.status(500).json({

            success: false,

            verified: false,

            message:
                'Unable to verify payment.'
        });
    }
};