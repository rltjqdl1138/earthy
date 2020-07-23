const jwt = require('jsonwebtoken')
const availableKeys = [
    '0','1','2','3','4','5','6','7','8','9',
    'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'
]

// JWT Configuration
const HEADER_KEY  = 'x-access-token'
const JWT_KEY = 'earthy2020'
const JWT_OPTION = {
    issuer:'jigugong.com'
}

// create token Async
const signToken = ( payload ) =>
    new Promise( (resolve, reject) =>
        jwt.sign(payload, JWT_KEY, JWT_OPTION,
            (err, token) => err ? reject(err) : resolve(token)
))

// decode token Async
const verifyToken = (token) =>
    new Promise( (resolve, reject)=>
        jwt.verify( token, JWT_KEY,
            (err, decoded)=> err ? reject(err) : resolve(decoded)

))

const middleware = (req, res, next) =>{
    const token = req.headers[HEADER_KEY] || req.query.token;
    (async()=>{
        try{
            const decoded = token ? await verifyToken(token) : null
            req.token = token
            req.decoded = decoded
            next()
        }catch(e){
            res.status(400).json({success:false, message:'Unsigned token'})
        }
    })()
}




exports.code = signToken
exports.decode = verifyToken
exports.middleware = middleware