// NPM packages
const router = require('express').Router()
const qr = require('qr-image');

// Earthy modules
const jwt = require('./jwt')

// Temp modules
const URL = 'http://192.168.1.50:3000'
const coupons = require('./coupon.json')


// GET /coupon/check
const VerifyToken = (req, res)=>{
    // Check Property of token
    if(!req.decoded)
        return res.send('fail')
    const {iss, code, name, number} = req.decoded
    switch(true){
        // EXIST
        case !iss:
        case !code:
        case !name:
        case !number:

        // TYPE
        case typeof iss !== 'string':
        case typeof code !== 'number':
        case typeof name !== 'string':
        case typeof number !== 'string':

        // VALUE
        case iss !== 'jigugong.com':
        case number.length !== 14:
        case number.replace(/-/gi,'').length !== 12:
            return res.json({success:false})

        default:
            break
    }
    const coupon = coupons.list.find((e)=> e.number === number)
    if(coupon.code !== code)
        return res.json({success:false})
    const item = {
        code: 1,
        name: '500원 할인권',
        cost: 500
    }
    console.log(item, number)
    res.json({success:true, data:{item, couponNumber : number}})
}

// GET /coupon/qrcode
const GetQRCode = (req, res)=>{
    const {number} = req.query
    if(!number) return res.redirect('/')
    console.log(number)
    const qrcode = qr.image(`${URL}/use?number=${number}`, { type: 'svg', parse_url:true });
    res.type('svg');
    qrcode.pipe(res);
}

// GET /coupon/use
const checkCoupon = (req, res)=>{
    const {number} = req.query
    
    const coupon = coupons.list.find((e)=> e.number === number)
    const item = {
        code: 1,
        name: '500원 할인권',
        cost: 500
    }

    res.json({success:true, data:{item,coupon}})
}

// POST /coupon/use
const UseCoupon = (req, res)=>{
    const {number, password} = req.body
    console.log(number, password)
    res.json({success:true})
}


// Temp router
const basicRouter = (req,res)=>{
    console.log('jigugong')
    res.send('Jigugong')
}
const createToken = async (req, res)=>{
    const token = await jwt.code({code:1, name:'rltjqdl1138', number:'0000-0000-0000'})
    res.send(token)
}

// Temp router
router.post('/',createToken)
router.get('/', basicRouter)


router.get('/use', checkCoupon)
router.post('/use')
router.get('/qrcode', GetQRCode)
router.use('/*', jwt.middleware)
router.get('/check', VerifyToken)

module.exports = router