import jwt from 'jsonwebtoken'

// doctor authentication middleware
const authDoctor = async (req, res, next) => {
    const { dtoken } = req.headers
    if (!dtoken) {
        return res.json({ success: false, message: 'Not Authorized Login Again' })
    }
    try {
        const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET)
        req.body.docId = token_decode.id
        next()
    } catch (error) {
        console.log(error)
        if (error?.name === 'JsonWebTokenError' || error?.name === 'TokenExpiredError') {
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }
        res.json({ success: false, message: 'Authentication failed' })
    }
}

export default authDoctor;