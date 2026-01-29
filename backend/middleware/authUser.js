import jwt from 'jsonwebtoken'

// user authentication middleware
const authUser = async (req, res, next) => {
    const { token } = req.headers
    if (!token) {
        return res.json({ success: false, message: 'Not Authorized Login Again' })
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.body.userId = token_decode.id
        next()
    } catch (error) {
        console.log(error)
        // Common case: JWT secret changed, or token is stale/corrupt
        if (error?.name === 'JsonWebTokenError' || error?.name === 'TokenExpiredError') {
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }
        res.json({ success: false, message: 'Authentication failed' })
    }
}

export default authUser;