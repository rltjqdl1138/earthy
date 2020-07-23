const router = require('express').Router()
const jwt = require('./jwt')
const qr = require('qr-image');  
const coupons = require('./coupon.json')
const coupon = require('./coupon')

const basicRouter = (req,res)=>{
    console.log('hh')
    res.send('hello')
}

router.get('/', basicRouter)
router.use('/coupon', coupon)

module.exports = router


// 상품 코드
// 유저 이름
// 쿠폰 번호


// Unactivated
// Activated
// Expired
// Used


/*
    쿠폰 번호 = 12자리 문자
    쿠폰 인증 번호 = 8자리 숫자



*/