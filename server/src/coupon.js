// NPM packages
const router = require('express').Router()
const qr = require('qr-image');
const fs = require('fs')
// Earthy modules
const jwt = require('./jwt')

// Temp modules
const URL = 'http://3.34.178.42/:3000'
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
        name: '알맹상점 1000원 할인권',
        cost: 1000
    }
    res.json({success:true, data:{item, coupon}})
}

// GET /coupon/qrcode
const GetQRCode = (req, res)=>{
    const {number} = req.query
    if(!number) return res.redirect('/')
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
const createToken = async (req, res)=>{
    const {code, name, number} = req.body
    if(!code, !name, !number)
        return res.status(404).end()
    const token = await jwt.code({code, name, number})
    res.send(token)
}
const getCouponList = async(req,res) => res.json({success:true, data:coupons.list})
const updateCoupon = async(req, res)=>{
    const {number, state} = req.body
    if(!number || !state) return res.status(404).end()

    const ind = coupons.list.findIndex(e=>e.number === number)
    console.log(ind)
    if(ind < 0)
        return res.json({success:false})
    coupons.list[ind].state = state
    fs.writeFile('./coupon.json', JSON.stringify(coupons), err => {
        if(err)
            return res.json({success:false})
        return res.json({success:true})
    })
    
}
// Temp router
router.post('/',createToken)
router.get('/', getCouponList)
router.put('/', updateCoupon)


router.get('/use', checkCoupon)
router.post('/use')
router.get('/qrcode', GetQRCode)
router.use('/*', jwt.middleware)
router.get('/check', VerifyToken)

module.exports = router