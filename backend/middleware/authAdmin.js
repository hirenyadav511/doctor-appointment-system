import jwt from "jsonwebtoken"

// admin authentication middleware
const authAdmin = async (req, res, next) => {
    try {
        const { atoken } = req.headers
        if (!atoken) {
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET)

        // Keep in sync with `controllers/adminController.js` dev defaults.
        const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "admin12345";

        if (token_decode !== adminEmail + adminPassword) {
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }
        next()
    } catch (error) {
        console.log(error)
        if (error?.name === 'JsonWebTokenError' || error?.name === 'TokenExpiredError') {
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }
        res.json({ success: false, message: 'Authentication failed' })
    }
}

export default authAdmin;